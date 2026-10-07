"use client";

import * as React from "react";
import { PlusIcon, BookOpenIcon, RefreshCwIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "../queries";
import { CourseCard } from "./course-card";
import { CurrentlyStudyingCard } from "./currently-studying-card";
import { CourseDialog } from "./course-dialog";
import type { Course } from "../types";

export function CoursesView() {
  const { data, isLoading, isError, error, refetch } = useCourses({
    status: "active",
    limit: 50,
  });

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);

  const courses = data?.data ?? [];
  const featuredCourse = courses[0];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            My Courses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal course workspaces, study packs, and notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateDialogOpen(true)}
          className="flex size-11 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-all hover:scale-105 hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
          aria-label="Create new course"
          title="Create new course"
        >
          <PlusIcon className="size-5 stroke-[2.5]" />
        </button>
      </div>

      {/* ── Loading Skeleton ── */}
      {isLoading && (
        <div className="space-y-10">
          <div>
            <Skeleton className="h-5 w-36 mb-4 rounded-lg" />
            <div className="flex flex-col md:flex-row gap-6 rounded-3xl border border-border/40 p-6 bg-card/40">
              <Skeleton className="h-44 w-full md:w-[280px] rounded-2xl shrink-0" />
              <div className="flex-1 space-y-4 py-2">
                <Skeleton className="h-7 w-1/3 rounded-lg" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-4 w-28 ml-auto rounded-md" />
                <div className="flex gap-4 pt-6">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-28 mb-4 rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="space-y-3">
                  <Skeleton className="aspect-[280/190] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4 mx-auto rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Error State ── */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 p-12 text-center">
          <AlertCircleIcon className="size-10 text-destructive mb-3" />
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Failed to load courses
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while fetching your courses."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 rounded-full"
          >
            <RefreshCwIcon className="mr-2 size-3.5" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && !isError && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/30 p-12 text-center sm:p-16">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <BookOpenIcon className="size-7" />
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            No courses yet
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Create your first academic course workspace to start organizing study materials,
            lecture notes, and group discussions.
          </p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="mt-6 rounded-full px-6 text-sm font-medium shadow-xs"
          >
            <PlusIcon className="mr-2 size-4" />
            Create Course
          </Button>
        </div>
      )}

      {/* ── Content View ── */}
      {!isLoading && !isError && courses.length > 0 && (
        <div className="space-y-12">
          {/* Section 1: Currently Studying */}
          {featuredCourse && (
            <section aria-labelledby="currently-studying-title">
              <h2
                id="currently-studying-title"
                className="text-sm font-medium text-muted-foreground mb-3"
              >
                Currently Studying
              </h2>
              <CurrentlyStudyingCard
                course={featuredCourse}
                onEdit={(c) => setEditingCourse(c)}
              />
            </section>
          )}

          {/* Section 2: All Courses Grid */}
          <section aria-labelledby="all-courses-title">
            <h2
              id="all-courses-title"
              className="text-sm font-medium text-muted-foreground mb-4"
            >
              All courses
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={(c) => setEditingCourse(c)}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── Course Dialogs ── */}
      <CourseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
      />

      <CourseDialog
        open={Boolean(editingCourse)}
        onOpenChange={(open) => {
          if (!open) setEditingCourse(null);
        }}
        mode="edit"
        course={editingCourse}
      />
    </div>
  );
}
