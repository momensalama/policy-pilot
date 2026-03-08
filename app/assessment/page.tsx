import { redirect } from "next/navigation";
import { getAssessment } from "@/app/actions/assessment";

interface AssessmentPageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AssessmentPage({
  searchParams,
}: Readonly<AssessmentPageProps>) {
  const params = await searchParams;
  const assessment = await getAssessment();

  if (assessment && params.edit !== "true") {
    redirect("/chat");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Assessment Wizard </p>
    </div>
  );
}
