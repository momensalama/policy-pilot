"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ShareholderInput } from "./shareholderInput";
import { ReviewCard } from "./reviewCard";

import { WIZARD_STEPS } from "@/lib/constants";
import type { useWizardForm } from "@/hooks/useWizardForm";

interface StepContentProps {
  step: number;
  formData: ReturnType<typeof useWizardForm>["formData"];
  errors: Record<string, string>;
  updateField: ReturnType<typeof useWizardForm>["updateField"];
  updateShareholders: ReturnType<typeof useWizardForm>["updateShareholders"];
  goNext: () => void;
}

export function StepContent({
  step,
  formData,
  errors,
  updateField,
  updateShareholders,
  goNext,
}: Readonly<StepContentProps>) {
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") goNext();
  };

  switch (step) {
    case WIZARD_STEPS.COMPANY_NAME:
      return (
        <Field label="Company name" error={errors.companyName}>
          <Input
            autoFocus
            placeholder="Acme Inc."
            value={formData.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            onKeyDown={onEnter}
          />
        </Field>
      );
    case WIZARD_STEPS.COMPANY_EMAIL:
      return (
        <Field label="Company email" error={errors.companyEmail}>
          <Input
            autoFocus
            type="email"
            placeholder="hello@acme.com"
            value={formData.companyEmail}
            onChange={(e) => updateField("companyEmail", e.target.value)}
            onKeyDown={onEnter}
          />
        </Field>
      );
    case WIZARD_STEPS.LOCATION:
      return (
        <Field label="Company location" error={errors.companyLocation}>
          <Input
            autoFocus
            placeholder="Qatar, Doha"
            value={formData.companyLocation}
            onChange={(e) => updateField("companyLocation", e.target.value)}
            onKeyDown={onEnter}
          />
        </Field>
      );
    case WIZARD_STEPS.SHAREHOLDERS:
      return (
        <div className="space-y-2">
          <Label>Shareholders</Label>
          <ShareholderInput
            shareholders={formData.shareholders}
            onChange={updateShareholders}
            error={errors.shareholders}
          />
        </div>
      );
    case WIZARD_STEPS.ACTIVITY:
      return (
        <Field label="Primary company activity" error={errors.primaryActivity}>
          <Textarea
            autoFocus
            placeholder="Software development and IT consulting..."
            className="max-h-48 overflow-y-auto resize-none"
            value={formData.primaryActivity}
            onChange={(e) => updateField("primaryActivity", e.target.value)}
          />
        </Field>
      );
    case WIZARD_STEPS.REVIEW:
      return <ReviewCard data={formData} />;
    default:
      return null;
  }
}

/* ── Reusable field wrapper ── */

function Field({
  label,
  error,
  children,
}: Readonly<{
  label: string;
  error?: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
