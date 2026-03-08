import { useState, useCallback } from "react";
import { STEP_FIELDS, WIZARD_STEPS } from "@/lib/constants";
import { assessmentSchema } from "@/lib/validations";
import type {
  AssessmentFormData,
  ShareholderFormData,
} from "@/lib/validations";
import type { AssessmentWithShareholders } from "@/db/schema";

function buildInitialData(
  initial?: AssessmentWithShareholders | null,
): AssessmentFormData {
  return {
    companyName: initial?.companyName ?? "",
    companyEmail: initial?.companyEmail ?? "",
    companyLocation: initial?.companyLocation ?? "",
    primaryActivity: initial?.primaryActivity ?? "",
    shareholders: initial?.shareholders.map((s) => ({
      name: s.name,
      sharePercentage: Number(s.sharePercentage),
    })) ?? [{ name: "", sharePercentage: 0 }],
  };
}

function validateStep(
  step: number,
  data: AssessmentFormData,
): Record<string, string> {
  const result = assessmentSchema.safeParse(data);
  if (result.success) return {};

  const fields = STEP_FIELDS[step] ?? [];
  const errors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const field = String(issue.path[0]);
    if (fields.includes(field as keyof AssessmentFormData)) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export function useWizardForm(initial?: AssessmentWithShareholders | null) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState(() => buildInitialData(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(
    <K extends keyof AssessmentFormData>(
      key: K,
      value: AssessmentFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
    },
    [],
  );

  const updateShareholders = useCallback(
    (shareholders: ShareholderFormData[]) => {
      setFormData((prev) => ({ ...prev, shareholders }));
      setErrors((prev) => ({ ...prev, shareholders: "" }));
    },
    [],
  );

  const goNext = useCallback(() => {
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.REVIEW));
  }, [step, formData]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const isFirstStep = step === 0;
  const isReviewStep = step === WIZARD_STEPS.REVIEW;

  return {
    step,
    direction,
    formData,
    errors,
    isFirstStep,
    isReviewStep,
    updateField,
    updateShareholders,
    goNext,
    goBack,
  };
}
