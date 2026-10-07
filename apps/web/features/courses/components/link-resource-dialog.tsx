"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useResources } from "@/features/resources/queries";
import { useAssociateCourseResource } from "../mutations";
import {
  SearchIcon,
  FileTextIcon,
  GlobeIcon,
  CheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource } from "@/features/resources/types";

interface LinkResourceDialogProps {
  courseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingResourceIds?: string[];
  onSuccess?: () => void;
}

export function LinkResourceDialog({
  courseId,
  open,
  onOpenChange,
  existingResourceIds = [],
  onSuccess,
}: LinkResourceDialogProps) {
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const { data: resourcesData, isLoading } = useResources({
    search: search.trim() || undefined,
    limit: 50,
  });

  const associateMutation = useAssociateCourseResource();

  const allResources = resourcesData?.data ?? [];
  // Filter out resources already associated
  const availableResources = allResources.filter(
    (res) => !existingResourceIds.includes(res.id),
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleLink = async () => {
    if (selectedIds.length === 0) return;

    try {
      // Associate each selected resource
      await Promise.all(
        selectedIds.map((resourceId) =>
          associateMutation.mutateAsync({
            courseId,
            resourceId,
          }),
        ),
      );
      setSelectedIds([]);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Handled by mutation toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Link Resources to Course</DialogTitle>
          <DialogDescription>
            Select existing lecture notes, PDFs, or links from your library to attach
            to this course workspace.
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative my-2">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by title or topic..."
            className="pl-9 h-10 text-xs"
          />
        </div>

        {/* List of Available Resources */}
        <div className="flex-1 overflow-y-auto max-h-72 space-y-2 pr-1">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          )}

          {!isLoading && availableResources.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              {allResources.length > 0
                ? "All available resources are already linked to this course."
                : "No library resources found matching your search."}
            </div>
          )}

          {!isLoading &&
            availableResources.map((res: Resource) => {
              const isSelected = selectedIds.includes(res.id);
              const isLink = res.type === "link";

              return (
                <div
                  key={res.id}
                  onClick={() => toggleSelect(res.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border/70 hover:border-border hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      {isLink ? (
                        <GlobeIcon className="size-4" />
                      ) : (
                        <FileTextIcon className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {res.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate uppercase">
                        {res.type} {res.file?.pageCount ? `· ${res.file.pageCount} pages` : ""}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "size-5 rounded-full flex items-center justify-center border shrink-0 transition-colors",
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border",
                    )}
                  >
                    {isSelected && <CheckIcon className="size-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
        </div>

        <DialogFooter className="pt-3 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={associateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLink}
            disabled={selectedIds.length === 0 || associateMutation.isPending}
          >
            {associateMutation.isPending ? (
              <>
                <Spinner className="mr-2 size-4" />
                Linking...
              </>
            ) : (
              `Link ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
