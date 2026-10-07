"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  LightbulbIcon,
  BookOpenIcon,
  FolderIcon,
  FileTextIcon,
  RotateCwIcon,
  GlobeIcon,
} from "lucide-react";
import type { Course, CourseResourceItem } from "../types";

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
  const resourcesCount = resources.length;
  const progressPercent =
    course.progress !== undefined && course.progress !== null
      ? course.progress
      : resourcesCount > 0
        ? Math.min(100, resourcesCount * 20)
        : 0;

  const totalActivities = Math.max(6, resourcesCount * 4);
  const completedActivities = Math.round((progressPercent / 100) * totalActivities);

  const totalConcepts = Math.max(3, resourcesCount * 2);
  const masteredConcepts = Math.round((progressPercent / 100) * totalConcepts);

  const firstResource = resources[0]?.resource;
  const nextUpTitle = firstResource?.title ?? `${course.title} Fundamentals`;
  const nextUpSummary =
    firstResource?.aiMetadata?.summary ??
    "Review core concepts, definitions, and lecture materials before moving into active practice questions.";

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

        {/* Next Up Container */}
        <div className="rounded-2xl border border-border/50 bg-background/60 p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
            <LightbulbIcon className="size-4 text-amber-500" />
            <span>Next up</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{nextUpTitle}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {nextUpSummary}
          </p>
        </div>
      </div>

      {/* ── Bottom 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Learning Progress */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <BookOpenIcon className="size-4 text-primary" />
            <span>Learning progress</span>
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
              Flashcards, quizzes, concept reviews, and study steps are counted toward
              course completion.
            </p>
          </div>

          {/* Concept mastery */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Concept mastery</span>
              <span className="tabular-nums font-mono">
                {masteredConcepts}/{totalConcepts}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15 dark:bg-primary/25">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${totalConcepts > 0 ? (masteredConcepts / totalConcepts) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Core concepts and terminology from lecture materials and review notes.
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
              Based on {resourcesCount} {resourcesCount === 1 ? "resource" : "resources"}
            </p>
          </div>

          {/* Sources list */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground">Sources</span>
            <div className="space-y-2">
              {resources.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-1">
                  No resources linked yet. Add notes to generate study pack sources.
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
            <Button
              size="sm"
              onClick={() => onTabChange("study")}
              className="rounded-full px-4 text-xs font-semibold shadow-xs"
            >
              Study
            </Button>
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
