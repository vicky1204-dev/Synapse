"use client";

import * as React from "react";
import Link from "next/link";
import { useHomeDashboard } from "../queries";
import { StudyTrendChart } from "./study-trend-chart";
import { CourseDialog } from "@/features/courses/components/course-dialog";
import { UploadDialog } from "@/features/resources/components/upload-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { homeKeys } from "../keys";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  ArrowRightIcon,
  BookOpenIcon,
  MessageSquareIcon,
  ClockIcon,
  TimerIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  FolderIcon,
  UploadIcon,
  SparklesIcon,
} from "lucide-react";

export function HomeView() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isFetching, refetch } = useHomeDashboard();

  const [createCourseOpen, setCreateCourseOpen] = React.useState(false);
  const [uploadResourceOpen, setUploadResourceOpen] = React.useState(false);

  // Time-of-day greeting
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Formatted date for Upcoming widget (e.g. "9 Oct")
  const formattedDate = React.useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
    }).format(new Date());
  }, []);

  // ── 1. LOADING STATE ──
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 sm:h-10 w-64 rounded-2xl" />
            <Skeleton className="h-4 w-80 sm:w-96 rounded-md" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>

        {/* Hero grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Continue Studying Card skeleton */}
            <div className="rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-7 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28 rounded-full" />
                  <Skeleton className="h-7 w-52 rounded-xl" />
                  <Skeleton className="h-4 w-36 rounded-md" />
                </div>
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <div className="space-y-2 pt-1">
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-36 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            </div>

            {/* Today's plan Card skeleton */}
            <div className="rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-6 w-56 rounded-xl" />
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <div className="space-y-3 pt-1">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-3.5">
                      <Skeleton className="size-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40 rounded-md" />
                        <Skeleton className="h-3 w-56 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-12 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16 rounded-full" />
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
              <div className="flex gap-3.5 pt-1">
                <Skeleton className="size-10 rounded-2xl" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-full rounded-md" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-14 rounded-full" />
                <Skeleton className="h-4 w-10 rounded-full" />
              </div>
              <div className="space-y-4 pt-1">
                {[1, 2].map((n) => (
                  <div key={n} className="flex gap-3.5">
                    <Skeleton className="size-10 rounded-2xl" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-24 rounded-md" />
                      <Skeleton className="h-3 w-40 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="space-y-4 pt-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-7 space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex items-end justify-between gap-3 h-44 pt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div key={n} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
                  <Skeleton className="w-full max-w-[56px] h-36 rounded-2xl" />
                  <Skeleton className="h-3 w-6 rounded-md" />
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t border-border/40">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. ERROR STATE ──
  if (isError || !data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/10 text-destructive mb-4 shadow-xs">
          <AlertCircleIcon className="size-7" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          Unable to load dashboard
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-sm">
          We encountered an issue retrieving your study workspace data. Please check your connection and try again.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <Button
            variant="outline"
            className="rounded-full gap-2 border-border/80 hover:bg-card"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCwIcon className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>{isFetching ? "Retrying..." : "Retry"}</span>
          </Button>

          <Link
            href="/study"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium px-4 py-2 text-sm inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Go to Study</span>
          </Link>
        </div>
      </div>
    );
  }

  const { user, continueStudying, courses, studyStats, courseCoverage, tasks } = data;
  const firstName = user.name ? user.name.split(" ")[0] : "Student";

  // Check state categories
  const hasCourses = courses && courses.length > 0;
  const hasContinueStudying = Boolean(continueStudying);
  const primaryCourse = continueStudying?.course || (hasCourses ? courses[0] : null);

  // Real course coverage from backend
  const coveragePercent = courseCoverage?.coveragePercentage ?? 0;
  const studiedResourcesCount = courseCoverage?.studiedResources ?? 0;
  const totalCourseResources =
    courseCoverage?.totalResources ?? (hasCourses ? (courses[0] as { resourcesCount?: number })?.resourcesCount ?? 0 : 0);
  const completedActivities = courseCoverage?.completedActivities ?? studyStats.completedActivitiesCount ?? 0;
  const totalActivities = courseCoverage?.totalActivities ?? 0;

  // Real upcoming/active course
  const upcomingCourse = hasCourses ? courses[0] : null;

  // Real study hours/minutes formatting helper
  const formatTime = (minutes: number) => {
    if (!minutes || minutes <= 0) return "0 hrs";
    if (minutes < 60) return `${minutes} mins`;
    return `${(minutes / 60).toFixed(1)} hrs`;
  };

  const totalSpentFormatted = formatTime(studyStats.totalStudyTimeMinutes);
  const totalFocusedFormatted = formatTime(studyStats.totalFocusedMinutes);
  const yesterdayFormatted = formatTime(studyStats.yesterdayStudyMinutes);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* ── 1. Top Header ── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {greeting}, {firstName}.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {hasContinueStudying
              ? "You have a focused plan ready for today. Continue where you left off, then move into your scheduled review and practice."
              : hasCourses
                ? "Your courses are ready. Start an active focus session or explore study resources to make progress."
                : "Welcome to Synapse! Set up your first course to organize notes, syllabus topics, and start focused study sessions."}
          </p>
        </div>

        {/* Create + Dropdown Pill */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium px-4 py-2 text-sm inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer outline-none select-none"
            >
              <span>Create</span>
              <PlusIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setCreateCourseOpen(true)}
                className="cursor-pointer gap-2"
              >
                <FolderIcon className="size-4 text-primary" />
                <span>New Course</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setUploadResourceOpen(true)}
                className="cursor-pointer gap-2"
              >
                <UploadIcon className="size-4 text-primary" />
                <span>Upload Resource</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* ── 2. Primary Workspace Grid ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Continue Studying + Today's Plan */}
        <div className="lg:col-span-8 space-y-6">
          {/* Continue Studying Hero Card */}
          {hasContinueStudying && continueStudying ? (
            <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Continue studying
                  </span>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    {continueStudying.course.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {continueStudying.activity.title || continueStudying.resource?.title || "Active session"}
                  </p>
                </div>

                <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground shrink-0">
                  {coveragePercent}% course coverage
                </span>
              </div>

              {/* Progress Bar & Real Metrics */}
              <div className="space-y-2 pt-1">
                <div className="h-2 w-full rounded-full bg-primary/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.max(coveragePercent > 0 ? 8 : 0, coveragePercent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-1">
                  <span>
                    {totalCourseResources > 0
                      ? `${studiedResourcesCount} of ${totalCourseResources} resources studied`
                      : `${studiedResourcesCount} resources studied`}
                  </span>
                  <span>
                    {totalActivities > 0
                      ? `${completedActivities} of ${totalActivities} topics reviewed`
                      : `${completedActivities} topics reviewed`}
                  </span>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex justify-end pt-1">
                <Link
                  href={`/study/${continueStudying.activity.id}`}
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 text-sm inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </div>
          ) : hasCourses && primaryCourse ? (
            /* Student has courses, but no active study session yet */
            <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Start studying
                  </span>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    {primaryCourse.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Ready to begin. Pick an activity or start a focused Pomodoro session.
                  </p>
                </div>

                <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground shrink-0">
                  {totalCourseResources} resources ready
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="h-2 w-full rounded-full bg-primary/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.max(coveragePercent > 0 ? 8 : 0, coveragePercent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-1">
                  <span>{studiedResourcesCount} of {totalCourseResources} resources studied</span>
                  <span>{completedActivities} topics reviewed</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  href={`/courses/${primaryCourse.id}?tab=study`}
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 text-sm inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Start Session</span>
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Zero courses empty state */
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-6 sm:p-8 backdrop-blur-xs shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <SparklesIcon className="size-3.5" />
                    <span>Get Started</span>
                  </span>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    Set up your study workspace
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Create your first course to organize lecture slides, syllabus topics, and start focused study timers.
                  </p>
                </div>

                <Button
                  onClick={() => setCreateCourseOpen(true)}
                  className="rounded-full gap-2 self-start sm:self-center shadow-xs"
                >
                  <PlusIcon className="size-4" />
                  <span>Create First Course</span>
                </Button>
              </div>
            </div>
          )}

          {/* Today's Plan: Next Three Tasks */}
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Today&apos;s plan
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  Stay on track with your next three tasks
                </h3>
              </div>

              <Link
                href="/study"
                className="rounded-full border border-border/70 bg-background/60 hover:bg-muted text-xs font-medium px-3.5 py-1.5 inline-flex items-center gap-1.5 text-foreground transition-colors shrink-0 shadow-2xs"
              >
                <TimerIcon className="size-3.5 text-primary" />
                <span>Start timer</span>
              </Link>
            </div>

            {/* Task Items List */}
            <div className="space-y-3 pt-1">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={task.href}
                    className="group flex items-center justify-between gap-4 p-3.5 rounded-2xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {task.number}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {task.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      {task.durationMinutes} min
                    </span>
                  </Link>
                ))
              ) : (
                /* Starter Onboarding Tasks for New Students */
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setCreateCourseOpen(true)}
                    className="w-full group flex items-center justify-between gap-4 p-3.5 rounded-2xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        1
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          Create your first course
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Add your semester subjects and organize lecture materials.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary shrink-0">
                      Action
                    </span>
                  </button>

                  <Link
                    href="/library"
                    className="group flex items-center justify-between gap-4 p-3.5 rounded-2xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        2
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          Browse Resource Library
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Discover study packs, past exam papers, and shared notes.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      5 min
                    </span>
                  </Link>

                  <Link
                    href="/study"
                    className="group flex items-center justify-between gap-4 p-3.5 rounded-2xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        3
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          Try a 25-minute Focus Session
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Run a distraction-free Pomodoro session to establish your study streak.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      25 min
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming / Active Courses + Explore */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming / Active Course Card */}
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Upcoming
              </span>
              <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {formattedDate}
              </span>
            </div>

            {upcomingCourse ? (
              <Link
                href={`/courses/${upcomingCourse.id}`}
                className="group flex items-start gap-3.5 pt-1"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ClockIcon className="size-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {upcomingCourse.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Keep your study plan steady before the exam date.
                  </p>
                </div>
              </Link>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                    <FolderIcon className="size-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">
                      No active courses
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Add your subjects to view semester schedules and targets.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setCreateCourseOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs gap-1.5 w-full border-border/80"
                >
                  <PlusIcon className="size-3.5" />
                  <span>Create Course</span>
                </Button>
              </div>
            )}
          </div>

          {/* Explore Card */}
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Explore
              </span>
              <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                New
              </span>
            </div>

            <div className="space-y-4 pt-1">
              <Link
                href="/library"
                className="group flex items-start gap-3.5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <BookOpenIcon className="size-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    New resources
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Browse recent study packs and notes.
                  </p>
                </div>
              </Link>

              <Link
                href="/discussions"
                className="group flex items-start gap-3.5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <MessageSquareIcon className="size-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    Discussions
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Join active conversations and ask questions.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Your Study Metrics & Weekly Trend ── */}
      <section className="space-y-4 pt-2">
        <h2 className="font-heading text-base font-bold text-foreground">
          Your Study
        </h2>

        {/* 3 Summary Stat Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Total spent
            </span>
            <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
              {totalSpentFormatted}
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Total Focused
            </span>
            <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
              {totalFocusedFormatted}
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Yesterday
            </span>
            <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
              {yesterdayFormatted}
            </p>
          </div>
        </div>

        {/* Full-width Weekly Study Trend Card */}
        <StudyTrendChart stats={studyStats} />
      </section>

      {/* ── Controlled Dialogs ── */}
      {createCourseOpen && (
        <CourseDialog
          open={createCourseOpen}
          onOpenChange={setCreateCourseOpen}
          mode="create"
          onSuccess={() => {
            setCreateCourseOpen(false);
            void queryClient.invalidateQueries({ queryKey: homeKeys.all });
          }}
        />
      )}

      {uploadResourceOpen && (
        <UploadDialog
          open={uploadResourceOpen}
          onOpenChange={setUploadResourceOpen}
          onSuccess={() => {
            setUploadResourceOpen(false);
            void queryClient.invalidateQueries({ queryKey: homeKeys.all });
          }}
        />
      )}
    </div>
  );
}
