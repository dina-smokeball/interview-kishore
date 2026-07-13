/**
 * Deterministic mock LLM that implements the AI SDK v5 LanguageModelV2 interface.
 *
 * It is intentionally simple: it reads the system prompt it was given and
 * answers by listing the knowledge-source titles it can see. That means the
 * answer makes it visible whether the relevant sources were actually passed
 * to the model. You should not need to touch this file.
 */
import type {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2StreamPart,
} from "@ai-sdk/provider";

type Prompt = LanguageModelV2CallOptions["prompt"];

function readPrompt(prompt: Prompt): { system: string; lastUser: string } {
  let system = "";
  let lastUser = "";
  for (const message of prompt) {
    if (message.role === "system") {
      system += message.content + "\n";
    } else if (message.role === "user") {
      lastUser = message.content
        .filter((part) => part.type === "text")
        .map((part) => (part as { type: "text"; text: string }).text)
        .join(" ");
    }
  }
  return { system, lastUser };
}

function composeAnswer(system: string, lastUser: string): string {
  const titles = Array.from(system.matchAll(/- "([^"]+)"/g)).map((m) => m[1]);
  if (titles.length === 0) {
    return `I don't have any knowledge sources to work from, so I can't ground an answer to "${lastUser}". Please attach a source.`;
  }
  return `Based on ${titles.length} source(s) — ${titles.join("; ")} — here is a grounded summary for "${lastUser}". (mock response)`;
}

export const mockModel: LanguageModelV2 = {
  specificationVersion: "v2",
  provider: "mock",
  modelId: "mock-legal-assistant",
  supportedUrls: {},

  async doGenerate(options) {
    const { system, lastUser } = readPrompt(options.prompt);
    return {
      content: [{ type: "text", text: composeAnswer(system, lastUser) }],
      finishReason: "stop",
      usage: { inputTokens: 12, outputTokens: 24, totalTokens: 36 },
      warnings: [],
    };
  },

  async doStream(options) {
    const { system, lastUser } = readPrompt(options.prompt);
    const tokens = composeAnswer(system, lastUser).split(/(\s+)/);
    const id = "text-1";

    const stream = new ReadableStream<LanguageModelV2StreamPart>({
      async start(controller) {
        controller.enqueue({ type: "stream-start", warnings: [] });
        controller.enqueue({ type: "text-start", id });
        for (const token of tokens) {
          controller.enqueue({ type: "text-delta", id, delta: token });
          await new Promise((r) => setTimeout(r, 18));
        }
        controller.enqueue({ type: "text-end", id });
        controller.enqueue({
          type: "finish",
          finishReason: "stop",
          usage: { inputTokens: 12, outputTokens: tokens.length, totalTokens: 12 + tokens.length },
        });
        controller.close();
      },
    });

    return { stream };
  },
};
