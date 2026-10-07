"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LightbulbIcon,
  FolderIcon,
  FileTextIcon,
  GlobeIcon,
  RotateCwIcon,
  BookOpenIcon,
  LayersIcon,
  HelpCircleIcon,
} from "lucide-react";
import type { Course, CourseResourceItem } from "../types";

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
  const secondResource = resources[1]?.resource;
  const thirdResource = resources[2]?.resource;

  return (
    <div className="space-y-10">
      {/* ── Section 1: Study Plan ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <BookOpenIcon className="size-4 text-primary" />
          <span>Study</span>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <LightbulbIcon className="size-4 text-amber-500" />
            <span>Study plan</span>
          </div>

          <div className="rounded-2xl border border-border/50 bg-background/60 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
              <LightbulbIcon className="size-4 text-amber-500" />
              <span>Next up</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground">
              <li className="font-semibold text-foreground">
                {firstResource?.title || `${course.title} Fundamentals`}
              </li>
              <li className="leading-relaxed">
                Review key definitions, architecture, and common exam questions before
                moving into interactive practice quizzes.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ── Section 2: Study Packs ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <LightbulbIcon className="size-4 text-primary" />
          <span>Study Packs</span>
        </div>

        {/* Primary Study Pack Card */}
        <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <FolderIcon className="size-4 text-primary" />
              <span>{course.title} - Study Pack</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {resourcesCount} {resourcesCount === 1 ? "resource" : "resources"}
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground max-w-3xl">
            This Study Pack combines the selected resources into a focused study path.
            Use it to review concepts, complete practice activities, and update your
            mastery without counting resource opens toward completion.
          </p>

          {/* Sources list */}
          <div className="space-y-2">
            {resources.slice(0, 3).map((item) => (
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
            <Button
              size="sm"
              className="rounded-full px-5 text-xs font-semibold shadow-xs"
            >
              Study
            </Button>
            <Button
              variant="outline"
              size="sm"
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

        {/* Sub-packs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <FolderIcon className="size-4 text-muted-foreground" />
              <span>{firstResource?.title || `${course.title} Fundamentals`}</span>
            </div>
            <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px]">
              {Math.max(1, Math.min(2, resourcesCount))} resources
            </Badge>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Core principles, synchronization, and race conditions are already linked
              to this pack.
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <FolderIcon className="size-4 text-muted-foreground" />
              <span>{secondResource?.title || "Scheduling & Concurrency"}</span>
            </div>
            <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px]">
              1 resource
            </Badge>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scheduling algorithms, context switching, and comparison steps are ready
              for review.
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <FolderIcon className="size-4 text-muted-foreground" />
              <span>{thirdResource?.title || "Memory Architecture"}</span>
            </div>
            <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px]">
              1 resource
            </Badge>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paging, segmentation, virtual memory, and memory-related questions are
              grouped here.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 3: Study Activities ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <LayersIcon className="size-4 text-primary" />
          <span>Study activities</span>
        </div>

        {/* Concept Review Card */}
        <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <BookOpenIcon className="size-4 text-primary" />
            <span>Concept review</span>
          </div>

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
            <p className="text-[11px] text-muted-foreground">
              Flashcards, quizzes, concept reviews, and study steps are counted toward
              course completion.
            </p>
          </div>

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
            <p className="text-[11px] text-muted-foreground">
              Scheduling, process basics, and synchronization are mastered. Memory
              management is next.
            </p>
          </div>
        </div>

        {/* Flashcards & Quizzes 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Flashcards Card */}
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <LayersIcon className="size-4 text-primary" />
                <span>Flashcards</span>
              </div>
              <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs">
                3 sets
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review key terms, definitions, and memory-related study questions before
              you move into practice.
            </p>
          </div>

          {/* Quizzes Card */}
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <HelpCircleIcon className="size-4 text-amber-500" />
                <span>Quizzes</span>
              </div>
              <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs">
                2 attempts
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Practice scheduling, process synchronization, and race conditions to
              reinforce concept mastery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
