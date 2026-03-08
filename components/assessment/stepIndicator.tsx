"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { STEP_LABELS, WIZARD_STEPS } from "@/lib/constants";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: Readonly<StepIndicatorProps>) {
  const isReview = currentStep === WIZARD_STEPS.REVIEW;
  const progress = isReview
    ? 100
    : (currentStep / (STEP_LABELS.length - 1)) * 100;

  return (
    <div className="space-y-3">
      {/* Mobile: progress bar + label */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            {isReview
              ? "Review"
              : `Step ${currentStep + 1} of ${STEP_LABELS.length}`}
          </span>
          <span>{isReview ? "Final review" : STEP_LABELS[currentStep]}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Desktop: step dots */}
      <div className="hidden sm:flex items-center justify-center gap-2">
        {STEP_LABELS.map((label, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep && !isReview;

          return (
            <div key={label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                    isCompleted && "bg-primary text-primary-foreground",
                    isActive &&
                      "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                    !isCompleted &&
                      !isActive &&
                      "bg-muted text-muted-foreground",
                  )}
                  initial={false}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </motion.div>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    isActive || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>

              {i < STEP_LABELS.length - 1 && (
                <div className="relative mb-5 h-px w-6 lg:w-10 bg-border">
                  <motion.div
                    className="absolute inset-0 bg-primary origin-left"
                    initial={false}
                    animate={{ scaleX: i < currentStep ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
