"use client";

import * as React from "react";
import Link from "next/link";
import { TimerIcon } from "lucide-react";
import type { HomeStudyStats } from "../types";
import { cn } from "@/lib/utils";

interface StudyTrendChartProps {
  stats: HomeStudyStats;
  className?: string;
}

export function StudyTrendChart({ stats, className }: StudyTrendChartProps) {
  const { weeklyTrend = [] } = stats || {};

  // Find max minutes to normalize pillar heights
  const maxMinutes = React.useMemo(() => {
    const max = Math.max(...weeklyTrend.map((d) => d.minutes || 0));
    return max > 0 ? max : 60;
  }, [weeklyTrend]);

  const todayIndex = weeklyTrend.length - 1;

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-xs shadow-xs space-y-6",
        className,
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
          Weekly study trend
        </h3>
        <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-0.5 text-xs font-medium text-muted-foreground">
          Week
        </span>
      </div>

      {/* 7 Daily Vertical Pillar Bars */}
      <div className="flex items-end justify-between gap-2.5 sm:gap-4 h-44 sm:h-48 pt-2">
        {weeklyTrend.map((item, idx) => {
          const isToday = idx === todayIndex;
          const minutes = item.minutes || 0;
          // Scale fill: if > 0, scale proportionally with a min floor of 15% so it's visible
          const fillPercent =
            minutes > 0 ? Math.min(100, Math.max(16, Math.round((minutes / maxMinutes) * 100))) : 0;

          return (
            <div
              key={item.date}
              className="group flex-1 flex flex-col items-center gap-2.5 h-full justify-end"
            >
              <div className="relative w-full max-w-[56px] sm:max-w-[68px] h-36 sm:h-40 rounded-2xl bg-primary/20 dark:bg-primary/25 overflow-hidden flex flex-col justify-end p-0.5">
                {/* Filled portion */}
                <div
                  className={cn(
                    "w-full rounded-2xl transition-all duration-500",
                    minutes > 0 ? "bg-primary" : "bg-transparent",
                  )}
                  style={{ height: `${fillPercent}%` }}
                />

                {/* Floating tooltip on hover */}
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap rounded-lg border border-border bg-popover px-2 py-1 text-[11px] font-medium text-foreground shadow-md">
                  {minutes} mins
                </div>
              </div>

              {/* Day Label */}
              <span
                className={cn(
                  "text-xs transition-colors",
                  isToday
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground group-hover:text-foreground",
                )}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/40">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          {(stats?.totalStudyTimeMinutes || 0) > 0
            ? "Let's try more today."
            : "No study sessions logged this week. Start a focus timer to build your streak."}
        </p>
        <Link
          href="/study"
          className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium px-4 py-2 text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-xs transition-colors w-fit"
        >
          <span>Start Focus Timer</span>
          <TimerIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
