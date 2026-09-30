"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormValues } from "../schemas";
import { useUpdateProfile } from "../mutations";
import { useSubjects } from "@/features/onboarding/queries";
import { ONBOARDING_GOALS } from "@/features/onboarding/components/step-goals";
import type { User } from "@/features/auth/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  BookOpenIcon,
  CheckIcon,
  GraduationCapIcon,
  LockIcon,
  SearchIcon,
  SparklesIcon,
  TargetIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileEditFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  user,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) {
  const [subjectSearch, setSubjectSearch] = useState("");
  const updateProfile = useUpdateProfile();
  const { data: catalogSubjects = [] } = useSubjects(subjectSearch.trim() || undefined);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name ?? "",
      avatarUrl: user.avatarUrl ?? "",
      academicProfile: {
        program: user.academicProfile?.program ?? "",
        year: (user.academicProfile?.year as number) ?? "",
        institution: user.academicProfile?.institution ?? "",
      },
      onboardingGoals: user.onboardingGoals ?? [],
      subjectIds: user.subjectIds ?? [],
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const yearVal =
        values.academicProfile.year === "" || values.academicProfile.year === undefined
          ? undefined
          : Number(values.academicProfile.year);

      await updateProfile.mutateAsync({
        name: values.name.trim(),
        avatarUrl: values.avatarUrl?.trim() || undefined,
        academicProfile: {
          program: values.academicProfile.program?.trim() || undefined,
          year: yearVal,
          institution: values.academicProfile.institution?.trim() || undefined,
        },
        onboardingGoals: values.onboardingGoals,
        subjectIds: values.subjectIds,
      });

      onSuccess();
    } catch {
      // Handled in mutation onError toast
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Basic Personal Information */}
      <Card className="rounded-3xl border border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <UserIcon className="size-4 text-primary" />
            <CardTitle className="text-base font-heading">
              Personal Information
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Manage your personal profile and display name
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs font-medium">Full Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. Alex Morgan"
                    className="rounded-2xl"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email (Read-only) */}
            <Field>
              <FieldLabel className="text-xs font-medium flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-normal">
                  <LockIcon className="size-2.5 opacity-60" /> Read-only
                </span>
              </FieldLabel>
              <Input
                value={user.email}
                disabled
                className="rounded-2xl bg-muted/40 cursor-not-allowed opacity-80"
              />
              <FieldDescription className="text-[11px]">
                Email is tied to your Synapse credentials
              </FieldDescription>
            </Field>
          </div>

          {/* Avatar URL */}
          <Controller
            name="avatarUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs font-medium">Avatar Image URL (Optional)</FieldLabel>
                <Input
                  {...field}
                  placeholder="https://example.com/avatar.jpg"
                  className="rounded-2xl"
                />
                <FieldDescription className="text-[11px]">
                  Provide a direct link to a profile picture
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardContent>
      </Card>

      {/* 2. Academic Information */}
      <Card className="rounded-3xl border border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <GraduationCapIcon className="size-4 text-primary" />
            <CardTitle className="text-base font-heading">
              Academic Information
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Keep your university, degree, and study level up to date
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Program / Major */}
            <div className="sm:col-span-2">
              <Controller
                name="academicProfile.program"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xs font-medium">Program / Major</FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g. Computer Science & Engineering"
                      className="rounded-2xl"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Year of Study */}
            <Controller
              name="academicProfile.year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs font-medium">Year of Study</FieldLabel>
                  <NativeSelect
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full"
                  >
                    <NativeSelectOption value="">Not specified</NativeSelectOption>
                    <NativeSelectOption value="1">Year 1 (Freshman)</NativeSelectOption>
                    <NativeSelectOption value="2">Year 2 (Sophomore)</NativeSelectOption>
                    <NativeSelectOption value="3">Year 3 (Junior)</NativeSelectOption>
                    <NativeSelectOption value="4">Year 4 (Senior)</NativeSelectOption>
                    <NativeSelectOption value="5">Year 5 (5th Year / Grad)</NativeSelectOption>
                    <NativeSelectOption value="6">Year 6+</NativeSelectOption>
                  </NativeSelect>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Institution */}
          <Controller
            name="academicProfile.institution"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs font-medium">Institution / University</FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g. Stanford University"
                  className="rounded-2xl"
                />
                <FieldDescription className="text-[11px]">
                  Allows local campus community and course matching
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardContent>
      </Card>

      {/* 3. Learning Goals & Intent */}
      <Card className="rounded-3xl border border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <TargetIcon className="size-4 text-primary" />
            <CardTitle className="text-base font-heading">
              Learning Goals & Intent
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Select what you want to achieve with Synapse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="onboardingGoals"
            control={form.control}
            render={({ field }) => {
              const selectedGoals = field.value || [];

              const toggleGoal = (id: string) => {
                if (selectedGoals.includes(id)) {
                  field.onChange(selectedGoals.filter((g) => g !== id));
                } else {
                  field.onChange([...selectedGoals, id]);
                }
              };

              return (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {ONBOARDING_GOALS.map((goal) => {
                    const isSelected = selectedGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => toggleGoal(goal.id)}
                        className={cn(
                          "flex items-start gap-3 rounded-2xl border p-3 text-start transition-all outline-none select-none cursor-pointer",
                          isSelected
                            ? "border-primary/50 bg-primary/8 shadow-xs"
                            : "border-border/70 bg-card hover:bg-input/20 hover:border-border",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-md border transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40 bg-input/40",
                          )}
                          aria-hidden="true"
                        >
                          {isSelected && (
                            <CheckIcon className="size-3 stroke-[2.5]" />
                          )}
                        </span>
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
              );
            }}
          />
        </CardContent>
      </Card>

      {/* 4. Enrolled Subjects Selection */}
      <Card className="rounded-3xl border border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <BookOpenIcon className="size-4 text-primary" />
            <CardTitle className="text-base font-heading">
              Enrolled Subjects
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Select courses of interest to associate with your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="subjectIds"
            control={form.control}
            render={({ field }) => {
              const selectedIds = field.value || [];

              const toggleSubject = (id: string) => {
                if (selectedIds.includes(id)) {
                  field.onChange(selectedIds.filter((sId) => sId !== id));
                } else {
                  field.onChange([...selectedIds, id]);
                }
              };

              return (
                <div className="space-y-3">
                  <div className="relative">
                    <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      placeholder="Search available subjects..."
                      className="rounded-2xl pl-9"
                    />
                  </div>

                  <div className="grid max-h-56 overflow-y-auto grid-cols-1 gap-2 sm:grid-cols-2 p-1 border border-border/40 rounded-2xl bg-muted/10">
                    {catalogSubjects.map((sub) => {
                      const isSelected = selectedIds.includes(sub.id);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => toggleSubject(sub.id)}
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-2.5 text-start transition-all cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/60 bg-card hover:bg-input/30",
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">
                              {sub.name}
                            </span>
                            {sub.department && (
                              <span className="text-[10px] text-muted-foreground">
                                {sub.department}
                              </span>
                            )}
                          </div>
                          <span
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30",
                            )}
                          >
                            {isSelected && <CheckIcon className="size-2.5" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          />
        </CardContent>
      </Card>

      {/* Actions footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={updateProfile.isPending}
          className="rounded-full px-5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateProfile.isPending}
          className="rounded-full px-6 gap-2"
        >
          {updateProfile.isPending ? (
            <>
              <Spinner className="size-4" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="size-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
