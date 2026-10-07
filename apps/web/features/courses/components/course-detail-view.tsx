"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeftIcon,
  LayersIcon,
  FolderIcon,
  LightbulbIcon,
  MessageSquareIcon,
  PencilIcon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useCourse, useCourseResources } from "../queries";
import { CourseOverviewTab } from "./course-overview-tab";
import { CourseResourcesTab } from "./course-resources-tab";
import { CourseStudyTab } from "./course-study-tab";
import { CourseDiscussionsTab } from "./course-discussions-tab";
import { CourseDialog } from "./course-dialog";
import { cn } from "@/lib/utils";

interface CourseDetailViewProps {
  courseId: string;
}

type TabType = "overview" | "resources" | "study" | "discussions";

export function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const {
    data: course,
    isLoading: isLoadingCourse,
    isError: isCourseError,
    error: courseError,
    refetch: refetchCourse,
  } = useCourse(courseId);

  const { data: resourcesData, refetch: refetchResources } =
    useCourseResources(courseId);

  const resources = resourcesData?.data ?? [];

  const handleBack = () => {
    router.push("/courses");
  };

  const tabs: Array<{
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }> = [
    { id: "overview", label: "Overview", icon: LayersIcon },
    {
      id: "resources",
      label: "Resources",
      icon: FolderIcon,
      badge: resources.length > 0 ? resources.length : undefined,
    },
    { id: "study", label: "Study", icon: LightbulbIcon },
    { id: "discussions", label: "Discussions", icon: MessageSquareIcon },
  ];

  if (isLoadingCourse) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
        <Skeleton className="h-56 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-16 text-center">
        <AlertCircleIcon className="text-destructive mx-auto size-12" />
        <h2 className="font-heading text-foreground text-xl font-semibold">
          Course not found
        </h2>
        <p className="text-muted-foreground text-sm">
          {courseError instanceof Error
            ? courseError.message
            : "The requested course workspace could not be loaded."}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleBack}
            className="rounded-full"
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Back to Courses
          </Button>
          <Button onClick={() => refetchCourse()} className="rounded-full">
            <RefreshCwIcon className="mr-2 size-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Top Bar: Back Button, Title & Edit CTA ── */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={handleBack}
            className="border-border/80 bg-background text-foreground hover:bg-muted focus-visible:ring-primary flex size-10 items-center justify-center rounded-full border shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
            aria-label="Back to courses"
          >
            <ArrowLeftIcon className="size-4" />
          </button>

          <div className="flex items-center gap-3">
            <span
              className="size-3.5 shrink-0 rounded-full shadow-xs"
              style={{ backgroundColor: course.cover?.color || "#3072FF" }}
            />
            <h1 className="font-heading text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
              {course.title}
            </h1>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditDialogOpen(true)}
          className="self-start rounded-full px-4 text-xs font-semibold sm:self-auto"
        >
          <PencilIcon className="mr-1.5 size-3.5" />
          Edit Course
        </Button>
      </div>

      {/* ── Pill Navigation Tabs Bar ── */}
      <nav
        aria-label="Course Workspace Tabs"
        className="border-border/60 bg-muted/40 flex max-w-fit items-center gap-1.5 overflow-x-auto rounded-full border p-1.5 shadow-xs backdrop-blur-xs"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all focus-visible:outline-hidden",
                isActive
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40",
              )}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "py-0.2 ml-0.5 rounded-full px-1.5 font-mono text-[10px]",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Active Tab Content ── */}
      <main>
        {activeTab === "overview" && (
          <CourseOverviewTab
            course={course}
            resources={resources}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === "resources" && (
          <CourseResourcesTab
            course={course}
            resources={resources}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === "study" && (
          <CourseStudyTab
            course={course}
            resources={resources}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === "discussions" && (
          <CourseDiscussionsTab course={course} />
        )}
      </main>

      {/* Edit Course Dialog */}
      <CourseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        course={course}
        onSuccess={() => {
          void refetchCourse();
          void refetchResources();
        }}
      />
    </div>
  );
}
