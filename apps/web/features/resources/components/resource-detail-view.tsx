"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResource } from "../queries";
import {
  useSaveResource,
  useUnsaveResource,
  useDeleteResource,
} from "../mutations";
import { ResourceViewer } from "./resource-viewer";
import { resolveFileUrl } from "../utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useAuthStore } from "@/stores/auth.store";
import { useCurrentUser } from "@/features/auth/queries";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  BookmarkIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  GlobeIcon,
  MessageSquareIcon,
  PlusIcon,
  BookOpenIcon,
  SparklesIcon,
  AlertCircleIcon,
  TagIcon,
  DownloadIcon,
  UserIcon,
  CalendarIcon,
  Trash2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource, ResourceType } from "../types";

interface ResourceDetailViewProps {
  resourceId: string;
}

const TYPE_CONFIG: Record<
  ResourceType,
  { label: string; badgeColor: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  pdf: {
    label: "PDF",
    badgeColor:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
    Icon: BookOpenIcon,
  },
  word: {
    label: "Word",
    badgeColor:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    Icon: BookOpenIcon,
  },
  ppt: {
    label: "PowerPoint",
    badgeColor:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    Icon: BookOpenIcon,
  },
  note: {
    label: "Note",
    badgeColor:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    Icon: BookOpenIcon,
  },
  link: {
    label: "Link",
    badgeColor:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
    Icon: GlobeIcon,
  },
};

// ---------------------------------------------------------------------------
// Discussion placeholder (future feature)
// ---------------------------------------------------------------------------

interface PlaceholderDiscussion {
  id: string;
  author: string;
  authorInitials: string;
  timeAgo: string;
  body: string;
}

