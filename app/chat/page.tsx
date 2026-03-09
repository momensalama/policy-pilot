import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAssessment } from "@/app/actions/assessment";
import { getMessages } from "@/app/actions/chat";
import { ChatInterface } from "@/components/chat/chatInterface";
import type { UIMessage } from "ai";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Ask questions about your company and generate tailored policies using AI.",
};

export default async function ChatPage() {
  const assessment = await getAssessment();

  if (!assessment) {
    redirect("/assessment");
  }

  const dbMessages = await getMessages();

  const initialMessages: UIMessage[] = dbMessages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    parts: [{ type: "text" as const, text: m.content }],
    createdAt: m.createdAt,
  }));

  return (
    <ChatInterface
      companyName={assessment.companyName}
      assessmentId={assessment.id}
      initialMessages={initialMessages}
    />
  );
}
