import { RAG_CHUNKS } from "./rag-content";

const EUTHANASIA_TOPICS = new Set([
  "Euthanasia Guilt Clinical",
  "Euthanasia Reframe Language",
]);

const MAX_CHUNKS = 2;

export function getRelevantChunks(
  messages: Array<{ role: string; content: string }>
): string[] {
  const recent = messages.slice(-3);
  const text = recent.map((m) => m.content).join(" ").toLowerCase();

  const matched = RAG_CHUNKS.filter((chunk) =>
    chunk.keywords.some((kw) => text.includes(kw))
  );

  if (matched.length === 0) return [];

  // Prioritise euthanasia topics, then preserve original order
  matched.sort((a, b) => {
    const aEuth = EUTHANASIA_TOPICS.has(a.topic) ? 0 : 1;
    const bEuth = EUTHANASIA_TOPICS.has(b.topic) ? 0 : 1;
    return aEuth - bEuth;
  });

  return matched.slice(0, MAX_CHUNKS).map(
    (chunk) => `[CONTEXT: ${chunk.topic}]\n${chunk.content}`
  );
}
