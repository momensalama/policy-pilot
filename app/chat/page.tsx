import { redirect } from "next/navigation";
import { getAssessment } from "@/app/actions/assessment";

export default async function ChatPage() {
  const assessment = await getAssessment();

  if (!assessment) {
    redirect("/assessment");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Chat Interface</p>
    </div>
  );
}
