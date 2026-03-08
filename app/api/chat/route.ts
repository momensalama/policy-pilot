import { streamText } from "ai";
import { model } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/policy-tools";
import { getAssessment } from "@/app/actions/assessment";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const assessment = await getAssessment();
  if (!assessment) {
    return new Response("Assessment not found", { status: 400 });
  }

  const result = streamText({
    model,
    system: buildSystemPrompt(assessment),
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  return result.toTextStreamResponse();
}
