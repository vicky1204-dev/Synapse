"use client";

import * as React from "react";
import Link from "next/link";
import { useSavedResources } from "../queries";
import { useToggleSave } from "../mutations";
import { ResourceCard } from "@/features/resources/components/resource-card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BookmarkIcon,
  SearchIcon,
  LayoutGridIcon,
  ListIcon,
  XIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  FileTextIcon,
  GlobeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResourceType } from "@/features/resources/types";

const TYPE_OPTIONS: { label: string; value: ResourceType | "all"; icon?: React.ElementType }[] = [
  { label: "All Items", value: "all" },
  { label: "PDF Documents", value: "pdf" },
  { label: "Word Docs", value: "word" },
  { label: "Notes", value: "note", icon: FileTextIcon },
  { label: "Web Links", value: "link", icon: GlobeIcon },
];

export function SavedResourcesView() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeSearch, setActiveSearch] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<ResourceType | "all">("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [page, setPage] = React.useState(1);
  const limit = 16;

  const { data, isLoading, isError, refetch } = useSavedResources({
    page,
    limit,
    search: activeSearch || undefined,
    type: selectedType !== "all" ? selectedType : undefined,
  });

  const toggleSaveMutation = useToggleSave();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setPage(1);
  };

  const handleTypeSelect = (type: ResourceType | "all") => {
    setSelectedType(type);
    setPage(1);
  };

  const resources = data?.data || [];
  const pagination = data?.pagination;
  const totalCount = pagination?.total || 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* ── 1. Header Bar ── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Saved Resources
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Quickly access lecture slides, past exam papers, and reading materials you have bookmarked.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/library"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full gap-1.5 border-border/80",
            )}
          >
            <span>Browse Library</span>
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* ── 2. Search & Controls Bar ── */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-3 py-2 shadow-xs backdrop-blur-xs focus-within:border-primary/50 transition-colors"
          >
            <SearchIcon className="size-4 text-muted-foreground shrink-0 pl-1" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your saved titles, descriptions, and tags..."
              className="border-none shadow-none focus-visible:ring-0 text-sm bg-transparent px-1 placeholder:text-muted-foreground/60 h-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              className="rounded-xl text-xs font-medium h-7 px-3"
            >
              Search
            </Button>
          </form>

          {/* View mode switcher */}
          <div className="flex items-center gap-1 border border-border/70 rounded-2xl p-1 bg-card/60 self-end md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-xl transition-colors cursor-pointer",
                viewMode === "grid"
                  ? "bg-muted text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="Grid view"
            >
              <LayoutGridIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-xl transition-colors cursor-pointer",
                viewMode === "list"
                  ? "bg-muted text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="List view"
            >
              <ListIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* Type filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TYPE_OPTIONS.map((opt) => {
            const isSelected = selectedType === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleTypeSelect(opt.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer shrink-0 border",
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-2xs font-semibold"
                    : "bg-card/60 text-muted-foreground hover:text-foreground border-border/70 hover:bg-card/90",
                )}
              >
                {Icon && <Icon className="size-3" />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. Content Area ── */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                : "flex flex-col gap-3",
            )}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <Skeleton key={n} className="h-64 w-full rounded-3xl" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center px-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/10 text-destructive mb-4 shadow-xs">
            <AlertCircleIcon className="size-7" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Failed to load saved resources
          </h2>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            There was an issue retrieving your bookmarks. Please try again.
          </p>
          <Button
            onClick={() => void refetch()}
            variant="outline"
            size="sm"
            className="mt-5 rounded-full gap-2 border-border/80"
          >
            <RefreshCwIcon className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : resources.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-10 sm:p-14 text-center space-y-4 max-w-xl mx-auto my-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-3xl border border-border/70 bg-background text-primary shadow-2xs">
            {activeSearch || selectedType !== "all" ? (
              <SearchIcon className="size-6 text-muted-foreground" />
            ) : (
              <BookmarkIcon className="size-6 text-primary fill-current" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="font-heading text-lg font-bold text-foreground">
              {activeSearch || selectedType !== "all"
                ? "No matching saved resources"
                : "No saved resources yet"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeSearch || selectedType !== "all"
                ? "Try adjusting your search query or reset the type filter to see all your bookmarked materials."
                : "Bookmark lecture notes, textbooks, and past papers from the resource library or course workspaces to access them here."}
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            {activeSearch || selectedType !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => {
                  handleClearSearch();
                  setSelectedType("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link
                href="/library"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full text-xs gap-1.5",
                )}
              >
                <LayersIcon className="size-3.5" />
                <span>Browse Resource Library</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Resources List / Grid */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>
              Showing {resources.length} of {totalCount} saved {totalCount === 1 ? "item" : "items"}
            </span>
            {selectedType !== "all" && (
              <Badge variant="secondary" className="rounded-full text-xs px-2.5 py-0.5 font-normal">
                Filter: {selectedType.toUpperCase()}
              </Badge>
            )}
          </div>

          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                : "flex flex-col gap-3",
            )}
          >
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                viewMode={viewMode}
                onToggleSave={(id, isSaved) => {
                  toggleSaveMutation.mutate({ id, isSaved });
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.total > limit && (
            <div className="flex items-center justify-between border-t border-border/50 pt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-full text-xs gap-1 border-border/70"
              >
                <ChevronLeftIcon className="size-3.5" />
                <span>Previous</span>
              </Button>

              <span className="text-xs text-muted-foreground font-medium">
                Page {page} of {Math.ceil(pagination.total / limit)}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="rounded-full text-xs gap-1 border-border/70"
              >
                <span>Next</span>
                <ChevronRightIcon className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
