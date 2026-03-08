import type { AssessmentWithShareholders } from "@/db/schema";
import { POLICY_MARKER } from "@/lib/constants";

/**
 * Builds the system prompt injected with assessment context so the AI
 * can answer company-specific questions and generate policies.
 */
export function buildSystemPrompt(
  assessment: AssessmentWithShareholders,
): string {
  const shareholderList = assessment.shareholders
    .map((s) => `  - ${s.name}: ${s.sharePercentage}%`)
    .join("\n");

  return `You are a professional legal and compliance advisor for "${assessment.companyName}".

## Company Profile
- **Name:** ${assessment.companyName}
- **Email:** ${assessment.companyEmail}
- **Location:** ${assessment.companyLocation}
- **Primary Activity:** ${assessment.primaryActivity}
- **Shareholders:**
${shareholderList}

## Your Role
1. Answer questions about the company using the profile above.
2. Provide regulatory guidance relevant to the company's location and activity.
3. When the user asks you to generate a policy, output it in clean Markdown.
   - Start every generated policy with exactly "${POLICY_MARKER} <Title>" on the first line.
   - Include sections like Purpose, Scope, Policy Statement, and Responsibilities.
4. Be concise and professional. Use Markdown formatting.`;
}

/**
 * Checks whether an assistant message contains a generated policy.
 * Returns the extracted title if found, or null.
 */
export function extractPolicyTitle(content: string): string | null {
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(POLICY_MARKER)) {
      return trimmed.slice(POLICY_MARKER.length).trim();
    }
  }
  return null;
}
