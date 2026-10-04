"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import {
  BookOpenIcon,
  BookmarkIcon,
  ChevronRightIcon,
  CopyIcon,
  EyeIcon,
  GlobeIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import type { Resource, ResourceType } from "../types";
import { useDeleteResource } from "../mutations";
import { useAuthStore } from "@/stores/auth.store";
import { useCurrentUser } from "@/features/auth/queries";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
  viewMode?: "grid" | "list";
  onToggleSave?: (resourceId: string, isSaved?: boolean) => void;
  onDelete?: (resourceId: string) => void;
}

const TYPE_CONFIG: Record<ResourceType, { label: string; badgeColor: string }> =
  {
    pdf: {
      label: "PDF",
      badgeColor:
        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
    },
    word: {
      label: "Word",
      badgeColor:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    },
    ppt: {
      label: "PowerPoint",
      badgeColor:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    },
    note: {
      label: "Note",
      badgeColor:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    },
    link: {
      label: "Link",
      badgeColor:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
    },
  };

export function ResourceCard({
  resource,
  viewMode = "grid",
  onToggleSave,
  onDelete,
}: ResourceCardProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const authUser = useAuthStore((s) => s.user);
  const { data: currentUser } = useCurrentUser();
  const effectiveUserId = authUser?.id ?? currentUser?.id;

  const isOwner = Boolean(
    effectiveUserId &&
      (resource.uploaderId === effectiveUserId ||
        resource.uploader?.id === effectiveUserId),
  );

  const deleteMutation = useDeleteResource();

  const isLink = resource.type === "link";
  const GraphicIcon = isLink ? GlobeIcon : BookOpenIcon;
  const typeConfig = TYPE_CONFIG[resource.type] ?? {
    label: resource.type.toUpperCase(),
    badgeColor: "bg-muted text-muted-foreground",
  };

  const uploaderName = resource.uploader?.name || "Contributor";
  const initials = (uploaderName || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    },
  );

  const formattedYearDate = new Date(resource.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
    },
  );

  const handleCopyLink = () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/library/${resource.id}`
        : `/library/${resource.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.add({
        title: "Link copied",
        description: "Resource link copied to clipboard.",
        type: "success",
      });
    }
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(resource.id);
    } else {
      deleteMutation.mutate(resource.id);
    }
    setDeleteDialogOpen(false);
  };

  // Small uploader avatar chip matching sidebar Avatar component
  const contributorPill = (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 py-0.5 pr-2.5 pl-1 text-[11px] font-medium text-white/90 backdrop-blur-xs">
      <Avatar className="size-4.5 shrink-0 select-none">
        <AvatarImage src={resource.uploader?.avatarUrl} alt={uploaderName} />
        <AvatarFallback className="bg-white/20 text-[9px] font-semibold text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="max-w-[100px] truncate font-semibold sm:max-w-[120px]">
        {uploaderName}
      </span>
      <span className="text-white/50">·</span>
      <span className="text-[10px] text-white/75">{formattedDate}</span>
    </div>
  );

  // Bookmark save button (replaces likes/hearts)
  const bookmarkButton = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleSave?.(resource.id, resource.isSaved);
      }}
      className={cn(
        "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full backdrop-blur-xs transition",
        resource.isSaved
          ? "text-primary bg-white shadow-xs"
          : "bg-black/30 text-white/80 hover:bg-black/40 hover:text-white",
      )}
      aria-label={resource.isSaved ? "Unsave resource" : "Save resource"}
    >
      <BookmarkIcon
        className={cn(
          "size-3.5 transition-all",
          resource.isSaved && "text-primary fill-current",
        )}
      />
    </button>
  );

  // Three dots more actions dropdown (available if resource belongs to user)
  const moreActionsMenu = isOwner ? (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-xs transition hover:bg-black/40 hover:text-white"
            aria-label="Resource options"
          >
            <MoreVerticalIcon className="size-3.5" />
          </button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={6} className="w-44">
        <DropdownMenuItem
          className="gap-2.5 text-xs cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/library/${resource.id}`);
          }}
        >
          <EyeIcon className="size-3.5 text-muted-foreground" />
          <span>Check details</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2.5 text-xs cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleCopyLink();
          }}
        >
          <CopyIcon className="size-3.5 text-muted-foreground" />
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="gap-2.5 text-xs text-destructive focus:text-destructive cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteDialogOpen(true);
          }}
        >
          <Trash2Icon className="size-3.5" />
          <span>Delete resource</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  // Shared footer metrics (real database saves & courses)
  const cardFooter = (
    <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-3 text-xs">
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
        <BookmarkIcon
          className={cn(
            "size-3.5",
            resource.isSaved && "fill-primary text-primary",
          )}
        />
        <span>
          {resource.savesCount ?? 0}{" "}
          {resource.savesCount === 1 ? "save" : "saves"}
        </span>
        {Boolean(resource.coursesCount) && (
          <span className="text-muted-foreground">
            • {resource.coursesCount}{" "}
            {resource.coursesCount === 1 ? "course" : "courses"}
          </span>
        )}
      </div>

      <Link
        href={`/library/${resource.id}`}
        className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
      >
        <span>View</span>
        <ChevronRightIcon className="size-3.5" />
      </Link>
    </div>
  );

  const deleteDialog = (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Resource</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{resource.title}&rdquo;? This
            action cannot be undone and will permanently remove this resource.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleConfirmDelete}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (viewMode === "list") {
    return (
      <>
        <div className="group border-border/70 bg-card hover:border-border flex flex-col overflow-hidden rounded-2xl border shadow-xs transition-all hover:shadow-md sm:flex-row sm:rounded-3xl">
          {/* Thumbnail on left with 1:1 aspect ratio */}
          <div className="relative flex w-full shrink-0 flex-col justify-between bg-[#525F8C] p-3.5 text-white sm:aspect-square sm:h-full sm:w-44">
            <div className="flex w-full items-center justify-start">
              {contributorPill}
            </div>

            <div className="my-auto flex items-center justify-center py-2">
              <GraphicIcon className="size-11 stroke-[1.25] text-white/90" />
            </div>
            <div className="flex w-full items-center justify-between">
              {bookmarkButton}
              {moreActionsMenu}
            </div>
          </div>

          {/* Entire Card Description to the right */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[11px] font-medium uppercase">
                  {resource.type} • {formattedYearDate}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2 py-0 text-[10px] font-semibold",
                    typeConfig.badgeColor,
                  )}
                >
                  {typeConfig.label}
                </Badge>
              </div>

              <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-base font-bold tracking-tight transition-colors">
                {resource.title}
              </h3>

              <p className="text-muted-foreground/90 line-clamp-2 text-xs leading-relaxed">
                {resource.aiMetadata?.summary ||
                  resource.description ||
                  "No summary provided for this resource."}
              </p>
            </div>

            {/* Real Tags from AI Metadata */}
            {resource.aiMetadata?.tags && resource.aiMetadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {resource.aiMetadata.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted/60 text-foreground/80 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {cardFooter}
          </div>
        </div>
        {deleteDialog}
      </>
    );
  }

  // Grid View
  return (
    <>
      <div className="group border-border/70 bg-card hover:border-border flex flex-col overflow-hidden rounded-3xl border shadow-xs transition-all hover:shadow-md">
        {/* Top Banner (Thumbnail) */}
        <div className="relative flex h-44 w-full shrink-0 flex-col justify-between bg-[#525F8C] p-4 text-white">
          <div className="flex w-full items-center justify-between">
            {contributorPill}
            <div className="flex items-center gap-1.5">
              {bookmarkButton}
              {moreActionsMenu}
            </div>
          </div>

          <div className="flex items-center justify-center pb-1">
            <GraphicIcon className="size-12 stroke-[1.25] text-white/90" />
          </div>
        </div>

        {/* Card Content Body */}
        <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-base font-bold tracking-tight transition-colors">
                {resource.title}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 px-2 py-0 text-[10px] font-semibold",
                  typeConfig.badgeColor,
                )}
              >
                {typeConfig.label}
              </Badge>
            </div>

            <p className="text-muted-foreground text-[11px] font-medium uppercase">
              {resource.type} • {formattedYearDate}
            </p>

            <p className="text-muted-foreground/90 line-clamp-2 pt-1 text-xs leading-relaxed">
              {resource.aiMetadata?.summary ||
                resource.description ||
                "No summary provided for this resource."}
            </p>
          </div>

          {/* Real Tags from AI Metadata */}
          {resource.aiMetadata?.tags && resource.aiMetadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {resource.aiMetadata.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-muted/60 text-foreground/80 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {cardFooter}
        </div>
      </div>
      {deleteDialog}
    </>
  );
}
