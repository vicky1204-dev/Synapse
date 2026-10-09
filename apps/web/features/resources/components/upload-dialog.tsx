"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resourceUploadFormSchema,
  type ResourceUploadFormValues,
} from "../schemas";
import { useUploadResource, useCreateResource } from "../mutations";
import { FileDropzone } from "./file-dropzone";
import { UploadStepper } from "./upload-stepper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckIcon,
  FileTextIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  UploadCloudIcon,
  XIcon,
  EyeIcon,
  LockIcon,
  AlertCircleIcon,
  CalendarIcon,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCourses, useUpdateCourse } from "@/features/courses";
import { cn } from "@/lib/utils";

interface UploadDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  courseId?: string;
  triggerButton?: React.ReactNode;
  onSuccess?: () => void;
}

const STEPS = [
  { id: 1, name: "Upload" },
  { id: 2, name: "Details" },
  { id: 3, name: "Processing" },
  { id: 4, name: "Preview" },
  { id: 5, name: "Publish" },
] as const;

const RECOMMENDED_TAGS = [
  "Memory management",
  "Paging",
  "Virtual memory",
  "Process scheduling",
  "Deadlocks",
  "File systems",
];

const SHIMMER_MESSAGES = [
  "identifying topics...",
  "generating summary...",
  "suggesting tags...",
];

