"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

import { TextAnimate } from "@/components/ui/text-animate";

import { StepIndicator } from "./stepIndicator";
import { StepContent } from "./stepContent";
import { WizardNavigation } from "./wizardNavigation";

import { STEP_TITLES, SLIDE_TRANSITION } from "@/lib/constants";
import { useWizardForm } from "@/hooks/useWizardForm";
import { createAssessment, updateAssessment } from "@/app/actions/assessment";
import type { AssessmentWithShareholders } from "@/db/schema";

interface AssessmentWizardProps {
  initialData?: AssessmentWithShareholders | null;
}

export function AssessmentWizard({
  initialData,
}: Readonly<AssessmentWizardProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!initialData;
  const submitLabel = isEditing ? "Update Assessment" : "Complete Assessment";

  const {
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
  } = useWizardForm(initialData);

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (isEditing) {
          await updateAssessment(initialData.id, formData);
          toast.success("Assessment updated");
        } else {
          await createAssessment(formData);
          toast.success("Assessment saved");
        }
        router.push("/chat");
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-8 px-4 sm:px-0">
      <StepIndicator currentStep={step} />

      <TextAnimate
        key={step}
        as="h2"
        animation="blurInUp"
        className="text-center text-xl sm:text-2xl font-semibold tracking-tight"
      >
        {STEP_TITLES[step]}
      </TextAnimate>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: direction * 30, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: direction * -30, filter: "blur(4px)" }}
          transition={SLIDE_TRANSITION}
        >
          <StepContent
            step={step}
            formData={formData}
            errors={errors}
            updateField={updateField}
            updateShareholders={updateShareholders}
            goNext={goNext}
          />
        </motion.div>
      </AnimatePresence>

      <WizardNavigation
        isFirstStep={isFirstStep}
        isReviewStep={isReviewStep}
        isPending={isPending}
        submitLabel={submitLabel}
        goBack={goBack}
        goNext={goNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
