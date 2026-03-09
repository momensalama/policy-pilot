import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { model } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/policy-tools";
import { getAssessment } from "@/app/actions/assessment";
import { saveAssistantMessage, saveUserMessage } from "@/app/actions/chat";

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
    onFinish: async ({ text }) => {
      // Persist messages after streaming completes
      const lastUserMsg = messages.findLast((m) => m.role === "user");
      if (lastUserMsg) {
        const userText =
          lastUserMsg.parts
            ?.filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("") ?? lastUserMsg;
        await saveUserMessage(userText);
      }

      if (text) {
        await saveAssistantMessage(text);
      }
    },
  });

  return result.toTextStreamResponse();
}
