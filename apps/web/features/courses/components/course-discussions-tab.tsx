"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, PlusIcon, UsersIcon } from "lucide-react";
import { useDiscussions, DiscussionCard, CreateDiscussionDialog } from "@/features/discussions";
import type { Course } from "../types";

interface CourseDiscussionsTabProps {
  course: Course;
}

export function CourseDiscussionsTab({ course }: CourseDiscussionsTabProps) {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const { data, isLoading } = useDiscussions({ courseId: course.id });

  const discussions = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="size-4 text-primary" />
          <h2 className="font-heading text-base font-semibold text-foreground">
            Course discussions
          </h2>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full text-xs font-semibold shadow-xs"
        >
          <PlusIcon className="mr-1.5 size-3.5" />
          New Discussion
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-border/60 bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : discussions.length > 0 ? (
        <div className="space-y-3.5">
          {discussions.map((d) => (
            <DiscussionCard key={d.id} discussion={d} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center space-y-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
            <UsersIcon className="size-6" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-foreground">
            No discussions yet in {course.title}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Start a peer discussion, ask questions about syllabus topics, or share study tips
            with classmates in this workspace.
          </p>
          <div className="pt-2">
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="rounded-full text-xs font-semibold"
            >
              <PlusIcon className="mr-1.5 size-3.5" />
              Start First Discussion
            </Button>
          </div>
        </div>
      )}

      {/* Discussion Dialog with pre-bound course ID */}
      <CreateDiscussionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialCourseId={course.id}
      />
    </div>
  );
}
