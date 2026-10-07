"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiscussionCard } from "./discussion-card";
import { CreateDiscussionDialog } from "./create-discussion-dialog";
import { useDiscussions } from "../queries";
import type { DiscussionFilters } from "../types";
import { cn } from "@/lib/utils";
import {
  SearchIcon,
  SlidersHorizontalIcon,
  PlusIcon,
  KeyboardIcon,
  XIcon,
} from "lucide-react";

const POPULAR_TOPICS = [
  "Operating Systems",
  "Data Structures",
  "Algorithms",
  "Computer Networks",
  "Database Systems",
  "Computer Architecture",
  "Machine Learning",
  "Memory Management",
  "Theory",
];

export function DiscussionsFeedView() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const [activeSearch, setActiveSearch] = React.useState("");
  const [selectedTopic, setSelectedTopic] = React.useState<string | undefined>();
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const filters: DiscussionFilters = React.useMemo(() => {
    return {
      search: activeSearch.trim() || undefined,
      tag: selectedTopic,
      page,
      limit: 20,
    };
  }, [activeSearch, selectedTopic, page]);

  const { data, isLoading } = useDiscussions(filters);

  const discussions = data?.data ?? [];
  const pagination = data?.pagination;

  // Merge popular topics with any existing tags from loaded discussions
  const allTopics = React.useMemo(() => {
    const topicSet = new Set(POPULAR_TOPICS);
    for (const d of discussions) {
      for (const tag of d.tags) {
        if (tag) topicSet.add(tag);
      }
    }
    return Array.from(topicSet);
  }, [discussions]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setActiveSearch("");
    setSelectedTopic(undefined);
    setPage(1);
  };

  const hasActiveFilters = Boolean(activeSearch.trim() || selectedTopic);

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto py-2">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Discussions
        </h1>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 cursor-pointer"
        >
          <span>New</span>
          <PlusIcon className="size-3.5" />
        </button>
      </div>

      {/* Search & Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card p-2 shadow-xs transition focus-within:border-primary/50"
      >
        <div className="flex items-center gap-2 pl-2 text-muted-foreground">
          <KeyboardIcon className="size-4 shrink-0" />
        </div>
        <Input
          placeholder="Search by title, topic, or question..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 text-sm bg-transparent px-1 placeholder:text-muted-foreground/70"
        />
        <div className="flex items-center gap-2 pr-1 shrink-0">
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="rounded-xl text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <SearchIcon className="size-3.5" />
            <span>Search</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant={showFilterPanel ? "secondary" : "ghost"}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="rounded-xl text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <SlidersHorizontalIcon className="size-3.5" />
            <span>Filter</span>
          </Button>
        </div>
      </form>

      {/* Collapsible Filter Panel — Filter by Topics */}
      {showFilterPanel && (
        <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Topics & Tags
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <XIcon className="size-3" />
                Clear filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedTopic(undefined);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                !selectedTopic
                  ? "bg-neutral-900 text-white shadow-2xs dark:bg-foreground dark:text-background"
                  : "border border-border/70 bg-background text-foreground hover:bg-muted/50",
              )}
            >
              All Topics
            </button>
            {allTopics.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(isSelected ? undefined : topic);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    isSelected
                      ? "bg-neutral-900 text-white shadow-2xs dark:bg-foreground dark:text-background"
                      : "border border-border/70 bg-background text-foreground hover:bg-muted/50",
                  )}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {activeSearch && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium gap-1.5"
            >
              <span>Search: &ldquo;{activeSearch}&rdquo;</span>
              <button
                type="button"
                onClick={() => {
                  setActiveSearch("");
                  setSearchInput("");
                  setPage(1);
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear search"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          {selectedTopic && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium gap-1.5"
            >
              <span>Topic: {selectedTopic}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic(undefined);
                  setPage(1);
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear topic filter"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Discussions Feed List */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-border/60 bg-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : discussions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              No discussions found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {hasActiveFilters
                ? "No threads match your active filters. Try searching with different terms or clear filters."
                : "No peer discussions have been created yet. Be the first to start a conversation!"}
            </p>
            <div className="pt-2">
              <Button
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="rounded-full text-xs font-semibold"
              >
                <PlusIcon className="mr-1.5 size-3.5" />
                Start a Discussion
              </Button>
            </div>
          </div>
        ) : (
          discussions.map((d) => (
            <DiscussionCard key={d.id} discussion={d} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full text-xs"
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full text-xs"
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Discussion Modal */}
      <CreateDiscussionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
