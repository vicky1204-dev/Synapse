"use client";

import { type Control, Controller } from "react-hook-form";
import { OnboardingLottie } from "./onboarding-lottie";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { OnboardingFormValues } from "../schemas";

interface StepAcademicProps {
  control: Control<OnboardingFormValues>;
}

export function StepAcademic({ control }: StepAcademicProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Lottie Animation */}
      <OnboardingLottie src="/animations/onboarding/study.lottie" />

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {/* Field 1: Program / Major */}
        <Controller
          name="program"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="program"
                className="text-foreground text-sm font-medium"
              >
                What are you studying?
              </FieldLabel>
              <Input
                {...field}
                id="program"
                placeholder="e.g. Computer Science, Mechanical Engineering"
                aria-invalid={fieldState.invalid}
                className="bg-input/40 focus-visible:bg-background h-10 rounded-2xl px-3.5 text-sm transition-all"
                autoFocus
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Field 2: Year in college */}
        <Controller
          name="year"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="year"
                className="text-foreground text-sm font-medium"
              >
                What year are you in?
              </FieldLabel>
              <NativeSelect
                id="year"
                value={String(field.value || 1)}
                onChange={(e) => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
                className="w-full"
              >
                <NativeSelectOption value="1">
                  1st Year (Freshman)
                </NativeSelectOption>
                <NativeSelectOption value="2">
                  2nd Year (Sophomore)
                </NativeSelectOption>
                <NativeSelectOption value="3">
                  3rd Year (Junior)
                </NativeSelectOption>
                <NativeSelectOption value="4">
                  4th Year (Senior)
                </NativeSelectOption>
                <NativeSelectOption value="5">
                  5th Year / Graduate
                </NativeSelectOption>
              </NativeSelect>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Field 3: Institution */}
        <Controller
          name="institution"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="institution"
                className="text-foreground text-sm font-medium"
              >
                What is your Institution?
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="institution"
                placeholder="e.g. Stanford University, MIT"
                aria-invalid={fieldState.invalid}
                className="bg-input/40 focus-visible:bg-background h-10 rounded-2xl px-3.5 text-sm transition-all"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