const PLACEHOLDER_DISCUSSIONS: PlaceholderDiscussion[] = [
  {
    id: "d1",
    author: "Sarah M.",
    authorInitials: "SM",
    timeAgo: "2h ago",
    body: "Does LRU always replace the least recently used page? I found a scenario where the algorithm seems to skip a page that hasn't been accessed in hours.",
  },
  {
    id: "d2",
    author: "Rajan K.",
    authorInitials: "RK",
    timeAgo: "5h ago",
    body: "Great resource! The section on virtual memory management is particularly clear. Bookmarked this for revision before the OS exam.",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SidebarSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DiscussionItem({ discussion }: { discussion: PlaceholderDiscussion }) {
  return (
    <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/30 p-3.5">
      <div className="flex items-center gap-2">
        <Avatar className="size-6 shrink-0" size="sm">
          <AvatarFallback className="text-[9px] font-bold">
            {discussion.authorInitials}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-semibold text-foreground">
          {discussion.author}
        </span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {discussion.timeAgo}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {discussion.body}
      </p>
    </div>
  );
}

function ResourceMeta({ resource }: { resource: Resource }) {
  const typeConfig = TYPE_CONFIG[resource.type] ?? {
    label: resource.type.toUpperCase(),
    badgeColor: "bg-muted text-muted-foreground",
    Icon: BookOpenIcon,
  };

  const uploaderName = resource.uploader?.name ?? "Unknown contributor";
  const initials = uploaderName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="space-y-4">
      {/* Title & badge */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground flex-1">
            {resource.title}
          </h2>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[10px] font-semibold px-2 py-0 mt-0.5",
              typeConfig.badgeColor,
            )}
          >
            {typeConfig.label}
          </Badge>
        </div>

        {/* Summary / description */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {resource.aiMetadata?.summary ||
            resource.description ||
            "No summary available for this resource."}
        </p>
      </div>

      <Separator />

      {/* Contributor row */}
      <div className="flex items-center gap-2.5">
        <Avatar className="size-7 shrink-0">
          <AvatarImage
            src={resource.uploader?.avatarUrl}
            alt={uploaderName}
          />
          <AvatarFallback className="text-[10px] font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {uploaderName}
          </p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <CalendarIcon className="size-2.5" />
            {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <BookmarkIcon
            className={cn(
              "size-3",
              resource.isSaved && "fill-primary text-primary",
            )}
          />
          <span>{resource.savesCount ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ResourceDetailView({ resourceId }: ResourceDetailViewProps) {
  const router = useRouter();
  const { data: resource, isLoading, isError } = useResource(resourceId);
  const saveMutation = useSaveResource();
  const unsaveMutation = useUnsaveResource();
  const deleteMutation = useDeleteResource();
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const authUser = useAuthStore((s) => s.user);
  const { data: currentUser } = useCurrentUser();
  const effectiveUserId = authUser?.id ?? currentUser?.id;

  const isOwner = Boolean(
    effectiveUserId &&
      resource &&
      (resource.uploaderId === effectiveUserId ||
        resource.uploader?.id === effectiveUserId),
  );

  const handleToggleSave = () => {
    if (!resource) return;
    if (resource.isSaved) {
      unsaveMutation.mutate(resource.id);
    } else {
      saveMutation.mutate(resource.id);
    }
  };

  const handleConfirmDelete = () => {
    if (!resource) return;
    deleteMutation.mutate(resource.id, {
      onSuccess: () => {
        router.push("/library");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs font-medium text-muted-foreground">
            Loading resource...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-6 py-24 px-4 text-center">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircleIcon className="size-5 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>Resource not found</EmptyTitle>
            <EmptyDescription>
              This resource may have been removed or you don&apos;t have access to it.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ChevronLeftIcon className="size-3.5" />
          Back to Library
        </Link>
      </div>
    );
  }

  const hasTopics =
    resource.aiMetadata?.topics && resource.aiMetadata.topics.length > 0;
  const hasTags =
    resource.aiMetadata?.tags && resource.aiMetadata.tags.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeftIcon className="size-4" />
            <span>Library</span>
          </Link>
          <span className="text-border/70">/</span>
          <span className="text-xs font-semibold text-foreground line-clamp-1 max-w-48 sm:max-w-xs">
            {resource.title}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Save / Bookmark */}
          <button
            type="button"
            onClick={handleToggleSave}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
              resource.isSaved
                ? "bg-primary/10 text-primary border border-primary/20"
                : "border border-border/70 bg-background text-foreground hover:bg-muted/50",
            )}
            aria-label={resource.isSaved ? "Unsave resource" : "Save resource"}
          >
            <BookmarkIcon
              className={cn(
                "size-3.5",
                resource.isSaved && "fill-current text-primary",
              )}
            />
            <span>{resource.isSaved ? "Saved" : "Save"}</span>
            <span className="text-muted-foreground font-normal">
              {resource.savesCount ?? 0}
            </span>
          </button>

          {/* Open externally (for files / links) */}
          {resource.file?.url && (
            <a
              href={resolveFileUrl(resource.file.url)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition hover:text-foreground hover:bg-muted/50 cursor-pointer"
              aria-label="Open in new tab"
            >
              <ExternalLinkIcon className="size-3.5" />
            </a>
          )}

          {/* + Action Menu */}
          <DropdownMenu open={actionMenuOpen} onOpenChange={setActionMenuOpen}>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-800 dark:bg-foreground dark:text-background cursor-pointer"
                  aria-label="More actions"
                >
                  <PlusIcon className="size-4" />
                </button>
              }
            />
            <DropdownMenuContent align="end" sideOffset={6}>
              <DropdownMenuItem className="gap-2.5 text-xs">
                <MessageSquareIcon className="size-3.5 text-muted-foreground" />
                <span>Open discussion</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 text-xs">
                <BookOpenIcon className="size-3.5 text-muted-foreground" />
                <span>Add to course</span>
              </DropdownMenuItem>
              {resource.file?.url && (
                <DropdownMenuItem
                  className="gap-2.5 text-xs"
                  onClick={() => window.open(resolveFileUrl(resource.file?.url), "_blank")}
                >
                  <DownloadIcon className="size-3.5 text-muted-foreground" />
                  <span>Download file</span>
                </DropdownMenuItem>
              )}
              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="gap-2.5 text-xs text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2Icon className="size-3.5" />
                    <span>Delete resource</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Body: Viewer (left) + Sidebar (right) */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* ── Left: Content Viewer ── */}
        <div className="relative flex-1 min-h-[60vh] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/20">
          {resource.processing?.status === "pending" ||
          resource.processing?.status === "processing" ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="flex flex-col items-center gap-3 text-center">
                <Spinner className="size-8 text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  Processing your resource…
                </p>
                <p className="text-xs text-muted-foreground">
                  The AI is analysing topics, generating a summary, and
                  tagging this resource. Hang tight.
                </p>
              </div>
            </div>
          ) : resource.processing?.status === "failed" ? (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <AlertCircleIcon className="size-8 text-destructive" />
                <p className="text-sm font-semibold text-destructive">
                  Processing failed
                </p>
                <p className="text-xs text-muted-foreground">
                  We couldn&apos;t process this resource. The file may be
                  corrupted or unsupported.
                </p>
              </div>
            </div>
          ) : (
            <ResourceViewer
              type={resource.type}
              url={resource.file?.url}
              title={resource.title}
            />
          )}
        </div>

        {/* ── Right: Info Sidebar ── */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="space-y-6 p-5">
              {/* Resource meta: title, summary, contributor */}
              <ResourceMeta resource={resource} />

              {/* Topics (AI-generated) */}
              <Separator />
              <SidebarSection
                icon={<SparklesIcon className="size-3.5" />}
                title="Topics"
              >
                {hasTopics ? (
                  <div className="flex flex-wrap gap-1.5">
                    {resource.aiMetadata.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-border/70 bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No topics identified yet.
                  </p>
                )}
              </SidebarSection>

              {/* Tags (AI-generated) */}
              {hasTags && (
                <>
                  <Separator />
                  <SidebarSection
                    icon={<TagIcon className="size-3.5" />}
                    title="Tags"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {resource.aiMetadata.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </SidebarSection>
                </>
              )}

              {/* Visibility & courses info */}
              {Boolean(resource.coursesCount) && (
                <>
                  <Separator />
                  <SidebarSection
                    icon={<BookOpenIcon className="size-3.5" />}
                    title="Courses"
                  >
                    <p className="text-xs text-muted-foreground">
                      Used in{" "}
                      <span className="font-semibold text-foreground">
                        {resource.coursesCount}
                      </span>{" "}
                      {resource.coursesCount === 1 ? "course" : "courses"}.
                    </p>
                  </SidebarSection>
                </>
              )}

              {/* Discussions (placeholder — future feature) */}
              <Separator />
              <SidebarSection
                icon={<MessageSquareIcon className="size-3.5" />}
                title="Discussions"
              >
                <div className="space-y-2.5">
                  {PLACEHOLDER_DISCUSSIONS.map((d) => (
                    <DiscussionItem key={d.id} discussion={d} />
                  ))}
                </div>

                {/* CTA to start discussion */}
                <button
                  type="button"
                  className="mt-1 w-full rounded-xl border border-dashed border-border/70 py-2.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary cursor-pointer"
                >
                  + Start a discussion
                </button>
              </SidebarSection>

              {/* Contributor section */}
              <Separator />
              <SidebarSection
                icon={<UserIcon className="size-3.5" />}
                title="Contributor"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage
                      src={resource.uploader?.avatarUrl}
                      alt={resource.uploader?.name ?? "Contributor"}
                    />
                    <AvatarFallback className="text-[10px] font-semibold">
                      {(resource.uploader?.name ?? "U")
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {resource.uploader?.name ?? "Unknown contributor"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {resource.visibility === "public"
                        ? "Public resource"
                        : "Private resource"}
                    </p>
                  </div>
                </div>
              </SidebarSection>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
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
    </div>
  );
}
