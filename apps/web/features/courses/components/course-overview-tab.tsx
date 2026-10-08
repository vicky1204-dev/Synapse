"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LightbulbIcon,
  BookOpenIcon,
  FolderIcon,
  FileTextIcon,
  RotateCwIcon,
  GlobeIcon,
  ArrowRightIcon,
  PlayIcon,
  ClockIcon,
} from "lucide-react";
import type { Course, CourseResourceItem } from "../types";
import { useCourseStudy } from "@/features/study";

interface CourseOverviewTabProps {
  course: Course;
  resources: CourseResourceItem[];
  onTabChange: (tab: "overview" | "resources" | "study" | "discussions") => void;
}

export function CourseOverviewTab({
  course,
  resources,
  onTabChange,
}: CourseOverviewTabProps) {
  const { data: studyData } = useCourseStudy(course.id);
  const activities = studyData?.activities ?? [];
  const progress = studyData?.progress;

  const resourcesCount = resources.length;
  const totalActivities = progress?.totalActivityCount ?? activities.length;
  const completedActivities = progress?.completedActivityCount ?? 0;
  const progressPercent =
    progress?.completionPercentage ??
    (course.progress !== undefined && course.progress !== null
      ? course.progress
      : totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 0);
  const totalStudyTimeMinutes = progress?.totalStudyTimeMinutes ?? 0;

  const nextActivity =
    activities.find((a) => a.progress?.status !== "completed") ||
    activities[0];

  const nextUpTitle =
    nextActivity?.title ??
    (resources[0]?.resource?.title
      ? `Study ${resources[0]?.resource?.title}`
      : `${course.title} Fundamentals`);

  const nextUpSummary =
    nextActivity?.description ??
    (nextActivity?.resource
      ? `Review materials and concepts from ${nextActivity.resource.title}.`
      : "Review core definitions, architecture, and lecture materials before moving into practice.");

  return (
    <div className="space-y-6">
      {/* ── Course Summary Card ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8 backdrop-blur-xs shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <LightbulbIcon className="size-4 text-amber-500" />
          <span>Course summary</span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {course.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {course.description ||
              `Build a structured academic study path for ${course.title}. This overview helps you move from reading notes and materials into active study sessions, concept review, and flashcards.`}
          </p>
        </div>

        {/* Next Up / Continue Studying Container */}
        <div className="rounded-2xl border border-border/50 bg-background/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
              <LightbulbIcon className="size-4 text-amber-500" />
              <span>Next up in Study Plan</span>
            </div>
            {nextActivity?.progress?.status === "in-progress" && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <ClockIcon className="size-3" />
                In Progress
              </span>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{nextUpTitle}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {nextUpSummary}
            </p>
          </div>

          <div className="pt-1 flex items-center gap-3">
            {nextActivity ? (
              <Link
                href={`/study/${nextActivity.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                <PlayIcon className="size-3 fill-current" />
                <span>
                  {nextActivity.progress?.status === "in-progress"
                    ? "Continue Studying"
                    : "Start Activity"}
                </span>
                <ArrowRightIcon className="size-3 ml-0.5" />
              </Link>
            ) : (
              <Button
                size="sm"
                onClick={() => onTabChange("study")}
                className="rounded-full text-xs"
              >
                Go to Study Plan
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Learning Progress */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <BookOpenIcon className="size-4 text-primary" />
              <span>Learning progress</span>
            </div>
            {totalStudyTimeMinutes > 0 && (
              <span className="text-[11px] font-mono text-muted-foreground">
                {totalStudyTimeMinutes} min logged
              </span>
            )}
          </div>

          {/* Completed activities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Completed activities</span>
              <span className="tabular-nums font-mono">
                {completedActivities}/{totalActivities}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15 dark:bg-primary/25">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Activities completed count toward course mastery and completion.
            </p>
          </div>

          {/* Overall completion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Course progress</span>
              <span className="tabular-nums font-mono">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15 dark:bg-primary/25">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Overall course progress tracked across study activities and resources.
            </p>
          </div>
        </div>

        {/* Right Column: Primary Study Pack Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <FolderIcon className="size-4 text-primary" />
              <span>{course.title} - Study Pack</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Based on {resourcesCount} {resourcesCount === 1 ? "resource" : "resources"} •{" "}
              {activities.length} activities
            </p>
          </div>

          {/* Sources list */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground">Sources</span>
            <div className="space-y-2">
              {resources.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-1">
                  No resources linked yet. Add materials to generate study pack sources.
                </p>
              ) : (
                resources.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-xs text-foreground/90 font-medium truncate"
                  >
                    {item.resource.type === "link" ? (
                      <GlobeIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <FileTextIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{item.resource.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
            {nextActivity ? (
              <Link
                href={`/study/${nextActivity.id}`}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                Study
              </Link>
            ) : (
              <Button
                size="sm"
                onClick={() => onTabChange("study")}
                className="rounded-full px-4 text-xs font-semibold shadow-xs"
              >
                Study
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange("study")}
              className="rounded-full px-3 text-xs"
            >
              <RotateCwIcon className="mr-1 size-3" />
              Regenerate
            </Button>
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
      </div>
    </div>
  );
}
