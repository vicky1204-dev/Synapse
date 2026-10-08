"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpenIcon,
  ClockIcon,
  PlayIcon,
  ArrowRightIcon,
  FolderIcon,
  FileTextIcon,
  SparklesIcon,
  GraduationCapIcon,
} from "lucide-react";
import { useRecentStudy } from "../queries";
import { useCourses } from "@/features/courses";
import { FocusTimer } from "./focus-timer";
import { useFocusTimer } from "../hooks/use-focus-timer";

export function StudyEntryView() {
  const {
    data: recentItems = [],
    isLoading: isRecentLoading,
  } = useRecentStudy(10);

  const {
    data: coursesData,
    isLoading: isCoursesLoading,
  } = useCourses({ status: "active", limit: 20 });

  const courses = coursesData?.data ?? [];
  const heroItem = recentItems[0];
  const moreRecent = recentItems.slice(1);

  // Standalone focus timer for quick study sessions on the hub
  const timer = useFocusTimer({
    initialMinutes: 25,
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <BookOpenIcon className="size-4" />
            <span>Workspace</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            My Study
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resume active sessions, time your focus periods, and track your learning progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            <FolderIcon className="size-3.5 text-muted-foreground" />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>

      {/* ── Section: Hero (Continue Studying + Quick Timer) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Featured Continue Studying Card */}
        <div className="lg:col-span-2 space-y-6">
          {isRecentLoading ? (
            <div className="rounded-3xl border border-border/50 bg-card/40 p-8 space-y-4 animate-pulse">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-8 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="pt-4 flex gap-3">
                <Skeleton className="h-10 w-36 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            </div>
          ) : heroItem ? (
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card/90 via-card/70 to-primary/5 p-6 sm:p-8 backdrop-blur-xs shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold uppercase tracking-wider"
                  >
                    Continue Studying
                  </Badge>
                  {heroItem.progress.status === "completed" ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full text-[11px]">
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 rounded-full text-[11px]">
                      In Progress
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <ClockIcon className="size-3.5 text-muted-foreground" />
                  <span>
                    {Math.max(1, Math.round(heroItem.progress.durationSeconds / 60))} min focused
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <GraduationCapIcon className="size-3.5 text-primary" />
                  <span>{heroItem.course.title}</span>
                  {heroItem.course.code && (
                    <span className="font-mono text-[11px]">({heroItem.course.code})</span>
                  )}
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  {heroItem.activity.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {heroItem.activity.description ||
                    (heroItem.resource
                      ? `Continue studying material from "${heroItem.resource.title}".`
                      : "Pick up right where you left off in your study plan.")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={`/study/${heroItem.activity.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                >
                  <PlayIcon className="size-3.5 fill-current" />
                  <span>Resume Activity</span>
                </Link>

                <Link
                  href={`/courses/${heroItem.course.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  <span>Course Workspace</span>
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/30 p-8 sm:p-10 text-center space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-background text-primary shadow-2xs">
                <SparklesIcon className="size-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Ready to start studying?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Open any course to start studying its resources with our distraction-free
                  workspace, interactive focus timer, and notes scratchpad.
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                <span>Select a Course</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </div>
          )}

          {/* ── Section: More Recently Studied ── */}
          {moreRecent.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recently Studied
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  {moreRecent.length} additional activities
                </span>
              </div>

              <div className="space-y-3">
                {moreRecent.map((item) => {
                  const durationMins = Math.round(item.progress.durationSeconds / 60);
                  const isDone = item.progress.status === "completed";

                  return (
                    <div
                      key={item.activity.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-xs hover:bg-card/90 transition shadow-2xs"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 rounded-xl border border-border/60 bg-background p-2 text-primary shrink-0">
                          {item.activity.type === "resource-study" ? (
                            <FileTextIcon className="size-4" />
                          ) : (
                            <BookOpenIcon className="size-4" />
                          )}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {item.activity.title}
                            </span>
                            {isDone ? (
                              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full px-2 py-0 text-[10px]">
                                Done
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 rounded-full px-2 py-0 text-[10px]">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                            <span>{item.course.title}</span>
                            {durationMins > 0 && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{durationMins}m spent</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/study/${item.activity.id}`}
                        className="inline-flex shrink-0 items-center justify-center rounded-full border border-border/80 bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition sm:self-center"
                      >
                        {isDone ? "Review" : "Resume"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Focus Timer Widget */}
        <div className="space-y-6">
          <FocusTimer timer={timer} variant="card" />

          {/* Quick study tips card */}
          <div className="rounded-3xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <SparklesIcon className="size-4 text-amber-500" />
              <span>Study Tip</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Break your study sessions into 25-minute Pomodoro focus blocks with 5-minute
              breaks in between to maximize retention and prevent cognitive fatigue.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section: Active Course Workspaces ── */}
      <section className="space-y-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <FolderIcon className="size-4 text-primary" />
              <span>Study by Course</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mt-0.5">
              Course Workspaces
            </h3>
          </div>

          <Link
            href="/courses"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all courses →
          </Link>
        </div>

        {isCoursesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 rounded-3xl border border-border/40 bg-card/40 animate-pulse"
              />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 6).map((c) => {
              const progressPct = c.progress ?? 0;

              return (
                <div
                  key={c.id}
                  className="group rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs shadow-xs hover:border-border transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="size-3 rounded-full shrink-0"
                          style={{
                            backgroundColor: c.cover?.color || "#525F8C",
                          }}
                        />
                        <span className="text-xs font-semibold text-foreground truncate">
                          {c.title}
                        </span>
                      </div>
                      {c.code && (
                        <span className="text-[10px] font-mono text-muted-foreground shrink-0 uppercase">
                          {c.code}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Course Progress</span>
                        <span className="font-mono font-semibold text-foreground">
                          {progressPct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/15 dark:bg-primary/25">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {c.resourcesCount ?? 0} {c.resourcesCount === 1 ? "resource" : "resources"}
                    </span>
                    <Link
                      href={`/courses/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Study</span>
                      <ArrowRightIcon className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/70 p-8 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              No active courses found. Create a course to organize study resources.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full border border-border/80 bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Go to Courses
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
