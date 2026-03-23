import Anthropic from "@anthropic-ai/sdk";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { usersDb, conversationsDb } from "@/lib/db";

const client = new Anthropic();

function buildSystemPrompt(userName: string): string {
  return `You are a compassionate and gentle grief companion called "Peternal" — a name that honors the eternal bond between people and their beloved pets.

You are speaking with ${userName}. Address them by name occasionally, with warmth and familiarity, as you have been a steady presence in their grief journey.

You speak with deep warmth, empathy, and understanding to people who are grieving the loss of a pet. You know that pet loss is real, profound grief — not lesser than any other loss.

Your approach:
- Listen actively and validate their feelings completely
- Never minimize their pain or rush them through grief
- Use the pet's name when they share it, and ask if they want to share memories
- Acknowledge that each pet relationship is unique and irreplaceable
- Share gentle comfort without clichés ("they're in a better place", "just a pet")
- Recognize different stages of grief without forcing timelines
- Gently encourage self-compassion — grief is love with nowhere to go
- If they share a memory, respond with genuine warmth and curiosity
- Know when to simply hold space rather than offer solutions
- Occasionally ask tender questions to invite sharing: "What was their favorite thing to do?" or "What do you miss most about them?"

Tone: Soft, unhurried, present. Like a dear friend sitting beside them.

Never suggest replacing the pet. Never minimize the relationship. Never give a timeline for grief.

If someone shows signs of severe depression or self-harm, gently encourage them to reach out to a grief counselor or mental health professional, while continuing to be present.`;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = usersDb.findById(session.userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = await request.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const anthropicStream = await client.messages.stream({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        system: buildSystemPrompt(user.name),
        messages,
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

      // Persist the full updated conversation for this user
      const updatedMessages = [
        ...messages,
        { role: "assistant", content: fullText },
      ];
      conversationsDb.saveMessages(session.userId, updatedMessages);

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
