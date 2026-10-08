"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FocusTimer } from "./focus-timer";
import { useFocusTimer } from "../hooks/use-focus-timer";
import { useStudyActivity } from "../queries";
import {
  useStartActivity,
  useHeartbeatActivity,
  useCompleteActivity,
} from "../mutations";
import { ResourceViewer } from "@/features/resources/components/resource-viewer";
import {
  ChevronLeftIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  BookOpenIcon,
  FileTextIcon,
  SaveIcon,
  RotateCcwIcon,
  ClockIcon,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface StudyWorkspaceViewProps {
  activityId: string;
}

export function StudyWorkspaceView({ activityId }: StudyWorkspaceViewProps) {
  const router = useRouter();

  const {
    data: activity,
    isLoading,
    isError,
    error,
  } = useStudyActivity(activityId);

  const startMutation = useStartActivity(activityId, activity?.courseId);
  const heartbeatMutation = useHeartbeatActivity(activityId, activity?.courseId);
  const completeMutation = useCompleteActivity(activityId, activity?.courseId);

  const [userNotes, setUserNotes] = React.useState<string | null>(null);
  const notes = userNotes !== null ? userNotes : (activity?.progress?.notes ?? "");
  const hasNotesChanged = userNotes !== null && userNotes !== (activity?.progress?.notes ?? "");

  // Start activity automatically on mount if not started
  const hasStartedRef = React.useRef(false);
  const startMutate = startMutation.mutate;
  React.useEffect(() => {
    if (activity && (!activity.progress || activity.progress.status === "not-started") && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startMutate();
    }
  }, [activity, startMutate]);

  // Setup focus timer with auto-heartbeat synchronization
  const timer = useFocusTimer({
    initialMinutes: 25,
    onMinuteTick: (secondsAdded) => {
      heartbeatMutation.mutate({
        durationIncrementSeconds: secondsAdded,
        notes: hasNotesChanged ? notes : undefined,
      });
    },
    onComplete: () => {
      toast.add({
        title: "Focus session completed!",
        description: "Great focus! Take a short break or continue studying.",
        type: "success",
      });
    },
  });

  const handleSaveNotes = async () => {
    await heartbeatMutation.mutateAsync({ notes });
    setUserNotes(null);
    toast.add({
      title: "Notes saved",
      description: "Your study notes have been saved.",
      type: "success",
    });
  };

  const handleCompleteActivity = async () => {
    await completeMutation.mutateAsync({
      durationIncrementSeconds: timer.secondsElapsed,
      notes,
    });
  };

  const isCompleted = activity?.progress?.status === "completed";
  const totalTrackedSeconds =
    (activity?.progress?.durationSeconds || 0) + timer.secondsElapsed;
  const totalTrackedMinutes = Math.max(1, Math.round(totalTrackedSeconds / 60));

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading study workspace...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !activity) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Study activity not found
        </h2>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Could not load the requested study activity."}
        </p>
        <Button
          size="sm"
          onClick={() => router.back()}
          className="rounded-full text-xs"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-5rem)] flex-1 flex-col -mx-6 -my-4">
      {/* ── Top Workspace Bar ── */}
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (activity.courseId) {
                router.push(`/courses/${activity.courseId}`);
              } else {
                router.back();
              }
            }}
            className="size-8 rounded-full p-0 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            aria-label="Back to course"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <div className="flex items-center gap-2 text-xs min-w-0">
            <Link
              href={activity.courseId ? `/courses/${activity.courseId}` : "/study"}
              className="font-medium text-muted-foreground hover:text-foreground truncate max-w-[140px] sm:max-w-[200px]"
            >
              {activity.course?.title || "Course"}
            </Link>
            <span className="text-border/70">/</span>
            <Badge
              variant="outline"
              className="rounded-full text-[10px] uppercase font-semibold tracking-wider shrink-0"
            >
              {activity.type.replace("-", " ")}
            </Badge>
            <span className="text-border/70 hidden sm:inline">/</span>
            <span className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-md hidden sm:inline">
              {activity.title}
            </span>
          </div>
        </div>

        {/* Center / Right: Compact Focus Timer & Completion State */}
        <div className="flex items-center gap-2.5 shrink-0">
          <FocusTimer timer={timer} variant="compact" />

          {isCompleted ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full px-3 py-1 text-xs gap-1">
              <CheckCircle2Icon className="size-3.5" />
              <span>Completed</span>
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={handleCompleteActivity}
              disabled={completeMutation.isPending}
              className="rounded-full text-xs font-semibold px-4 shadow-xs"
            >
              {completeMutation.isPending ? (
                <Spinner className="mr-1.5 size-3.5" />
              ) : (
                <CheckCircle2Icon className="mr-1.5 size-3.5" />
              )}
              Mark Completed
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Layout: Content Viewer (left) + Study Sidebar (right) ── */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* Left Column: Full-Height Resource Viewer or Concept Study Material */}
        <div className="relative flex-1 min-h-[60vh] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/20 flex flex-col">
          {activity.resource ? (
            <div className="relative h-full w-full flex-1 min-h-0">
              <ResourceViewer
                type={
                  activity.resource.type as
                    | "pdf"
                    | "word"
                    | "ppt"
                    | "note"
                    | "link"
                }
                url={activity.resource.url}
                title={activity.resource.title}
              />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-8 sm:p-10 space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <BookOpenIcon className="size-4" />
                <span>Concept Review</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                {activity.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {activity.description ||
                  "Review course concepts, key terms, definitions, and study notes."}
              </p>
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-2 text-xs text-muted-foreground max-w-xl">
                <h3 className="font-semibold text-foreground">Study Objective</h3>
                <p>
                  Read through the material carefully, take notes in the scratchpad
                  on the right, and mark the activity completed once finished.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Scrollable Study Tools Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="space-y-5 p-5">
              {/* Expanded Focus Timer Card */}
              <FocusTimer timer={timer} variant="card" />

              {/* Session Progress Card */}
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-xs backdrop-blur-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Study Activity Progress
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="size-3.5 text-primary" />
                    <span>Focus time logged</span>
                  </div>
                  <span className="font-semibold text-foreground font-mono">
                    {totalTrackedMinutes} min
                  </span>
                </div>

                {isCompleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startMutation.mutate()}
                    className="w-full rounded-full text-xs text-muted-foreground hover:text-foreground mt-1"
                  >
                    <RotateCcwIcon className="mr-1.5 size-3" />
                    Reopen Activity
                  </Button>
                )}
              </div>

              {/* Study Notes Scratchpad */}
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-xs backdrop-blur-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <FileTextIcon className="size-3.5 text-primary" />
                    <span>Study Notes</span>
                  </div>

                  {hasNotesChanged && (
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <SaveIcon className="size-3" />
                      Save
                    </button>
                  )}
                </div>

                <Textarea
                  placeholder="Write summary notes, key questions, or definitions while studying..."
                  value={notes}
                  onChange={(e) => {
                    setUserNotes(e.target.value);
                  }}
                  onBlur={() => {
                    if (hasNotesChanged) {
                      void handleSaveNotes();
                    }
                  }}
                  className="min-h-[140px] rounded-xl text-xs leading-relaxed"
                />

                <p className="text-[10px] text-muted-foreground">
                  Notes automatically persist to your study session.
                </p>
              </div>

              {/* Course Workspace Link */}
              {activity.courseId && (
                <div className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-xs backdrop-blur-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCapIcon className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground truncate">
                      {activity.course?.title || "Course Workspace"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Return to course overview, resources, and discussions.
                  </p>
                  <Link
                    href={`/courses/${activity.courseId}`}
                    className="inline-flex w-full items-center justify-center rounded-full border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/60 transition mt-1"
                  >
                    View Course Workspace
                  </Link>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
