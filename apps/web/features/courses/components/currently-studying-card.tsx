"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CourseFolderGraphic } from "./course-folder-graphic";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  CopyIcon,
  ArrowRightIcon,
  FileTextIcon,
  FolderIcon,
  ClockIcon,
} from "lucide-react";
import { useDeleteCourse } from "../mutations";
import { toast } from "@/components/ui/toast";
import type { Course } from "../types";

interface CurrentlyStudyingCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
}

export function CurrentlyStudyingCard({
  course,
  onEdit,
}: CurrentlyStudyingCardProps) {
  const router = useRouter();
  const deleteMutation = useDeleteCourse();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const handleOpenWorkspace = () => {
    router.push(`/courses/${course.id}`);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/courses/${course.id}`;
    navigator.clipboard.writeText(url);
    toast.add({
      title: "Link copied",
      description: "Course workspace URL copied to clipboard.",
      type: "success",
    });
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(course.id);
  };

  // Derive concept/resource counts and progress for display
  const resourcesCount = course.resourcesCount ?? 0;
  const studyPacksCount = Math.max(1, Math.ceil(resourcesCount / 3));
  // Progress can be computed or have a sensible starting metric based on activity
  const progressPercent = Math.min(100, Math.max(25, resourcesCount * 12));
  const completedConcepts = Math.min(
    18,
    Math.max(4, Math.round((progressPercent / 100) * 18)),
  );

  return (
    <>
      <div
        role="region"
        aria-label={`Currently studying ${course.title}`}
        className="group relative flex flex-col md:flex-row items-center gap-6 rounded-3xl border border-border/70 bg-card/60 p-4 sm:p-6 backdrop-blur-xs shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm"
      >
        {/* Left side: Large folder graphic */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpenWorkspace}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenWorkspace();
            }
          }}
          className="w-full max-w-[240px] sm:max-w-[280px] shrink-0 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
        >
          <CourseFolderGraphic
            color={course.cover?.color || "#525F8C"}
            showLightbulb={true}
          />
        </div>

        {/* Right side: Course progress & action stats */}
        <div className="flex flex-1 flex-col justify-between self-stretch gap-4 sm:gap-6">
          {/* Top section: Title & Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h2
                onClick={handleOpenWorkspace}
                className="cursor-pointer font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
              >
                {course.title}
              </h2>
              <span className="font-heading text-sm sm:text-base font-semibold text-foreground">
                {progressPercent}%
              </span>
            </div>

            {/* Progress track */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/15 dark:bg-primary/25">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Concepts count subtitle */}
            <div className="flex justify-end">
              <span className="text-xs font-medium text-muted-foreground">
                {completedConcepts}/18 Concepts
              </span>
            </div>
          </div>

          {/* Bottom section: Metadata chips + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/40">
            {/* Metadata chips */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileTextIcon className="size-4 opacity-75" />
                <span>{resourcesCount} Resources</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FolderIcon className="size-4 opacity-75" />
                <span>{studyPacksCount} Study Packs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="size-4 opacity-75" />
                <span>
                  {course.semester
                    ? `${course.semester}${course.year ? ` · ${course.year}` : ""}`
                    : "In Progress"}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenWorkspace}
                className="rounded-full px-4 text-xs font-semibold hover:bg-foreground hover:text-background transition-colors"
              >
                Continue Studying
                <ArrowRightIcon className="ml-1 size-3.5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Course options"
                  className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-hidden"
                >
                  <MoreHorizontalIcon className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(course)}>
                      <PencilIcon className="size-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <CopyIcon className="size-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2Icon className="size-4 mr-2" />
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{course.title}&rdquo;? This will remove
              the course workspace and all associated materials. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