export function UploadDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  courseId,
  triggerButton,
  onSuccess,
}: UploadDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [shimmerIndex, setShimmerIndex] = useState<number>(0);
  const [isProcessingDone, setIsProcessingDone] = useState<boolean>(false);
  const [selectedDeadline, setSelectedDeadline] = useState<string | null>(null);

  const { data: userCoursesData } = useCourses({ status: "active", limit: 50 });
  const coursesList = userCoursesData?.data ?? [];
  const updateCourseMutation = useUpdateCourse();

  const uploadMutation = useUploadResource();
  const createMutation = useCreateResource();
  const isSubmitting = uploadMutation.isPending || createMutation.isPending;

  const form = useForm<ResourceUploadFormValues>({
    resolver: zodResolver(resourceUploadFormSchema),
    mode: "onTouched",
    defaultValues: {
      uploadMode: "file",
      title: "",
      description: "",
      type: "pdf",
      visibility: "public",
      courseId: courseId ?? "",
      linkUrl: "",
      tags: ["Operating Systems", "Memory"],
      aiSummary:
        "A comprehensive guide covering virtual memory, paging techniques, translation lookaside buffers (TLB), and kernel process scheduling algorithms.",
      aiTopics: ["Virtual Memory", "Paging", "Scheduling", "Kernel"],
    },
  });

  const uploadMode = useWatch({ control: form.control, name: "uploadMode" });
  const formValues = useWatch({ control: form.control });

  // Reset modal state on close or set initial course on open
  const handleOpenChange = (isOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(isOpen);
    } else {
      setInternalOpen(isOpen);
    }
    if (isOpen) {
      if (courseId) {
        form.setValue("courseId", courseId);
        const matched = coursesList.find((c) => c.id === courseId);
        if (matched?.deadline) {
          setSelectedDeadline(new Date(matched.deadline).toISOString());
        }
      }
    } else {
      setTimeout(() => {
        setCurrentStep(1);
        setSelectedFile(null);
        setFileError(null);
        setTagInput("");
        setShimmerIndex(0);
        setIsProcessingDone(false);
        setSelectedDeadline(null);
        form.reset();
      }, 200);
    }
  };

  // Auto-fill title & infer file type on file select
  const handleFileSelect = (file: File | null) => {
    setFileError(null);
    setSelectedFile(file);
    if (file) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      form.setValue("title", cleanName, { shouldValidate: true });

      const ext = file.name.toLowerCase();
      if (ext.endsWith(".pdf")) {
        form.setValue("type", "pdf");
      } else if (ext.endsWith(".doc") || ext.endsWith(".docx")) {
        form.setValue("type", "word");
      } else if (ext.endsWith(".ppt") || ext.endsWith(".pptx")) {
        form.setValue("type", "ppt");
      } else {
        form.setValue("type", "note");
      }
    }
  };

  // Stepper forward navigation with validation per step
  const handleNext = async () => {
    setFileError(null);

    if (currentStep === 1) {
      if (uploadMode === "file" && !selectedFile) {
        setFileError("Please select a file to continue.");
        return;
      }
      if (uploadMode === "link") {
        const isValid = await form.trigger(["linkUrl"]);
        if (!isValid) return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const isValid = await form.trigger(["title", "courseId"]);
      if (!isValid) return;
      setIsProcessingDone(false);
      setShimmerIndex(0);
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!isProcessingDone) return;
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      setCurrentStep(5);
      return;
    }

    if (currentStep === 5) {
      await handlePublish();
    }
  };

  // Stepper backward navigation
  const handleBack = () => {
    setFileError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Shimmer loop for Step 3
  useEffect(() => {
    if (currentStep !== 3) return;

    const messageInterval = setInterval(() => {
      setShimmerIndex((prev) => (prev + 1) % SHIMMER_MESSAGES.length);
    }, 900);

    const doneTimer = setTimeout(() => {
      setIsProcessingDone(true);
      clearInterval(messageInterval);
    }, 2700);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(doneTimer);
    };
  }, [currentStep]);

  // Tag management
  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(trimmed)) {
      form.setValue("tags", [...currentTags, trimmed]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tagToRemove),
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Final Publish Handler
  const handlePublish = async () => {
    const values = form.getValues();
    try {
      if (values.uploadMode === "link") {
        await createMutation.mutateAsync({
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          type: "link",
          visibility: values.visibility,
          courseId: values.courseId || undefined,
          file: {
            url: values.linkUrl,
          },
          aiMetadata: {
            summary: values.aiSummary,
            topics: values.aiTopics,
            tags: values.tags,
          },
        });
      } else if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", values.title.trim() || selectedFile.name);
        if (values.description?.trim()) {
          formData.append("description", values.description.trim());
        }
        formData.append("type", values.type);
        formData.append("visibility", values.visibility);
        if (values.courseId) {
          formData.append("courseId", values.courseId);
        }

        await uploadMutation.mutateAsync(formData);
      }

      if (values.courseId && values.courseId !== "none" && selectedDeadline !== null) {
        void updateCourseMutation.mutateAsync({
          id: values.courseId,
          data: { deadline: selectedDeadline },
        });
      }

      handleOpenChange(false);
      onSuccess?.();
    } catch {
      // Errors handled via mutation toasts
    }
  };

  const isNextDisabled =
    isSubmitting ||
    (currentStep === 1 && uploadMode === "file" && !selectedFile) ||
    (currentStep === 3 && !isProcessingDone);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {(triggerButton || !isControlled) && (
        <DialogTrigger
          render={
            triggerButton ? (
              (triggerButton as React.ReactElement)
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-neutral-800 dark:bg-foreground dark:text-background"
              >
                <PlusIcon className="size-4" />
                <span>New resource</span>
              </button>
            )
          }
        />
      )}

      <DialogContent className="w-full sm:max-w-4xl overflow-hidden rounded-3xl p-0 shadow-2xl border-border/60">
        {/* Header */}
        <div className="border-b border-border/50 px-6 sm:px-8 pt-6 sm:pt-8 pb-5">
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Upload resource
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Step {currentStep} of 5 · {STEPS[currentStep - 1]?.name}
            </p>
          </div>

          {/* Stepper Bar matching Onboarding Stepper */}
          <UploadStepper steps={STEPS} currentStep={currentStep} className="mt-6" />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
          {/* STEP 1: Upload */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {/* Upload Mode Switcher */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setFileError(null);
                    form.setValue("uploadMode", "file");
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    uploadMode === "file"
                      ? "bg-neutral-900 text-white shadow-xs dark:bg-foreground dark:text-background"
                      : "text-muted-foreground hover:text-foreground bg-muted/40",
                  )}
                >
                  <UploadCloudIcon className="size-3.5" />
                  <span>File Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFileError(null);
                    form.setValue("uploadMode", "link");
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    uploadMode === "link"
                      ? "bg-neutral-900 text-white shadow-xs dark:bg-foreground dark:text-background"
                      : "text-muted-foreground hover:text-foreground bg-muted/40",
                  )}
                >
                  <GlobeIcon className="size-3.5" />
                  <span>Web Link</span>
                </button>
              </div>

              {uploadMode === "file" ? (
                <FileDropzone
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                />
              ) : (
                <div className="rounded-3xl border border-border/80 bg-[#F0F7FB] dark:bg-muted/20 p-8 space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white dark:bg-background shadow-xs text-primary">
                    <GlobeIcon className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Enter external web link
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Provide a URL to an academic paper, documentation, or study reference.
                    </p>
                  </div>
                  <Field data-invalid={Boolean(form.formState.errors.linkUrl)}>
                    <Input
                      placeholder="https://example.com/article"
                      {...form.register("linkUrl")}
                      aria-invalid={Boolean(form.formState.errors.linkUrl)}
                      className={cn(
                        "rounded-full bg-white dark:bg-background h-10 px-4 text-xs",
                        form.formState.errors.linkUrl &&
                          "border-destructive focus-visible:ring-destructive/30",
                      )}
                    />
                    {form.formState.errors.linkUrl && (
                      <FieldError>{form.formState.errors.linkUrl.message}</FieldError>
                    )}
                  </Field>
                </div>
              )}

              {fileError && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive">
                  <AlertCircleIcon className="size-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Details */}
          {currentStep === 2 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Form Column */}
                <div className="md:col-span-7 space-y-5">
                  {/* Course / Subject Dropdown */}
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Course Workspace
                    </FieldLabel>
                    <Controller
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <Select
                          value={field.value || (courseId ? courseId : "")}
                          onValueChange={(val) => {
                            field.onChange(val === "none" ? "" : val);
                            const matched = coursesList.find((c) => c.id === val);
                            if (matched?.deadline) {
                              setSelectedDeadline(new Date(matched.deadline).toISOString());
                            }
                          }}
                        >
                          <SelectTrigger className="w-full h-10 rounded-2xl border-input bg-background text-xs font-medium">
                            <SelectValue placeholder="Select course workspace" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none" className="text-xs text-muted-foreground">
                              General Library (No course)
                            </SelectItem>
                            {coursesList.map((c) => (
                              <SelectItem key={c.id} value={c.id} className="text-xs">
                                {c.title} {c.code ? `(${c.code})` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>

                  {/* Target Deadline with Calendar */}
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>Course Deadline / Exam Date</span>
                      <span className="text-[11px] font-normal text-muted-foreground">Optional</span>
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 flex-1 justify-start rounded-2xl text-xs font-medium"
                            />
                          }
                        >
                          <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                          {selectedDeadline
                            ? new Date(selectedDeadline).toLocaleDateString(undefined, {
                                dateStyle: "medium",
                              })
                            : "No deadline"}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDeadline ? new Date(selectedDeadline) : undefined}
                            onSelect={(date) => {
                              setSelectedDeadline(date ? date.toISOString() : null);
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      {selectedDeadline && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDeadline(null)}
                          className="h-10 px-3 rounded-2xl text-xs text-muted-foreground hover:text-foreground"
                          title="Clear deadline"
                        >
                          <XIcon className="size-3.5 mr-1" />
                          No deadline
                        </Button>
                      )}
                    </div>
                  </Field>

                  {/* Title with Validation Highlighting */}
                  <Field data-invalid={Boolean(form.formState.errors.title)}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Title
                    </FieldLabel>
                    <Input
                      placeholder="e.g. Memory Management Notes"
                      {...form.register("title")}
                      aria-invalid={Boolean(form.formState.errors.title)}
                      className={cn(
                        "rounded-2xl text-xs h-10 px-3.5 transition-all",
                        form.formState.errors.title &&
                          "border-destructive focus-visible:ring-destructive/30 ring-2 ring-destructive/20",
                      )}
                    />
                    {form.formState.errors.title && (
                      <FieldError>{form.formState.errors.title.message}</FieldError>
                    )}
                  </Field>

                  {/* Tags Input */}
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Tags
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a tag, then press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag(tagInput);
                          }
                        }}
                        className="rounded-2xl text-xs h-10 px-3.5"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTag(tagInput)}
                        className="rounded-2xl text-xs h-10 px-4 cursor-pointer"
                      >
                        Add
                      </Button>
                    </div>

                    {/* Active Tags using Badge */}
                    {formValues.tags && formValues.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {formValues.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium gap-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <XIcon className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Recommended Tags */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Recommended from your recent work
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {RECOMMENDED_TAGS.map((recTag) => (
                          <button
                            key={recTag}
                            type="button"
                            onClick={() => handleAddTag(recTag)}
                            className="rounded-full border border-border/80 bg-background px-3 py-1 text-[11px] font-medium text-foreground transition hover:border-primary hover:bg-primary/5 cursor-pointer"
                          >
                            {recTag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Field>
                </div>

                {/* Right Context Preview Card */}
                <div className="md:col-span-5">
                  <div className="rounded-2xl bg-[#F4F6FB] dark:bg-muted/30 p-5 space-y-4 border border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-white dark:bg-background shadow-2xs text-muted-foreground">
                        <FileTextIcon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {selectedFile ? selectedFile.name : formValues.title || "External Link"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {uploadMode === "file" && selectedFile
                            ? `${(formValues.type || "pdf").toUpperCase()} · ${formatFileSize(selectedFile.size)}`
                            : "Web Resource"}
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border/60" />

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                        Resource Context
                      </span>
                      <p className="text-xs font-semibold text-foreground">
                        {formValues.courseId || "Operating Systems"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
              {/* Circular AI Loader */}
              <div className="relative flex items-center justify-center size-24">
                {isProcessingDone ? (
                  <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md animate-in zoom-in-75 duration-300">
                    <CheckIcon className="size-8 stroke-[3]" />
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                    <div className="size-16 rounded-full border-[3px] border-primary border-t-transparent animate-spin flex items-center justify-center">
                      <SparklesIcon className="size-6 text-primary animate-pulse" />
                    </div>
                  </>
                )}
              </div>

              {/* Text feedback */}
              <div className="space-y-2 max-w-sm">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  {isProcessingDone
                    ? "Processing complete!"
                    : "AI is processing your resource"}
                </h3>

                {isProcessingDone ? (
                  <p className="text-xs text-muted-foreground">
                    Metadata generated successfully. Proceed to preview.
                  </p>
                ) : (
                  <p className="text-xs font-medium text-primary tracking-wide animate-pulse">
                    {SHIMMER_MESSAGES[shimmerIndex]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Preview */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-4">
                  <Field>
                    <FieldLabel className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <SparklesIcon className="size-3.5 text-primary" />
                      <span>AI Generated Summary</span>
                    </FieldLabel>
                    <Textarea
                      rows={3}
                      className="w-full rounded-2xl text-xs leading-relaxed"
                      {...form.register("aiSummary")}
                    />
                  </Field>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      Extracted Topics & Concepts
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {formValues.aiTopics?.map((topic) => (
                        <Badge
                          key={topic}
                          variant="secondary"
                          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      Confirmed Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {formValues.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-full px-3 py-1 text-[11px] font-medium text-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <div className="rounded-2xl bg-[#F4F6FB] dark:bg-muted/30 p-5 space-y-3 border border-border/40">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Resource Summary
                    </span>
                    <p className="text-xs font-bold text-foreground">
                      {formValues.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Subject: {formValues.courseId || "General"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Format: {(formValues.type || "pdf").toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Publish */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-foreground">
                  Choose Visibility
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => form.setValue("visibility", "public")}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all cursor-pointer",
                      formValues.visibility === "public"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border/70 hover:border-border",
                    )}
                  >
                    <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                      <EyeIcon className="size-4 text-primary" />
                      <span>Public</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Visible to all students in Synapse learning network.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => form.setValue("visibility", "private")}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all cursor-pointer",
                      formValues.visibility === "private"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border/70 hover:border-border",
                    )}
                  >
                    <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                      <LockIcon className="size-4 text-primary" />
                      <span>Private</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Only visible to you in your personal study library.
                    </p>
                  </button>
                </div>
              </div>

              {/* Ready to Publish Card Preview */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {formValues.title}
                  </span>
                  <Badge variant="secondary" className="rounded-full text-[10px] font-semibold uppercase">
                    {formValues.type || "pdf"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {formValues.aiSummary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Common Modal Footer across all steps */}
        <div className="flex items-center justify-between border-t border-border/50 px-6 sm:px-8 py-4 bg-muted/10">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={isSubmitting}
              className="rounded-full text-xs font-medium cursor-pointer"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            onClick={handleNext}
            disabled={isNextDisabled}
            className="rounded-full bg-neutral-900 px-6 text-white hover:bg-neutral-800 dark:bg-foreground dark:text-background gap-2 text-xs font-semibold cursor-pointer"
          >
            {currentStep === 1 && "Next: Details"}
            {currentStep === 2 && "Process resource"}
            {currentStep === 3 && "Continue to Preview"}
            {currentStep === 4 && "Next: Publish"}
            {currentStep === 5 &&
              (isSubmitting ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="size-3.5" />
                  <span>Publish to Library</span>
                </>
              ))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
