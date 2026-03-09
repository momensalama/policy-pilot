import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAssessment } from "@/app/actions/assessment";
import { AssessmentWizard } from "@/components/assessment/assessmentWizard";
import { DotPattern } from "@/components/ui/dot-pattern";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Company Assessment",
  description:
    "Complete a guided assessment to provide your company details — name, email, location, shareholders, and primary activity.",
};

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
    <div className="relative flex min-h-screen items-center justify-center px-4 py-0 md:py-12">
      <DotPattern className="opacity-30" />
      <div className="relative z-10 w-full">
        <AssessmentWizard initialData={assessment} />
      </div>
    </div>
  );
}
