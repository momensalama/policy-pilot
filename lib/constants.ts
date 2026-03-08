import { AssessmentFormData } from "./validations";

export const ACTIVITY_PREVIEW_LENGTH = 100;

export const WIZARD_STEPS = {
  COMPANY_NAME: 0,
  COMPANY_EMAIL: 1,
  LOCATION: 2,
  SHAREHOLDERS: 3,
  ACTIVITY: 4,
  REVIEW: 5,
  TOTAL: 6,
} as const;

export const STEP_LABELS = [
  "Company",
  "Email",
  "Location",
  "Shareholders",
  "Activity",
];

export const STEP_TITLES = [
  "What's your company name?",
  "What's your company email?",
  "Where is your company located?",
  "Who are the shareholders?",
  "What's the primary company activity?",
  "Everything look good?",
];

export const SLIDE_TRANSITION = {
  duration: 0.35,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

// Maps each wizard step to the schema fields it should validate.
export const STEP_FIELDS: Record<number, (keyof AssessmentFormData)[]> = {
  [WIZARD_STEPS.COMPANY_NAME]: ["companyName"],
  [WIZARD_STEPS.COMPANY_EMAIL]: ["companyEmail"],
  [WIZARD_STEPS.LOCATION]: ["companyLocation"],
  [WIZARD_STEPS.SHAREHOLDERS]: ["shareholders"],
  [WIZARD_STEPS.ACTIVITY]: ["primaryActivity"],
};

// Policy detection: the AI prefixes generated policies with this marker
export const POLICY_MARKER = "# Policy:";
