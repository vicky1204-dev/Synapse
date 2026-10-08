"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlayIcon,
  ClockIcon,
  GraduationCapIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useRecentStudy } from "../queries";
import { cn } from "@/lib/utils";

interface ContinueStudyingCardProps {
  courseId?: string;
  className?: string;
  compact?: boolean;
}

export function ContinueStudyingCard({
  courseId,
  className,
  compact = false,
}: ContinueStudyingCardProps) {
  const { data: recentItems = [], isLoading } = useRecentStudy(10);

  const matchedItem = React.useMemo(() => {
    if (!courseId) return recentItems[0];
    return recentItems.find((item) => item.course.id === courseId);
  }, [recentItems, courseId]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-border/60 bg-card/40 p-5 space-y-3 animate-pulse",
          className,
        )}
      >
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
    );
  }

  if (!matchedItem) {
    if (compact) return null;

    return (
      <div
        className={cn(
          "rounded-3xl border border-dashed border-border/70 bg-card/30 p-6 text-center space-y-3",
          className,
        )}
      >
        <div className="mx-auto flex size-10 items-center justify-center rounded-2xl border border-border/60 bg-background text-primary shadow-2xs">
          <SparklesIcon className="size-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-foreground">
            No active study sessions
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Start a study session to track your progress and resume anytime.
          </p>
        </div>
        <Link
          href="/study"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-2xs"
        >
          <span>Explore Study Hub</span>
          <ArrowRightIcon className="size-3" />
        </Link>
      </div>
    );
  }

  const durationMinutes = Math.max(
    1,
    Math.round(matchedItem.progress.durationSeconds / 60),
  );
  const isCompleted = matchedItem.progress.status === "completed";

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/60 p-3.5 backdrop-blur-xs shadow-2xs hover:bg-card/90 transition",
          className,
        )}
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground truncate max-w-[120px]">
              {matchedItem.course.title}
            </span>
            {isCompleted ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full px-1.5 py-0 text-[9px]">
                Completed
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-amber-500/40 text-amber-600 dark:text-amber-400 rounded-full px-1.5 py-0 text-[9px]"
              >
                In Progress
              </Badge>
            )}
          </div>
          <h4 className="text-xs font-semibold text-foreground truncate max-w-[200px]">
            {matchedItem.activity.title}
          </h4>
        </div>

        <Link
          href={`/study/${matchedItem.activity.id}`}
          className="inline-flex shrink-0 items-center justify-center size-8 rounded-full bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 transition"
          aria-label="Resume activity"
        >
          <PlayIcon className="size-3.5 fill-current" />
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card/90 via-card/70 to-primary/5 p-6 backdrop-blur-xs shadow-xs space-y-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold uppercase tracking-wider"
          >
            Continue Studying
          </Badge>
          {isCompleted ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full text-[10px]">
              Completed
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-600 dark:text-amber-400 rounded-full text-[10px]"
            >
              In Progress
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <ClockIcon className="size-3 text-muted-foreground" />
          <span>{durationMinutes}m focused</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <GraduationCapIcon className="size-3.5 text-primary" />
          <span className="truncate">{matchedItem.course.title}</span>
          {matchedItem.course.code && (
            <span className="font-mono text-[10px]">
              ({matchedItem.course.code})
            </span>
          )}
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">
          {matchedItem.activity.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {matchedItem.activity.description ||
            (matchedItem.resource
              ? `Continue studying "${matchedItem.resource.title}".`
              : "Resume your active study session.")}
        </p>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Link
          href={`/study/${matchedItem.activity.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
        >
          <PlayIcon className="size-3 fill-current" />
          <span>{isCompleted ? "Review Activity" : "Resume Session"}</span>
        </Link>
        <Link
          href={`/courses/${matchedItem.course.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <span>Course Workspace</span>
          <ArrowRightIcon className="size-3" />
        </Link>
      </div>
    </div>
  );
}
