"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  TimerIcon,
  ClockIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { useFocusTimer } from "../hooks/use-focus-timer";

interface FocusTimerProps {
  timer: ReturnType<typeof useFocusTimer>;
  variant?: "compact" | "card";
  className?: string;
}

export function FocusTimer({
  timer,
  variant = "compact",
  className,
}: FocusTimerProps) {
  const {
    isRunning,
    mode,
    durationMinutes,
    minutesDisplay,
    secondsDisplay,
    progressPercent,
    toggle,
    reset,
    setPresetMinutes,
    switchMode,
  } = timer;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 shadow-2xs backdrop-blur-xs",
          isRunning && "border-primary/50 shadow-xs ring-2 ring-primary/10",
          className,
        )}
      >
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold tabular-nums text-foreground">
          <TimerIcon
            className={cn(
              "size-3.5",
              isRunning
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
          <span>
            {minutesDisplay}:{secondsDisplay}
          </span>
        </div>

        <button
          type="button"
          onClick={toggle}
          className={cn(
            "flex size-6 items-center justify-center rounded-full transition-colors cursor-pointer",
            isRunning
              ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? (
            <PauseIcon className="size-3 fill-current" />
          ) : (
            <PlayIcon className="size-3 fill-current ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => reset()}
          className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Reset timer"
        >
          <RotateCcwIcon className="size-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xs space-y-4",
        isRunning && "border-primary/40",
        className,
      )}
    >
      {/* Mode and Preset Selector */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
          <TimerIcon className="size-4 text-primary" />
          <span>Focus Timer</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPresetMinutes(25)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer",
              mode === "pomodoro" && durationMinutes === 25
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            25m
          </button>
          <button
            type="button"
            onClick={() => setPresetMinutes(50)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer",
              mode === "pomodoro" && durationMinutes === 50
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            50m
          </button>
          <button
            type="button"
            onClick={() => switchMode("stopwatch")}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer",
              mode === "stopwatch"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <ClockIcon className="size-3 inline mr-1" />
            Stopwatch
          </button>
        </div>
      </div>

      {/* Main Digital Clock Display */}
      <div className="text-center py-2 space-y-2">
        <div className="font-mono text-4xl font-extrabold tracking-tight tabular-nums text-foreground sm:text-5xl">
          {minutesDisplay}:{secondsDisplay}
        </div>

        {mode === "pomodoro" && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/15 dark:bg-primary/25">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Primary Action Controls */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <Button
          size="sm"
          onClick={toggle}
          className={cn(
            "rounded-full px-5 text-xs font-semibold shadow-xs transition-transform active:scale-95",
            isRunning
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground",
          )}
        >
          {isRunning ? (
            <>
              <PauseIcon className="mr-1.5 size-3.5 fill-current" />
              Pause Session
            </>
          ) : (
            <>
              <PlayIcon className="mr-1.5 size-3.5 fill-current" />
              Start Focus
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => reset()}
          className="rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Reset timer"
        >
          <RotateCcwIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
