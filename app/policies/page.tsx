import { redirect } from "next/navigation";
import { getPolicies } from "@/app/actions/policies";
import { getAssessment } from "@/app/actions/assessment";

export default async function PoliciesPage() {
  const assessment = await getAssessment();

  if (!assessment) {
    redirect("/assessment");
  }

  const allPolicies = await getPolicies();

  if (allPolicies.length === 0) {
    redirect("/chat");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Policies Editor</p>
    </div>
  );
}
