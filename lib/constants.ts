export const WIZARD_STEPS = {
  COMPANY_NAME: 0,
  COMPANY_EMAIL: 1,
  LOCATION: 2,
  SHAREHOLDERS: 3,
  ACTIVITY: 4,
  REVIEW: 5,
  TOTAL: 6,
} as const;

// Policy detection: the AI prefixes generated policies with this marker
export const POLICY_MARKER = "# Policy:";
