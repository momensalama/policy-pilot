import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPolicies } from "@/app/actions/policies";
import { getAssessment } from "@/app/actions/assessment";
import { PoliciesPageClient } from "@/components/policies/policiesPage";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "View, edit, and manage your AI-generated company policies in a rich text editor.",
};

export default async function PoliciesPage() {
  const assessment = await getAssessment();

  if (!assessment) {
    redirect("/assessment");
  }

  const allPolicies = await getPolicies();

  return <PoliciesPageClient policies={allPolicies} />;
}
