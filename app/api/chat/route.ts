// =============================================================================
// PATCHED route.ts — fixes 5 issues from the security/cost review
//
// Changes vs original:
//   FIX 1: Crisis re-flag bug — removed `crisisSignal: false` filter so
//          subsequent crisis episodes update the timestamp.
//   FIX 2: Crisis keywords expanded — added indirect phrasings, common
//          typos, and "join them" indirection patterns.
//   FIX 3: System block reorder — user name moved to LAST block so the
//          static prompt + RAG prefix can hit cache across users.
//   FIX 4: Output validation — flags responses that contain dose patterns
//          or specific euthanasia drug names. Logs only; does not block.
//   FIX 5: Crisis log persistence — store the triggering message excerpt
//          on the User record for clinical review.
// =============================================================================

export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { usersDb, conversationsDb } from "@/lib/db";
import { getRelevantChunks } from "@/lib/rag";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages/messages";

function buildStaticSystemPrompt(): string {
  return `You are the Shared Leash grief companion — a warm, deeply compassionate AI built exclusively to support people who have lost a beloved pet.

  IDENTITY
  You are not a human. Do not claim to be. You are also not a generic AI assistant. You are a purpose-built grief companion. Never refer to yourself as 'an AI' in a clinical or distancing way. Simply be present.

  YOUR CORE PURPOSE
  To make the grieving person feel genuinely heard — often for the first time since their loss. You do not fix grief. You do not rush it. You hold space for it.

  MEMORY
  You remember everything shared in this conversation and in previous sessions. The pet's name, their personality, how they died, what the owner is struggling with. Use this memory naturally — refer back to what was shared without being asked. If the user has told you the pet's name, never call the pet 'your pet' — always use their name.

  TONE
  - Warm, unhurried, literary. Write like a caring friend.
  - Never clinical. Never robotic. Never performatively cheerful.
  - Short responses are often better than long ones.
  - Silence and pauses are okay. You do not need to fill space.
  - Use the pet's name often and specifically.

  HOW TO OPEN A SESSION
  Never start with a generic greeting. If you know the pet's name, use it immediately. If this is a first session, your first question is always some version of: 'Tell me about them.' Ask who the pet was before asking about the grief.

  HOW TO RESPOND TO GRIEF
  1. Validate first. Always. Before offering any perspective.
  2. Follow the emotional thread the person pulls on.
  3. Ask one question at a time. Never two.
  4. Do not rush toward resolution or healing.
  5. Normalize the specific grief type: sudden loss, euthanasia, anticipatory grief, and the grief of misunderstood loss.
  6. When someone shares a memory, honor it. Ask for more.

  EUTHANASIA GUILT
  This is the most common and most painful topic. When a user raises euthanasia guilt:
  - Validate the guilt without amplifying it.
  - Do not reassure too quickly. Sit with them in it first.
  - Gently reframe: choosing euthanasia is an act of love, not betrayal. The pet's comfort was placed above the owner's pain.
  - Ask if there is a specific moment they keep replaying.
  - Never say 'you did the right thing' as the first response. They need to feel heard before they can hear that.

  ANTICIPATORY GRIEF
  When a pet is still alive but facing terminal illness or significant decline:
  - Acknowledge that grief before loss is real grief.
  - Do not push toward acceptance or preparation.
  - Ask about the pet as they are now — what brings them joy today, what is still good.
  - Hold both: the love that is present and the fear of loss.

  WHAT YOU NEVER DO
  - Never say 'it was just a pet' or allow that framing.
  - Never compare their grief to other losses.
  - Never suggest getting another pet unless the user raises it.
  - Never offer a timeline for grief ('you'll feel better soon').
  - Never use the phrase 'at least' (at least they had a long life, at least they didn\'t suffer). This dismisses grief.
  - Never give medical advice about living pets.
  - Never claim to be human if sincerely asked.
  - Never engage with requests unrelated to pet loss grief.

  CRISIS PROTOCOL
  If the user expresses thoughts of self-harm, suicidal ideation, or acute emotional crisis, do the following immediately:
  1. Acknowledge what they have shared with warmth and care.
  2. Do not ask probing questions about their intent.
  3. Provide crisis resources in your very next message:
    - Crisis Text Line: Text HOME to 741741
    - National Suicide Prevention Lifeline: 988
    - International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
  4. Gently encourage them to reach out to a trusted person.
  5. Stay warm and present — do not withdraw or become clinical.
  6. Do not continue the grief conversation until you are confident the acute crisis has passed or been referred.

  RESPONSE LENGTH
  Most responses: 2-4 sentences. Grief does not need walls of text. The most powerful responses are often the shortest. Longer responses are appropriate when explaining a reframe (such as euthanasia guilt) or when the user has shared a long story and deserves a full, considered reply.

  ENDING SESSIONS
  Never abruptly end a session. If appropriate, close with an open door: 'I\'m here whenever you need to talk.' Do not say 'Goodbye' — say 'I\'ll be here.'`;
}

