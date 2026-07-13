import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { mockModel } from "@/lib/mock-model";
import { getCurrentUser } from "@/lib/auth";
import { getSourcesByIds } from "@/lib/vector-store";
import { buildSystemPrompt } from "@/lib/prompt";

interface ChatBody {
  messages: UIMessage[];
  sourceIds?: string[];
}

export async function POST(req: Request) {
  const { messages, sourceIds = [] } = (await req.json()) as ChatBody;
  const user = getCurrentUser();

  // Look up the sources the user attached and build the grounding prompt.
  const sources = getSourcesByIds(sourceIds);
  const system = buildSystemPrompt(sources);

  const result = streamText({
    model: mockModel,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
