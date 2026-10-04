"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import type { ResourceType, ResourceVisibility } from "../types";
import { cn } from "@/lib/utils";

interface ResourceFiltersProps {
  selectedType?: ResourceType;
  onSelectType: (type?: ResourceType) => void;
  selectedTopic?: string;
  onSelectTopic: (topic?: string) => void;
  selectedVisibility?: ResourceVisibility;
  onSelectVisibility: (visibility?: ResourceVisibility) => void;
  activeSearch: string;
  onClearSearch: () => void;
  onResetAll: () => void;
}

const FORMAT_FILTERS: { label: string; value?: ResourceType }[] = [
  { label: "All", value: undefined },
  { label: "PDFs", value: "pdf" },
  { label: "Word", value: "word" },
  { label: "PowerPoint", value: "ppt" },
  { label: "Notes", value: "note" },
  { label: "Links", value: "link" },
];

const POPULAR_TOPICS = [
  "Operating Systems",
  "Data Structures",
  "Algorithms",
  "Computer Networks",
  "Database Systems",
  "Computer Architecture",
  "Machine Learning",
];

export function ResourceFilters({
  selectedType,
  onSelectType,
  selectedTopic,
  onSelectTopic,
  selectedVisibility,
  onSelectVisibility,
  activeSearch,
  onClearSearch,
  onResetAll,
}: ResourceFiltersProps) {
  const hasActiveFilters = Boolean(
    selectedType || selectedTopic || selectedVisibility || activeSearch.trim(),
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Format Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
          Format
        </span>
        {FORMAT_FILTERS.map((f) => {
          const isSelected = selectedType === f.value;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => onSelectType(f.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                isSelected
                  ? "bg-neutral-900 text-white shadow-2xs dark:bg-foreground dark:text-background"
                  : "border border-border/70 bg-background text-foreground hover:bg-muted/50",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Secondary Dropdown Selectors using Shadcn Select */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <Select
          value={selectedTopic || "all"}
          onValueChange={(val) => {
            onSelectTopic(!val || val === "all" ? undefined : val);
          }}
        >
          <SelectTrigger className="w-full h-9 rounded-xl border-border/70 bg-background text-xs font-medium">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Topics
            </SelectItem>
            {POPULAR_TOPICS.map((topic) => (
              <SelectItem key={topic} value={topic} className="text-xs">
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedVisibility || "all"}
          onValueChange={(val) => {
            onSelectVisibility(
              !val || val === "all" ? undefined : (val as ResourceVisibility),
            );
          }}
        >
          <SelectTrigger className="w-full h-9 rounded-xl border-border/70 bg-background text-xs font-medium">
            <SelectValue placeholder="All Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Visibility
            </SelectItem>
            <SelectItem value="public" className="text-xs">
              Public Only
            </SelectItem>
            <SelectItem value="private" className="text-xs">
              Private Only
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {activeSearch && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium gap-1.5"
            >
              <span>Search: &ldquo;{activeSearch}&rdquo;</span>
              <button
                type="button"
                onClick={onClearSearch}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear search filter"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          {selectedType && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium gap-1.5"
            >
              <span>Format: {selectedType.toUpperCase()}</span>
              <button
                type="button"
                onClick={() => onSelectType(undefined)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear format filter"
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
                onClick={() => onSelectTopic(undefined)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear topic filter"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          {selectedVisibility && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium gap-1.5"
            >
              <span>Visibility: {selectedVisibility}</span>
              <button
                type="button"
                onClick={() => onSelectVisibility(undefined)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear visibility filter"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          <button
            type="button"
            onClick={onResetAll}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 ml-1 cursor-pointer"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
}
