"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type TimerMode = "pomodoro" | "stopwatch";

interface UseFocusTimerOptions {
  initialMinutes?: number;
  onMinuteTick?: (secondsAdded: number) => void;
  onComplete?: () => void;
}

export function useFocusTimer({
  initialMinutes = 25,
  onMinuteTick,
  onComplete,
}: UseFocusTimerOptions = {}) {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [durationMinutes, setDurationMinutes] = useState(initialMinutes);
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const unrecordedSecondsRef = useRef(0);
  const onMinuteTickRef = useRef(onMinuteTick);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onMinuteTickRef.current = onMinuteTick;
    onCompleteRef.current = onComplete;
  });

  // Flush unsynced seconds to backend callback
  const flushUnrecordedSeconds = useCallback(() => {
    if (unrecordedSecondsRef.current > 0) {
      onMinuteTickRef.current?.(unrecordedSecondsRef.current);
      unrecordedSecondsRef.current = 0;
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
        unrecordedSecondsRef.current += 1;

        // Auto-flush every 60 seconds
        if (unrecordedSecondsRef.current >= 60) {
          flushUnrecordedSeconds();
        }

        if (mode === "pomodoro") {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              flushUnrecordedSeconds();
              onCompleteRef.current?.();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, flushUnrecordedSeconds]);

  // Flush on pause, unmount, tab switch, or window unload
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushUnrecordedSeconds();
      }
    };

    const handleBeforeUnload = () => {
      flushUnrecordedSeconds();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      flushUnrecordedSeconds();
    };
  }, [flushUnrecordedSeconds]);

  const start = useCallback(() => setIsRunning(true), []);

  const pause = useCallback(() => {
    setIsRunning(false);
    flushUnrecordedSeconds();
  }, [flushUnrecordedSeconds]);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, pause, start]);

  const reset = useCallback(
    (newMinutes?: number) => {
      setIsRunning(false);
      flushUnrecordedSeconds();
      const mins = newMinutes ?? durationMinutes;
      setDurationMinutes(mins);
      setSecondsRemaining(mins * 60);
      setSecondsElapsed(0);
    },
    [durationMinutes, flushUnrecordedSeconds],
  );

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setIsRunning(false);
      flushUnrecordedSeconds();
      setMode(newMode);
      if (newMode === "pomodoro") {
        setSecondsRemaining(durationMinutes * 60);
      }
    },
    [durationMinutes, flushUnrecordedSeconds],
  );

  const setPresetMinutes = useCallback(
    (mins: number) => {
      setIsRunning(false);
      flushUnrecordedSeconds();
      setDurationMinutes(mins);
      setSecondsRemaining(mins * 60);
      setMode("pomodoro");
    },
    [flushUnrecordedSeconds],
  );

  // Formatted display values
  const currentSeconds = mode === "pomodoro" ? secondsRemaining : secondsElapsed;
  const minutesDisplay = Math.floor(currentSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secondsDisplay = (currentSeconds % 60).toString().padStart(2, "0");

  const progressPercent =
    mode === "pomodoro" && durationMinutes > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((durationMinutes * 60 - secondsRemaining) /
              (durationMinutes * 60)) *
              100,
          ),
        )
      : 100;

  return {
    isRunning,
    mode,
    durationMinutes,
    secondsRemaining,
    secondsElapsed,
    minutesDisplay,
    secondsDisplay,
    progressPercent,
    start,
    pause,
    toggle,
    reset,
    switchMode,
    setPresetMinutes,
    flushUnrecordedSeconds,
  };
}
