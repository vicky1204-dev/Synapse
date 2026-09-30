"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { OnboardingStepper } from "./onboarding-stepper";
import { StepAcademic } from "./step-academic";
import { StepGoals } from "./step-goals";
import { StepSubjects } from "./step-subjects";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateOnboarding } from "../mutations";
import { ArrowLeftIcon } from "lucide-react";
import { onboardingSchema, type OnboardingFormValues } from "../schemas";

export function OnboardingFlow() {
  const router = useRouter();
  const updateOnboarding = useUpdateOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      program: "",
      year: 1,
      institution: "",
      onboardingGoals: [],
      subjectIds: [],
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: OnboardingFormValues) => {
    setApiError(null);
    try {
      await updateOnboarding.mutateAsync({
        program: values.program.trim(),
        year: values.year,
        institution: values.institution?.trim() || undefined,
        onboardingGoals: values.onboardingGoals,
        subjectIds: values.subjectIds,
        onboardingStatus: "completed",
      });

      router.replace("/home");
    } catch {
      setApiError("Failed to save onboarding information. Please try again.");
    }
  };

  const handleNext = async () => {
    setApiError(null);

    if (currentStep === 1) {
      const isValid = await form.trigger(["program", "year", "institution"]);
      if (isValid) {
        setCurrentStep(2);
      }
      return;
    }

    if (currentStep === 2) {
      const isValid = await form.trigger(["onboardingGoals"]);
      if (isValid) {
        setCurrentStep(3);
      }
      return;
    }

    if (currentStep === 3) {
      void form.handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    setApiError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setApiError(null);
      setCurrentStep(step);
    }
  };

  const isSubmitting =
    form.formState.isSubmitting || updateOnboarding.isPending;

  return (
    <div className="border-border/70 bg-card flex w-full max-w-110 flex-col gap-6 rounded-3xl border p-6 shadow-xs sm:p-7">
      {/* Top Stepper and Logo */}
      <OnboardingStepper
        currentStep={currentStep}
        totalSteps={3}
        onStepClick={handleStepClick}
      />

      {/* Screen Content */}
      <div className="flex flex-col">
        {currentStep === 1 && <StepAcademic control={form.control} />}
        {currentStep === 2 && <StepGoals control={form.control} />}
        {currentStep === 3 && <StepSubjects control={form.control} />}
      </div>

      {apiError && (
        <p className="text-destructive text-center text-xs">{apiError}</p>
      )}

      {/* Bottom Actions */}
      <div className="mt-2 flex flex-col gap-2">
        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full cursor-pointer rounded-2xl text-sm font-medium transition-all"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner className="size-4" />
              <span>Completing setup...</span>
            </div>
          ) : currentStep === 3 ? (
            "Complete setup"
          ) : (
            "Continue"
          )}
        </Button>

        {currentStep > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground h-8 w-full cursor-pointer rounded-2xl text-xs"
          >
            <ArrowLeftIcon className="mr-1 size-3.5" />
            Previous step
          </Button>
        )}
      </div>
    </div>
  );
}
