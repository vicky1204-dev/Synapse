"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "../queries";
import { useAssociateCourseResource } from "../mutations";
import {
  SearchIcon,
  BookOpenIcon,
  CheckIcon,
  FolderIcon,
  PlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCourseDialogProps {
  resourceId: string;
  resourceTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddToCourseDialog({
  resourceId,
  resourceTitle,
  open,
  onOpenChange,
  onSuccess,
}: AddToCourseDialogProps) {
  const [search, setSearch] = React.useState("");
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(
    null,
  );

  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({
    status: "active",
    limit: 50,
  });

  const associateMutation = useAssociateCourseResource();
  const courses = React.useMemo(
    () => coursesData?.data ?? [],
    [coursesData?.data],
  );

  const filteredCourses = React.useMemo(() => {
    if (!search.trim()) return courses;
    const query = search.toLowerCase().trim();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        (c.code && c.code.toLowerCase().includes(query)),
    );
  }, [courses, search]);

  const handleAdd = async () => {
    if (!selectedCourseId) return;

    try {
      await associateMutation.mutateAsync({
        courseId: selectedCourseId,
        resourceId,
      });

      onOpenChange(false);
      setSelectedCourseId(null);
      setSearch("");
      onSuccess?.();
    } catch {
      // Error is handled by mutation toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpenIcon className="size-3.5" />
            <span>Course Workspace</span>
          </div>
          <DialogTitle className="font-heading text-lg font-bold">
            Add to Course
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
            Associate &ldquo;{resourceTitle}&rdquo; with one of your courses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Search bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search your courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-full"
            />
          </div>

          {/* Courses List */}
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {isLoadingCourses ? (
              <div className="flex h-32 items-center justify-center">
                <Spinner className="size-6 text-primary" />
              </div>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => {
                const isSelected = selectedCourseId === course.id;

                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelectedCourseId(course.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-2xl border transition text-left cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-card/60 hover:bg-muted/50 hover:border-border",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="size-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: course.cover?.color || "#525F8C",
                        }}
                      />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground truncate">
                            {course.title}
                          </span>
                          {course.code && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 font-mono"
                            >
                              {course.code}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {course.resourcesCount ?? 0}{" "}
                          {(course.resourcesCount ?? 0) === 1
                            ? "resource"
                            : "resources"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/70 bg-background",
                      )}
                    >
                      {isSelected && <CheckIcon className="size-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })
            ) : courses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 p-6 text-center space-y-3">
                <FolderIcon className="mx-auto size-6 text-muted-foreground/60" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    No active courses found
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Create a course first to associate study resources.
                  </p>
                </div>
                <Link
                  href="/courses"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <PlusIcon className="size-3" />
                  <span>Go to My Courses</span>
                </Link>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No courses match &ldquo;{search}&rdquo;.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-full text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!selectedCourseId || associateMutation.isPending}
            onClick={handleAdd}
            className="rounded-full text-xs font-semibold shadow-xs"
          >
            {associateMutation.isPending && (
              <Spinner className="mr-1.5 size-3.5" />
            )}
            Add to Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
