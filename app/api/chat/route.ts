import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { model } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/policy-tools";
import { getAssessment } from "@/app/actions/assessment";
import { saveAssistantMessage, saveUserMessage } from "@/app/actions/chat";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const assessment = await getAssessment();
  if (!assessment) {
    return new Response("Assessment not found", { status: 400 });
  }

  const result = streamText({
    model,
    system: buildSystemPrompt(assessment),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: finishedMessages }) => {
      // Persist the latest user + assistant messages
      const lastUser = finishedMessages.findLast((m) => m.role === "user");
      const lastAssistant = finishedMessages.findLast(
        (m) => m.role === "assistant",
      );

      if (lastUser) {
        const text = lastUser.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("");
        await saveUserMessage(text);
      }

      if (lastAssistant) {
        const text = lastAssistant.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("");
        await saveAssistantMessage(text);
      }
    },
  });
}
