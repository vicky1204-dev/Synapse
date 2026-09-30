"use client";

import { useState } from "react";
import { type Control, Controller } from "react-hook-form";
import { OnboardingLottie } from "./onboarding-lottie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError } from "@/components/ui/field";
import { useSubjects } from "../queries";
import { useCreateSubject } from "../mutations";
import { SearchIcon, PlusIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingFormValues } from "../schemas";

interface StepSubjectsProps {
  control: Control<OnboardingFormValues>;
}

export function StepSubjects({ control }: StepSubjectsProps) {
  const [search, setSearch] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [customSubjectError, setCustomSubjectError] = useState<string | null>(
    null,
  );

  const { data: subjects = [], isLoading } = useSubjects(
    search.trim() || undefined,
  );
  const createSubject = useCreateSubject();

  return (
    <div className="flex flex-col gap-4">
      {/* Lottie Animation */}
      <OnboardingLottie src="/animations/onboarding/businessman_flying.lottie" />

      <Controller
        name="subjectIds"
        control={control}
        render={({ field, fieldState }) => {
          const selectedSubjectIds = field.value || [];

          const toggleSubject = (id: string) => {
            if (selectedSubjectIds.includes(id)) {
              field.onChange(selectedSubjectIds.filter((sId) => sId !== id));
            } else {
              if (selectedSubjectIds.length >= 3) {
                return; // Max 3 subjects
              }
              field.onChange([...selectedSubjectIds, id]);
            }
          };

          const handleAddCustomSubject = async (e: React.FormEvent) => {
            e.preventDefault();
            const trimmed = newSubjectName.trim();
            if (!trimmed) return;

            if (trimmed.length < 2) {
              setCustomSubjectError(
                "Subject name must be at least 2 characters.",
              );
              return;
            }

            setCustomSubjectError(null);
            try {
              const created = await createSubject.mutateAsync({
                name: trimmed,
              });
              setNewSubjectName("");
              if (
                !selectedSubjectIds.includes(created.id) &&
                selectedSubjectIds.length < 3
              ) {
                field.onChange([...selectedSubjectIds, created.id]);
              }
            } catch {
              setCustomSubjectError(
                "Failed to add custom subject. Please try again.",
              );
            }
          };

          return (
            <Field data-invalid={fieldState.invalid} className="gap-3">
              {/* Title & Counter */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-foreground text-base font-semibold">
                    What subjects are you studying?
                  </h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Choose up to 3 subjects to seed your workspace
                  </p>
                </div>
                <Badge
                  variant={
                    selectedSubjectIds.length > 0 ? "default" : "secondary"
                  }
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs"
                >
                  {selectedSubjectIds.length} / 3
                </Badge>
              </div>

              {/* Search Input */}
              <div className="relative">
                <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search catalog (e.g. Algorithms, Calculus)..."
                  className="bg-input/40 h-9 rounded-2xl pr-3 pl-9 text-xs"
                />
              </div>

              {/* Subject Chips / Grid */}
              <div className="border-border/50 bg-input/10 flex max-h-[160px] flex-wrap gap-2 overflow-y-auto rounded-2xl border p-1">
                {isLoading ? (
                  <div className="text-muted-foreground flex w-full items-center justify-center gap-2 py-6 text-xs">
                    <Spinner className="size-4" />
                    <span>Loading subjects...</span>
                  </div>
                ) : subjects.length === 0 ? (
                  <div className="flex w-full flex-col items-center justify-center py-4 text-center">
                    <p className="text-muted-foreground text-xs">
                      No subjects found matching &ldquo;{search}&rdquo;.
                    </p>
                  </div>
                ) : (
                  subjects.map((subject) => {
                    const isSelected = selectedSubjectIds.includes(subject.id);
                    const isDisabled =
                      !isSelected && selectedSubjectIds.length >= 3;

                    return (
                      <button
                        key={subject.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleSubject(subject.id)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all outline-none",
                          isSelected
                            ? "bg-primary text-primary-foreground ring-primary/30 shadow-xs ring-2"
                            : "border-border/80 bg-card text-foreground hover:bg-input/40 border",
                          isDisabled && "cursor-not-allowed opacity-40",
                        )}
                      >
                        {isSelected && (
                          <CheckIcon className="size-3 stroke-[2.5]" />
                        )}
                        <span>{subject.name}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Add Custom Subject Form */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Input
                    value={newSubjectName}
                    onChange={(e) => {
                      setNewSubjectName(e.target.value);
                      if (customSubjectError) setCustomSubjectError(null);
                    }}
                    placeholder="Add another subject..."
                    className="bg-input/40 h-8 flex-1 rounded-2xl px-3 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddCustomSubject}
                    disabled={!newSubjectName.trim() || createSubject.isPending}
                    className="h-8 shrink-0 rounded-2xl px-3 text-xs"
                  >
                    {createSubject.isPending ? (
                      <Spinner className="size-3" />
                    ) : (
                      <PlusIcon className="mr-1 size-3.5" />
                    )}
                    Add
                  </Button>
                </div>
                {customSubjectError && (
                  <p className="text-destructive text-[11px]">
                    {customSubjectError}
                  </p>
                )}
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </div>
  );
}
