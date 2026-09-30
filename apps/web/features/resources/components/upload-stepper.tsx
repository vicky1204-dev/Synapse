"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: number;
  name: string;
}

interface UploadStepperProps {
  steps: readonly StepItem[];
  currentStep: number;
  className?: string;
}

export function UploadStepper({
  steps,
  currentStep,
  className,
}: UploadStepperProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between",
        className,
      )}
    >
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200",
                  isActive &&
                    "bg-primary text-primary-foreground ring-4 ring-primary/25 shadow-xs scale-105",
                  isCompleted && "bg-primary text-primary-foreground",
                  !isActive &&
                    !isCompleted &&
                    "border-2 border-border/70 bg-card text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="size-3.5 stroke-[3]" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.name}
              </span>
            </div>

            {step.id < steps.length && (
              <div
                className={cn(
                  "mx-3 h-0 flex-1 border-t-2 border-dashed transition-colors duration-200",
                  step.id < currentStep
                    ? "border-primary/60"
                    : "border-border/80",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
