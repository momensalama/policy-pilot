import { redirect } from "next/navigation";
import { getPolicies } from "@/app/actions/policies";
import { getAssessment } from "@/app/actions/assessment";
import { PoliciesPageClient } from "@/components/policies/policiesPage";

export default async function PoliciesPage() {
  const assessment = await getAssessment();

  if (!assessment) {
    redirect("/assessment");
  }

  const allPolicies = await getPolicies();

  if (allPolicies.length === 0) {
    redirect("/chat");
  }

  return <PoliciesPageClient policies={allPolicies} />;
}
