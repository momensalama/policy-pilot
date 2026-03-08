"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface WizardNavigationProps {
  isFirstStep: boolean;
  isReviewStep: boolean;
  isPending: boolean;
  submitLabel: string;
  goBack: () => void;
  goNext: () => void;
  onSubmit: () => void;
}

export function WizardNavigation({
  isFirstStep,
  isReviewStep,
  isPending,
  submitLabel,
  goBack,
  goNext,
  onSubmit,
}: Readonly<WizardNavigationProps>) {
  return (
    <div className="flex items-center justify-between pt-2">
      {isFirstStep ? (
        <div />
      ) : (
        <Button variant="ghost" onClick={goBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {isReviewStep ? (
        <ShimmerButton
          onClick={onSubmit}
          disabled={isPending}
          borderRadius="8px"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            submitLabel
          )}
        </ShimmerButton>
      ) : (
        <Button onClick={goNext} className="gap-2">
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
