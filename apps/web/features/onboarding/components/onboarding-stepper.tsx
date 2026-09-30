"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

export function OnboardingStepper({
  currentStep,
  totalSteps = 3,
  onStepClick,
}: OnboardingStepperProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Brand Header */}
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/synapse_logo.svg"
          alt="Synapse"
          width={22}
          height={22}
          className="size-5 shrink-0"
          priority
        />
        <span className="font-display text-foreground text-base font-semibold tracking-tight">
          Synapse
        </span>
      </div>

      {/* Stepper Dots & Dashed Connectors */}
      <div className="flex w-full max-w-70 items-center justify-between px-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = Boolean(onStepClick && stepNumber <= currentStep);

          return (
            <div
              key={stepNumber}
              className="flex flex-1 items-center last:flex-none"
            >
              {/* Step indicator node */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(stepNumber)}
                aria-label={`Step ${stepNumber}`}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "relative flex size-4 shrink-0 items-center justify-center rounded-full transition-all duration-200 outline-none",
                  isActive &&
                    "bg-primary ring-primary/25 scale-110 shadow-sm ring-4",
                  isCompleted &&
                    "bg-primary text-primary-foreground hover:opacity-90",
                  !isActive &&
                    !isCompleted &&
                    "border-border/70 bg-card hover:border-muted-foreground/50 border-2",
                  isClickable && "cursor-pointer",
                )}
              >
                {isCompleted && (
                  <span className="size-1.5 rounded-full bg-white" />
                )}
              </button>

              {/* Dashed line to next step */}
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "mx-2 h-0 flex-1 border-t-2 border-dashed transition-colors duration-200",
                    stepNumber < currentStep
                      ? "border-primary/60"
                      : "border-border/80",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
