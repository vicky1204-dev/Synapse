"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContributions } from "../queries";
import { contributionKeys } from "../keys";
import { ContributionSummaryCards } from "./contribution-summary-cards";
import { ResourceCard } from "@/features/resources";
import { DiscussionCard } from "@/features/discussions";
import { UploadDialog } from "@/features/resources";
import { CreateDiscussionDialog } from "@/features/discussions";
import { useToggleSave } from "@/features/saved";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UploadCloudIcon,
  MessageSquareIcon,
  SearchIcon,
  LayoutGridIcon,
  LayoutListIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  FolderOpenIcon,
  PlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveTab = "resources" | "discussions";

export function ContributionsView() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useUserContributions();
  const toggleSave = useToggleSave();

  const [activeTab, setActiveTab] = useState<ActiveTab>("resources");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Controlled dialog states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);

  const handleInvalidate = () => {
    void queryClient.invalidateQueries({ queryKey: contributionKeys.all });
  };

  const handleToggleSave = (resourceId: string, currentSaved?: boolean) => {
    toggleSave.mutate(
      { resourceId, isSaved: currentSaved },
      {
        onSuccess: () => {
          handleInvalidate();
        },
      },
    );
  };

  const uploadedResources = data?.uploadedResources;
  const createdDiscussions = data?.createdDiscussions;

  // Filtered resources
  const filteredResources = useMemo(() => {
    if (!uploadedResources) return [];
    if (!searchQuery.trim()) return uploadedResources;
    const q = searchQuery.toLowerCase().trim();
    return uploadedResources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.aiMetadata?.tags?.some((t) => t.toLowerCase().includes(q)) ||
        r.aiMetadata?.topics?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [uploadedResources, searchQuery]);

  // Filtered discussions
  const filteredDiscussions = useMemo(() => {
    if (!createdDiscussions) return [];
    if (!searchQuery.trim()) return createdDiscussions;
    const q = searchQuery.toLowerCase().trim();
    return createdDiscussions.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.body.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [createdDiscussions, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-52 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-card border-border/80 flex flex-col items-center justify-center gap-4 rounded-3xl border p-12 text-center shadow-xs">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircleIcon className="size-6" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h2 className="text-base font-semibold font-heading text-foreground">
            Unable to load contributions
          </h2>
          <p className="text-xs text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while fetching your contributions."}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => void refetch()}
          className="rounded-full gap-2"
        >
          <RefreshCwIcon className="size-3.5" />
          Try Again
        </Button>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight sm:text-3xl">
            My Contributions
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your shared study resources, community discussions, and academic reach across Synapse.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsUploadOpen(true)}
            size="sm"
            className="rounded-xl gap-2 font-medium shadow-xs"
          >
            <UploadCloudIcon className="size-4" />
            Upload Resource
          </Button>

          <Button
            onClick={() => setIsDiscussionOpen(true)}
            size="sm"
            variant="outline"
            className="rounded-xl gap-2 font-medium"
          >
            <PlusIcon className="size-4" />
            New Discussion
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <ContributionSummaryCards summary={summary} />

      {/* Navigation Tabs and Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
        {/* Tab switchers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("resources")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
              activeTab === "resources"
                ? "bg-secondary text-secondary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <UploadCloudIcon className="size-4" />
            <span>Uploaded Resources</span>
            <Badge
              variant={activeTab === "resources" ? "default" : "secondary"}
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            >
              {summary.uploadedResourcesCount}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("discussions")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
              activeTab === "discussions"
                ? "bg-secondary text-secondary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <MessageSquareIcon className="size-4" />
            <span>Discussions</span>
            <Badge
              variant={activeTab === "discussions" ? "default" : "secondary"}
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            >
              {summary.createdDiscussionsCount}
            </Badge>
          </button>
        </div>

        {/* Search & View controls */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "resources"
                  ? "Search uploads..."
                  : "Search discussions..."
              }
              className="h-9 pl-9 pr-3 rounded-xl text-xs bg-muted/30 focus-visible:bg-background"
            />
          </div>

          {activeTab === "resources" && (
            <div className="flex items-center rounded-xl border border-border/80 bg-muted/20 p-0.5">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className="size-7 rounded-lg"
              >
                <LayoutGridIcon className="size-3.5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className="size-7 rounded-lg"
              >
                <LayoutListIcon className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content: Uploaded Resources */}
      {activeTab === "resources" && (
        <div>
          {filteredResources.length > 0 ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-3",
              )}
            >
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  viewMode={viewMode}
                  onToggleSave={handleToggleSave}
                  onDelete={() => handleInvalidate()}
                />
              ))}
            </div>
          ) : summary.uploadedResourcesCount === 0 ? (
            /* Empty state: No uploads yet */
            <div className="bg-card border-border/70 flex flex-col items-center justify-center gap-3.5 rounded-3xl border border-dashed p-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UploadCloudIcon className="size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-base font-semibold font-heading text-foreground">
                  No resources uploaded yet
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Share study notes, lecture slide decks, syllabus outlines, or flashcards with your peers to contribute to the university knowledge base.
                </p>
              </div>
              <Button
                onClick={() => setIsUploadOpen(true)}
                size="sm"
                className="rounded-full gap-2 mt-2 font-medium"
              >
                <UploadCloudIcon className="size-3.5" />
                Upload Your First Resource
              </Button>
            </div>
          ) : (
            /* Search yielded no matches */
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <FolderOpenIcon className="size-8 text-muted-foreground/60" />
              <p className="text-sm font-medium text-foreground">
                No matching uploads found
              </p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search query or clear the filter.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-1 text-xs"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Created Discussions */}
      {activeTab === "discussions" && (
        <div>
          {filteredDiscussions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredDiscussions.map((discussion) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                />
              ))}
            </div>
          ) : summary.createdDiscussionsCount === 0 ? (
            /* Empty state: No discussions created */
            <div className="bg-card border-border/70 flex flex-col items-center justify-center gap-3.5 rounded-3xl border border-dashed p-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquareIcon className="size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-base font-semibold font-heading text-foreground">
                  No discussions started yet
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ask questions about difficult topics, propose study group ideas, or share insights on coursework with other students.
                </p>
              </div>
              <Button
                onClick={() => setIsDiscussionOpen(true)}
                size="sm"
                className="rounded-full gap-2 mt-2 font-medium"
              >
                <PlusIcon className="size-3.5" />
                Start a Discussion
              </Button>
            </div>
          ) : (
            /* Search yielded no matches */
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <FolderOpenIcon className="size-8 text-muted-foreground/60" />
              <p className="text-sm font-medium text-foreground">
                No matching discussions found
              </p>
              <p className="text-xs text-muted-foreground">
                Try searching for a different keyword or topic tag.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-1 text-xs"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <UploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onSuccess={() => {
          setIsUploadOpen(false);
          handleInvalidate();
        }}
      />

      <CreateDiscussionDialog
        open={isDiscussionOpen}
        onOpenChange={setIsDiscussionOpen}
        onSuccess={() => {
          setIsDiscussionOpen(false);
          handleInvalidate();
        }}
      />
    </div>
  );
}