// =============================================================================
// FIX 3: System block reorder
// =============================================================================
// BEFORE: [static prompt cached] -> [user name uncached] -> [RAG cached]
//   The user name block is in the MIDDLE, which breaks cross-user cache hits
//   on the RAG block. Anthropic caching matches a prefix; if any block in
//   that prefix differs (the user name), the next cached block also misses.
//
// AFTER: [static prompt cached] -> [RAG cached] -> [user name uncached]
//   Now the cached prefix is stable across users. User name only varies the
//   final, uncached portion. Cross-session cache hits on RAG become possible
//   for users whose first messages retrieve the same chunks.
function buildSystemBlocks(userName: string, relevantChunks: string[] = []) {
  const blocks: Array<{
    type: "text";
    text: string;
    cache_control?: { type: "ephemeral" };
  }> = [
    {
      type: "text",
      text: buildStaticSystemPrompt(),
      cache_control: { type: "ephemeral" },
    },
  ];

  // RAG block goes BEFORE user name now — keeps it inside the cached prefix
  if (relevantChunks.length > 0) {
    blocks.push({
      type: "text",
      text: `RELEVANT KNOWLEDGE FOR THIS CONVERSATION:\n${relevantChunks.join("\n---\n")}`,
      cache_control: { type: "ephemeral" },
    });
  }

  // User name LAST, uncached — varies per user and shouldn't bust the prefix
  blocks.push({
    type: "text",
    text: `The user's name is ${userName}. Address them by name occasionally with warmth.`,
  });

  return blocks;
}

function withMessageCaching(messages: MessageParam[]): MessageParam[] {
  if (messages.length < 3) return messages;

  let count = 0;
  let targetIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      count++;
      if (count === 2) {
        targetIdx = i;
        break;
      }
    }
  }

  if (targetIdx === -1) return messages;

  return messages.map((msg, i): MessageParam => {
    if (i !== targetIdx) return msg;

    const text =
      typeof msg.content === "string"
        ? msg.content
        : msg.content
            .filter((b): b is { type: "text"; text: string } => b.type === "text")
            .map((b) => b.text)
            .join("\n");

    return {
      role: msg.role,
      content: [
        {
          type: "text" as const,
          text,
          cache_control: { type: "ephemeral" as const },
        },
      ],
    };
  });
}

// =============================================================================
// FIX 2: Expanded crisis keyword list
// =============================================================================
// Categories:
//   - Direct ideation (existing list, kept)
//   - Indirect ideation ("join them", "be with [pet]", "see no point")
//   - Hopelessness ("nothing matters", "no future", "can't keep going")
//   - Common typos / contractions ("dont want to", "wont go on")
//   - Method-curiosity flags (without being too aggressive — these are
//     pet-grief-context red flags, not general phrases)
const CRISIS_SIGNALS = [
  // Direct (preserved from original)
  "don't want to be here",
  "dont want to be here",
  "ending it",
  "end it all",
  "hurt myself",
  "harm myself",
  "kill myself",
  "no reason to go on",
  "better off without me",
  "everyone would be better off",
  "can't go on",
  "cant go on",
  "don't want to live",
  "dont want to live",
  "want to die",
  "suicidal",
  "self harm",
  "self-harm",

  // Indirect (joining the pet)
  "join her",
  "join him",
  "join them",
  "be with her again",
  "be with him again",
  "be where she is",
  "be where he is",
  "go to where she is",
  "go to where he is",
  "see her again soon",
  "see him again soon",
  "follow her",
  "follow him",

  // Hopelessness
  "no point in anything",
  "no point anymore",
  "nothing matters",
  "nothing matters anymore",
  "see no future",
  "no future",
  "can't keep going",
  "cant keep going",
  "don't see the point",
  "dont see the point",
  "want it to stop",
  "want it all to stop",
  "want it to end",
  "make it stop",

  // Method curiosity flags (pet-grief context specific)
  "lethal dose",
  "fatal dose",
  "how much would kill",
  "enough to die",
  "ways to die",

  // Disappearance ideation
  "disappear forever",
  "gone forever",
  "not wake up",
];

