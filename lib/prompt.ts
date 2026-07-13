import type { KnowledgeSource } from "./vector-store";

const BASE_INSTRUCTIONS =
  "You are a legal assistant for a law firm. Answer the user's question using ONLY the knowledge sources provided below. If no sources are provided, say that you cannot ground an answer.";

/**
 * Assemble the system prompt from the base instructions plus any attached
 * knowledge sources.
 */
export function buildSystemPrompt(sources: KnowledgeSource[]): string {
  if (sources.length === 0) {
    return BASE_INSTRUCTIONS;
  }
  const sourceBlock = sources
    .map((s) => `- "${s.title}" (${s.matterId}): ${s.content}`)
    .join("\n");
  return `${BASE_INSTRUCTIONS}\n\nKNOWLEDGE SOURCES:\n${sourceBlock}`;
}
