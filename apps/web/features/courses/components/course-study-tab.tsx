"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  LightbulbIcon,
  FolderIcon,
  FileTextIcon,
  GlobeIcon,
  BookOpenIcon,
  LayersIcon,
  CheckCircle2Icon,
  ClockIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  RotateCcwIcon,
} from "lucide-react";
import type { Course, CourseResourceItem } from "../types";
import { useCourseStudy } from "@/features/study";

interface CourseStudyTabProps {
  course: Course;
  resources: CourseResourceItem[];
  onTabChange: (tab: "overview" | "resources" | "study" | "discussions") => void;
}

export function CourseStudyTab({
  course,
  resources,
  onTabChange,
}: CourseStudyTabProps) {
  const {
    data: studyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseStudy(course.id);

  const activities = studyData?.activities ?? [];
  const progress = studyData?.progress;
  const resourcesCount = resources.length;

  const totalActivities = progress?.totalActivityCount ?? activities.length;
  const completedActivities = progress?.completedActivityCount ?? 0;
  const completionPercentage =
    progress?.completionPercentage ??
    (totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0);
  const totalStudyTimeMinutes = progress?.totalStudyTimeMinutes ?? 0;

  // Next activity to study: first non-completed activity, or the first one
  const nextActivity =
    activities.find((act) => act.progress?.status !== "completed") ||
    activities[0];

  if (isLoading) {
    return (
      <div className="space-y-8 py-6">
        <div className="flex items-center gap-3 text-muted-foreground text-xs">
          <Spinner className="size-4 text-primary" />
          <span>Loading course study plan and activities...</span>
        </div>
        <div className="h-40 rounded-3xl border border-border/50 bg-card/40 animate-pulse" />
        <div className="h-64 rounded-3xl border border-border/50 bg-card/40 animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-4">
        <AlertCircleIcon className="mx-auto size-8 text-destructive" />
        <div className="space-y-1">
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Failed to load study activities
          </h3>
          <p className="text-xs text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while fetching course study details."}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="rounded-full text-xs"
        >
          <RotateCcwIcon className="mr-1.5 size-3.5" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ── Section 1: Study Plan ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <BookOpenIcon className="size-4 text-primary" />
          <span>Study Plan</span>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <LightbulbIcon className="size-4 text-amber-500" />
              <span>Next up</span>
            </div>
            {totalActivities > 0 && (
              <Badge variant="secondary" className="rounded-full text-[11px] font-mono">
                {completedActivities} / {totalActivities} completed
              </Badge>
            )}
          </div>

          {nextActivity ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 p-5">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full text-[10px] uppercase font-semibold tracking-wider"
                  >
                    {nextActivity.type.replace("-", " ")}
                  </Badge>
                  {nextActivity.progress?.status === "in-progress" && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      <ClockIcon className="size-3" />
                      In progress
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground truncate">
                  {nextActivity.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {nextActivity.description ||
                    (nextActivity.resource
                      ? `Studying ${nextActivity.resource.title}`
                      : "Review definitions, key concepts, and study notes.")}
                </p>
              </div>

              <Link
                href={`/study/${nextActivity.id}`}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                <span>
                  {nextActivity.progress?.status === "in-progress"
                    ? "Resume Study"
                    : "Start Study"}
                </span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </div>
          ) : activities.length > 0 && completedActivities === totalActivities ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-center gap-3">
              <CheckCircle2Icon className="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">
                  All course activities completed!
                </h4>
                <p className="text-xs text-muted-foreground">
                  You have completed all {totalActivities} activities and logged{" "}
                  {totalStudyTimeMinutes} minutes of focused study.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 p-6 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                No study activities available yet for this course.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTabChange("resources")}
                className="rounded-full text-xs"
              >
                Go to Resources to link materials
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 2: Study Pack Overview ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <FolderIcon className="size-4 text-primary" />
          <span>Study Pack</span>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <FolderIcon className="size-4 text-primary" />
              <span>{course.title} - Study Pack</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {resourcesCount} {resourcesCount === 1 ? "resource" : "resources"} •{" "}
              {activities.length} study {activities.length === 1 ? "activity" : "activities"} •{" "}
              {totalStudyTimeMinutes} min focused
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground max-w-3xl">
            This Study Pack organizes course materials into structured study activities.
            Engage with materials using the built-in focus timer, take notes, and track your
            progress towards mastery.
          </p>

          {/* Sources list */}
          <div className="space-y-2">
            {resources.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-xs text-foreground/90 font-medium"
              >
                {item.resource.type === "link" ? (
                  <GlobeIcon className="size-3.5 text-muted-foreground" />
                ) : (
                  <FileTextIcon className="size-3.5 text-muted-foreground" />
                )}
                <span>{item.resource.title}</span>
              </div>
            ))}
            {resources.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                No resources linked yet. Link materials from the Resource library.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
            {nextActivity && (
              <Link
                href={`/study/${nextActivity.id}`}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                Study Now
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange("resources")}
              className="rounded-full px-3 text-xs"
            >
              View sources
            </Button>
          </div>
        </div>
      </section>

      {/* ── Section 3: Study Activities List & Progress ── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <LayersIcon className="size-4 text-primary" />
            <span>Study Activities</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {completedActivities} of {totalActivities} Completed ({completionPercentage}%)
          </span>
        </div>

        {/* Progress summary bar */}
        <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>Overall Course Progress</span>
            <span className="font-mono">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15 dark:bg-primary/25">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{totalStudyTimeMinutes} minutes total focus time</span>
            <span>{totalActivities - completedActivities} activities remaining</span>
          </div>
        </div>

        {/* Activity Cards List */}
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((act) => {
              const actStatus = act.progress?.status || "not-started";
              const durationMins = Math.round((act.progress?.durationSeconds || 0) / 60);

              return (
                <div
                  key={act.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 sm:p-5 backdrop-blur-xs hover:bg-card/80 transition shadow-2xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 rounded-xl border border-border/60 bg-background p-2 text-primary shrink-0">
                      {act.type === "resource-study" ? (
                        <FileTextIcon className="size-4" />
                      ) : (
                        <BookOpenIcon className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {act.title}
                        </span>
                        {actStatus === "completed" && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full px-2 py-0 text-[10px]">
                            Completed
                          </Badge>
                        )}
                        {actStatus === "in-progress" && (
                          <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 rounded-full px-2 py-0 text-[10px]">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="uppercase text-[10px] font-semibold tracking-wider">
                          {act.type.replace("-", " ")}
                        </span>
                        {durationMins > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-mono">
                              <ClockIcon className="size-3" />
                              {durationMins}m spent
                            </span>
                          </>
                        )}
                        {act.resource && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">
                              {act.resource.title}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:self-center">
                    <Link
                      href={`/study/${act.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-border/80 bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                    >
                      {actStatus === "completed"
                        ? "Review"
                        : actStatus === "in-progress"
                          ? "Resume"
                          : "Study"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/70 p-8 text-center space-y-2">
            <LayersIcon className="mx-auto size-8 text-muted-foreground/60" />
            <h4 className="text-xs font-semibold text-foreground">
              No study activities found
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Link resources to this course to automatically generate activities for
              reading, concept review, and focus sessions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