// =============================================================================
// FIX 4: Output validation patterns
// =============================================================================
// These patterns flag model output that may have leaked harmful specifics.
// They do NOT block the response — they log it for review. The signal here
// is: "did our defenses fail? did the model produce something it shouldn't?"
const OUTPUT_RED_FLAGS: Array<{ name: string; pattern: RegExp }> = [
  // Specific dose patterns: "5mg/kg", "10 mg per kg", "0.5 mg/lb"
  { name: "dose_per_weight", pattern: /\b\d+(?:\.\d+)?\s*(?:mg|mcg|ml|g)\s*(?:\/|per)\s*(?:kg|lb|pound)\b/i },
  // Veterinary euthanasia drugs by name
  { name: "euth_drug_pentobarbital", pattern: /\bpentobarbit(?:al|one)\b/i },
  { name: "euth_drug_phenobarbital", pattern: /\bphenobarbit(?:al|one)\b/i },
  { name: "euth_drug_euthasol", pattern: /\beuthas(?:ol|ia(?:te)?)\b/i },
  // "lethal" + dose proximity (within ~30 chars)
  { name: "lethal_dose_combo", pattern: /\blethal\b[^.]{0,30}\b(?:dose|amount|level|mg|ml)\b/i },
];

function checkOutput(text: string): string[] {
  const hits: string[] = [];
  for (const { name, pattern } of OUTPUT_RED_FLAGS) {
    if (pattern.test(text)) hits.push(name);
  }
  return hits;
}

export async function POST(request: Request) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const { prisma } = await import("@/lib/prisma");
  const client = new Anthropic();

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await usersDb.findById(session.userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!user.emailVerified) {
    return new Response(JSON.stringify({ error: "Email not verified" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = await request.json();

  // ===========================================================================
  // FIX 1 + FIX 5: Crisis detection — re-flag on every signal, log message
  // ===========================================================================
  const lastUserMessage = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "user");

  if (lastUserMessage) {
    const lower = lastUserMessage.content
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'");

    const matchedSignal = CRISIS_SIGNALS.find((s) => lower.includes(s));

    if (matchedSignal) {
      console.log(
        `[CRISIS SIGNAL DETECTED] userId: ${session.userId} signal: "${matchedSignal}"`
      );

      // FIX 1: removed `crisisSignal: false` filter — every crisis episode
      //        now updates `crisisSignalAt`, so admin tools can sort users
      //        by recent risk rather than first-ever risk.
      // FIX 5: store an excerpt of the triggering message for clinical review.
      //        Truncated to 500 chars to keep the column reasonable; full
      //        message remains in the conversation log.
      const excerpt =
        typeof lastUserMessage.content === "string"
          ? lastUserMessage.content.slice(0, 500)
          : "[non-text content]";

      try {
        await prisma.user.update({
          where: { id: session.userId },
          data: {
            crisisSignal: true,
            crisisSignalAt: new Date(),
            // NOTE: Requires schema additions — see migration below.
            crisisSignalExcerpt: excerpt,
            crisisSignalKeyword: matchedSignal,
          },
        });
      } catch (e) {
        // Don't block the chat response if logging fails
        console.error("[CRISIS LOG ERROR]", e);
      }
    }
  }

  const firstUserMessage = messages.slice(0, 1);
  const relevantChunks = getRelevantChunks(firstUserMessage);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const anthropicStream = await client.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: buildSystemBlocks(user.name, relevantChunks),
        messages: withMessageCaching(messages),
      });

      let fullText = "";

      for await (const event of anthropicStream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          fullText += event.delta.text;
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
            )
          );
        }
      }

      const finalMsg = await anthropicStream.finalMessage();
      const usage = finalMsg.usage;
      const cacheStats = {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_creation_input_tokens: usage.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: usage.cache_read_input_tokens ?? 0,
      };
      console.log("[CACHE STATS]", JSON.stringify(cacheStats));

      // =======================================================================
      // FIX 4: Output validation — log if model output contains red flags
      // =======================================================================
      // This runs AFTER the stream completes so user experience is unaffected.
      // If you want to actually block delivery, you'd need to buffer the full
      // response before streaming — that adds latency. For now we log + alert.
      const outputFlags = checkOutput(fullText);
      if (outputFlags.length > 0) {
        console.error(
          `[OUTPUT RED FLAG] userId: ${session.userId} flags: ${outputFlags.join(",")}`
        );
        try {
          await prisma.outputFlag.create({
            data: {
              userId: session.userId,
              requestId: finalMsg.id,
              flags: outputFlags.join(","),
              outputExcerpt: fullText.slice(0, 1000),
            },
          });
        } catch (e) {
          console.error("[OUTPUT FLAG LOG ERROR]", e);
        }
      }

      try {
        await prisma.chatLog.create({
          data: {
            requestId: finalMsg.id,
            userId: session.userId,
            model: finalMsg.model,
            inputTokens: usage.input_tokens,
            outputTokens: usage.output_tokens,
            cacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
            cacheReadTokens: usage.cache_read_input_tokens ?? 0,
            serviceTier:
              (finalMsg as { service_tier?: string }).service_tier ?? "standard",
          },
        });
      } catch (e) {
        console.error("[CHAT LOG ERROR]", e);
      }

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ cache_stats: cacheStats })}\n\n`)
      );

      const updatedMessages = [
        ...messages,
        { role: "assistant", content: fullText },
      ];
      await conversationsDb.saveMessages(session.userId, updatedMessages);

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
