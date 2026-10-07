"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CourseFolderGraphic } from "./course-folder-graphic";
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
  ExternalLinkIcon,
  FilesIcon,
  FolderIcon,
} from "lucide-react";
import { useDeleteCourse } from "../mutations";
import { toast } from "@/components/ui/toast";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
}

export function CourseCard({ course, onEdit }: CourseCardProps) {
  const router = useRouter();
  const deleteMutation = useDeleteCourse();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const handleCardClick = () => {
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

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="group flex flex-col items-center gap-2.5 text-center cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl p-1 transition-transform duration-200 hover:-translate-y-1"
      >
        {/* Tabbed Folder Graphic */}
        <div className="w-full">
          <CourseFolderGraphic color={course.cover?.color || "#525F8C"}>
            <div className="flex items-center justify-between px-1 text-white/90">
              {/* Bottom-left stats icons */}
              <div className="flex items-center gap-2 text-white/80">
                <div
                  className="flex items-center gap-1 text-[11px] font-medium"
                  title={`${course.resourcesCount} resources`}
                >
                  <FilesIcon className="size-3.5 opacity-80" />
                  <span>{course.resourcesCount}</span>
                </div>
                <div
                  className="flex items-center gap-1 text-[11px] font-medium opacity-80"
                  title={`${course.studyPacksCount ?? 0} study packs`}
                >
                  <FolderIcon className="size-3.5" />
                  <span>{course.studyPacksCount ?? 0}</span>
                </div>
              </div>

              {/* Bottom-right 3-dots action menu */}
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Course options"
                    className="flex size-6 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-black/20 hover:text-white focus-visible:outline-hidden"
                  >
                    <MoreHorizontalIcon className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/courses/${course.id}`);
                      }}
                    >
                      <ExternalLinkIcon className="size-4 mr-2" />
                      Open Workspace
                    </DropdownMenuItem>
                    {onEdit && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(course);
                        }}
                      >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2Icon className="size-4 mr-2" />
                      Delete Course
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CourseFolderGraphic>
        </div>

        {/* Title and details below folder */}
        <div className="flex flex-col items-center px-1 max-w-full">
          <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground truncate max-w-full group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          {(course.code || course.department) && (
            <p className="text-[11px] font-medium text-muted-foreground truncate max-w-full">
              {course.code || course.department}
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{course.title}&rdquo;? This will remove
              the course workspace and its associations. This action cannot be undone.
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
