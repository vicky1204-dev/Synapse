"use client";

import { type Control, Controller } from "react-hook-form";
import { OnboardingLottie } from "./onboarding-lottie";
import { CheckIcon } from "lucide-react";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { OnboardingFormValues } from "../schemas";

export const ONBOARDING_GOALS = [
  {
    id: "Understand concepts",
    label: "Understand concepts",
    description:
      "Break down complex topics with structured reviews & summaries",
    icon: "💡",
  },
  {
    id: "Prepare for exams",
    label: "Prepare for exams",
    description: "High-yield concept synthesis and targeted practice sessions",
    icon: "📝",
  },
  {
    id: "Organize notes/resources",
    label: "Organize notes/resources",
    description:
      "Keep all lecture materials, slides, and papers in unified courses",
    icon: "📂",
  },
  {
    id: "Practice with questions",
    label: "Practice with questions",
    description:
      "Test your retention with smart flashcards and interactive quizzes",
    icon: "⚡",
  },
  {
    id: "Learn with other students",
    label: "Learn with other students",
    description: "Ask questions, share perspectives, and discuss course topics",
    icon: "👥",
  },
];

interface StepGoalsProps {
  control: Control<OnboardingFormValues>;
}

export function StepGoals({ control }: StepGoalsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Lottie Animation */}
      <OnboardingLottie src="/animations/onboarding/study_planning.lottie" />

      {/* Title & Prompt */}
      <div className="text-center">
        <h2 className="font-display text-foreground text-base font-semibold">
          What do you want to use Synapse for?
        </h2>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Select all that align with your study habits
        </p>
      </div>

      {/* Controlled Choice List */}
      <Controller
        name="onboardingGoals"
        control={control}
        render={({ field, fieldState }) => {
          const selectedGoals = field.value || [];

          const toggleGoal = (id: string) => {
            if (selectedGoals.includes(id)) {
              field.onChange(selectedGoals.filter((g) => g !== id));
            } else {
              field.onChange([...selectedGoals, id]);
            }
          };

          return (
            <Field data-invalid={fieldState.invalid}>
              <div className="scroll-fade flex max-h-65 scrollbar-none flex-col gap-2 overflow-y-auto pr-1">
                {ONBOARDING_GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={cn(
                        "group relative flex w-full items-start gap-3 rounded-2xl border p-3 text-start transition-all outline-none select-none",
                        isSelected
                          ? "border-primary/50 bg-primary/8 shadow-xs"
                          : "border-border/70 bg-card hover:bg-input/20 hover:border-border",
                      )}
                    >
                      {/* Checkbox indicator */}
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40 bg-input/40 group-hover:border-muted-foreground",
                        )}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <CheckIcon className="size-3.5 stroke-[2.5]" />
                        )}
                      </span>

                      {/* Text content */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                          <span>{goal.icon}</span>
                          <span>{goal.label}</span>
                        </span>
                        <span className="text-muted-foreground text-[11px] leading-tight">
                          {goal.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </div>
  );
}
