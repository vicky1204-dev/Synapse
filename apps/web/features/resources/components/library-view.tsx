"use client";

import { useState } from "react";
import { useResources } from "../queries";
import { useSaveResource, useUnsaveResource } from "../mutations";
import { UploadDialog } from "./upload-dialog";
import { ResourceCard } from "./resource-card";
import { ResourceFilters } from "./resource-filters";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  SearchIcon,
  DownloadIcon,
  LayoutGridIcon,
  ListIcon,
  BookOpenIcon,
  KeyboardIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import type { Resource, ResourceType, ResourceVisibility } from "../types";
import { cn } from "@/lib/utils";

export function LibraryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ResourceType | undefined>(undefined);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const [selectedVisibility, setSelectedVisibility] = useState<ResourceVisibility | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading } = useResources({
    search: activeSearch.trim() || undefined,
    type: selectedType,
    topic: selectedTopic,
    visibility: selectedVisibility,
    page,
    limit,
  });

  const saveMutation = useSaveResource();
  const unsaveMutation = useUnsaveResource();

  const resources: Resource[] = data?.data ?? [];
  const pagination = data?.pagination;

  const totalCount = pagination?.total ?? resources.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedType(undefined);
    setSelectedTopic(undefined);
    setSelectedVisibility(undefined);
    setActiveSearch("");
    setSearchQuery("");
    setPage(1);
  };

  const handleToggleSave = (resourceId: string, isSaved?: boolean) => {
    if (isSaved) {
      unsaveMutation.mutate(resourceId);
    } else {
      saveMutation.mutate(resourceId);
    }
  };

  const hasActiveFilters = Boolean(
    selectedType || selectedTopic || selectedVisibility || activeSearch.trim(),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-2 px-1">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground sm:text-3xl tracking-tight">
            Library
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Search, filter, and browse learning resources
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <UploadDialog />
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-2xs transition hover:bg-muted/50 cursor-pointer"
          >
            <DownloadIcon className="size-3.5 text-muted-foreground" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Search Bar — unified with discussion page style */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card p-2 shadow-xs transition focus-within:border-primary/50"
      >
        <div className="flex items-center gap-2 pl-2 text-muted-foreground">
          <KeyboardIcon className="size-4 shrink-0" />
        </div>
        <Input
          placeholder="Search by title, topic, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Filters Section (Decomposed into ResourceFilters component) */}
      {showFilterPanel && (
        <ResourceFilters
          selectedType={selectedType}
          onSelectType={(type) => {
            setSelectedType(type);
            setPage(1);
          }}
          selectedTopic={selectedTopic}
          onSelectTopic={(topic) => {
            setSelectedTopic(topic);
            setPage(1);
          }}
          selectedVisibility={selectedVisibility}
          onSelectVisibility={(visibility) => {
            setSelectedVisibility(visibility);
            setPage(1);
          }}
          activeSearch={activeSearch}
          onClearSearch={() => {
            setActiveSearch("");
            setSearchQuery("");
          }}
          onResetAll={handleResetFilters}
        />
      )}

      {/* Results Header with View Mode Switcher */}
      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        <span className="text-sm font-bold text-foreground">
          {totalCount} {totalCount === 1 ? "Result" : "Results"}
        </span>

        <div className="flex items-center gap-1 border border-border/70 rounded-lg p-0.5 bg-background">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              viewMode === "grid"
                ? "bg-muted text-foreground"
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
              "p-1.5 rounded-md transition-colors cursor-pointer",
              viewMode === "list"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label="List view"
          >
            <ListIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">
              Loading library resources...
            </p>
          </div>
        </div>
      ) : resources.length === 0 ? (
        <Empty className="my-10 border border-dashed border-border/80 bg-card p-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpenIcon className="size-8 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No resources found</EmptyTitle>
            <EmptyDescription>
              {hasActiveFilters
                ? "No materials matched your filter criteria. Try adjusting your search terms or filters."
                : "Your knowledge library is currently empty. Upload the first document to get started."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-neutral-800 dark:bg-foreground dark:text-background cursor-pointer"
              >
                Clear all filters
              </button>
            ) : (
              <UploadDialog />
            )}
          </EmptyContent>
        </Empty>
      ) : (
        <div
          className={cn(
            "grid gap-5",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              viewMode={viewMode}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}

      {/* Real Server Pagination using Shadcn Pagination Component */}
      {resources.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border/50 pt-5 gap-3">
          <span className="text-xs text-muted-foreground">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalCount)} of {totalCount} results
          </span>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="Previous"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  className={cn(
                    "cursor-pointer text-xs",
                    page <= 1 && "pointer-events-none opacity-40",
                  )}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={page === pageNum}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNum);
                    }}
                    className="cursor-pointer text-xs size-8"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  text="Next"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className={cn(
                    "cursor-pointer text-xs",
                    page >= totalPages && "pointer-events-none opacity-40",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
