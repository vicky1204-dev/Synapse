"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSubjects } from "@/features/onboarding/queries";
import { useCreateCourse, useUpdateCourse } from "../mutations";
import {
  courseFormSchema,
  COURSE_COVER_PRESETS,
  type CourseFormValues,
} from "../schemas";
import type { Course } from "../types";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  course?: Course | null;
  onSuccess?: (course: Course) => void;
}

export function CourseDialog({
  open,
  onOpenChange,
  mode = "create",
  course,
  onSuccess,
}: CourseDialogProps) {
  const isEdit = mode === "edit" && Boolean(course);
  const { data: subjects = [] } = useSubjects();

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      subjectId: "",
      code: "",
      department: "",
      semester: "",
      year: new Date().getFullYear(),
      color: COURSE_COVER_PRESETS[0],
      status: "active",
    },
  });

  // Sync form values when dialog opens or course changes
  React.useEffect(() => {
    if (open) {
      if (isEdit && course) {
        form.reset({
          title: course.title,
          description: course.description || "",
          subjectId: course.subjectId || "",
          code: course.code || "",
          department: course.department || "",
          semester: course.semester || "",
          year: course.year || new Date().getFullYear(),
          color: course.cover?.color || COURSE_COVER_PRESETS[0],
          status: course.status || "active",
        });
      } else {
        form.reset({
          title: "",
          description: "",
          subjectId: "",
          code: "",
          department: "",
          semester: "",
          year: new Date().getFullYear(),
          color:
            COURSE_COVER_PRESETS[
              Math.floor(Math.random() * COURSE_COVER_PRESETS.length)
            ],
          status: "active",
        });
      }
    }
  }, [open, isEdit, course, form]);

  const currentColor =
    useWatch({ control: form.control, name: "color" }) || COURSE_COVER_PRESETS[0];

  const onSubmit = async (values: CourseFormValues) => {
    try {
      const payload = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        subjectId: values.subjectId ? values.subjectId : undefined,
        code: values.code?.trim() || undefined,
        department: values.department?.trim() || undefined,
        semester: values.semester?.trim() || undefined,
        year: values.year ? Number(values.year) : undefined,
        cover: {
          color: values.color,
        },
        status: values.status,
      };

      let resultCourse: Course;

      if (isEdit && course) {
        resultCourse = await updateMutation.mutateAsync({
          id: course.id,
          data: {
            ...payload,
            subjectId: values.subjectId ? values.subjectId : null,
          },
        });
      } else {
        resultCourse = await createMutation.mutateAsync(payload);
      }

      onOpenChange(false);
      onSuccess?.(resultCourse);
    } catch {
      // Errors handled by mutation callbacks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: currentColor }}
            />
            {isEdit ? "Edit Course" : "Create New Course"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update course academic details, color theme, and configuration."
              : "Organize your study packs, lecture notes, and discussions under a course workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Title */}
          <Field data-invalid={Boolean(form.formState.errors.title)}>
            <FieldLabel className="text-xs font-semibold text-foreground">
              Course Title <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...form.register("title")}
              placeholder="e.g. Operating Systems, Data Structures & Algorithms"
              className="h-10 text-sm"
              autoFocus
            />
            <FieldError errors={[form.formState.errors.title]} />
          </Field>

          {/* Code & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field data-invalid={Boolean(form.formState.errors.code)}>
              <FieldLabel className="text-xs font-semibold text-foreground">
                Course Code
              </FieldLabel>
              <Input
                {...form.register("code")}
                placeholder="e.g. CS301"
                className="h-10 text-sm"
              />
              <FieldError errors={[form.formState.errors.code]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.department)}>
              <FieldLabel className="text-xs font-semibold text-foreground">
                Department
              </FieldLabel>
              <Input
                {...form.register("department")}
                placeholder="e.g. Computer Science"
                className="h-10 text-sm"
              />
              <FieldError errors={[form.formState.errors.department]} />
            </Field>
          </div>

          {/* Academic Subject Selection */}
          <Field data-invalid={Boolean(form.formState.errors.subjectId)}>
            <FieldLabel className="text-xs font-semibold text-foreground">
              Subject Area
            </FieldLabel>
            <Controller
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                >
                  <SelectTrigger className="w-full h-10 rounded-2xl border-input bg-background text-xs font-medium">
                    <SelectValue placeholder="Select or link academic subject" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    <SelectItem value="none" className="text-xs text-muted-foreground">
                      No linked subject
                    </SelectItem>
                    {subjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id} className="text-xs">
                        {sub.name}
                        {sub.department ? ` (${sub.department})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.subjectId]} />
          </Field>

          {/* Semester & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field data-invalid={Boolean(form.formState.errors.semester)}>
              <FieldLabel className="text-xs font-semibold text-foreground">
                Semester / Term
              </FieldLabel>
              <Input
                {...form.register("semester")}
                placeholder="e.g. Semester 5, Fall 2026"
                className="h-10 text-sm"
              />
              <FieldError errors={[form.formState.errors.semester]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.year)}>
              <FieldLabel className="text-xs font-semibold text-foreground">
                Academic Year
              </FieldLabel>
              <Input
                type="number"
                {...form.register("year", { valueAsNumber: true })}
                placeholder="e.g. 2026"
                className="h-10 text-sm"
              />
              <FieldError errors={[form.formState.errors.year]} />
            </Field>
          </div>

          {/* Cover Color Palette Swatches */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Folder Color</span>
              <span className="text-[11px] font-mono text-muted-foreground uppercase">
                {currentColor}
              </span>
            </FieldLabel>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {COURSE_COVER_PRESETS.map((color) => {
                const isSelected = currentColor?.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => form.setValue("color", color, { shouldDirty: true })}
                    className={cn(
                      "relative size-7 rounded-full transition-all focus:outline-hidden",
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-sm"
                        : "hover:scale-105 opacity-85 hover:opacity-100",
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-xs">
                        <CheckIcon className="size-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Description */}
          <Field data-invalid={Boolean(form.formState.errors.description)}>
            <FieldLabel className="text-xs font-semibold text-foreground">
              Description (Optional)
            </FieldLabel>
            <Textarea
              {...form.register("description")}
              placeholder="Add goals, syllabus highlights, professor notes, or key focus areas..."
              rows={3}
              className="resize-none text-xs"
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  {isEdit ? "Saving Changes..." : "Creating Course..."}
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Course"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
