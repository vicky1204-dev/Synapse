"use client";

import * as React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth.store";
import { useDeleteDiscussion } from "../mutations";
import { formatTimeAgo, getInitials } from "../utils";
import type { Discussion } from "../types";
import {
  FileTextIcon,
  GraduationCapIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  ChevronDownIcon,
  Trash2Icon,
  Share2Icon,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface DiscussionCardProps {
  discussion: Discussion;
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  const authUser = useAuthStore((s) => s.user);
  const isAuthor = authUser?.id === discussion.authorId;
  const deleteMutation = useDeleteDiscussion();

  const isResourceDiscussion = Boolean(
    discussion.resourceId || discussion.context?.resource,
  );
  const isCourseDiscussion = Boolean(
    discussion.courseId || discussion.context?.course,
  );

  const contextLabel = isResourceDiscussion
    ? "RESOURCE DISCUSSION"
    : isCourseDiscussion
    ? "COURSE DISCUSSION"
    : "GENERAL TOPIC";

  const badgeText =
    discussion.context?.course?.code ||
    (discussion.tags.length > 0 ? discussion.tags[0] : "Discussion");

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(
      `${window.location.origin}/discussions/${discussion.id}`,
    );
    toast.add({
      title: "Link copied",
      description: "Discussion link copied to clipboard.",
      type: "success",
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this discussion?")) {
      await deleteMutation.mutateAsync(discussion.id);
    }
  };

  return (
    <div className="group relative rounded-2xl border border-border/70 bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-xs">
      <Link
        href={`/discussions/${discussion.id}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={discussion.title}
      />

      <div className="relative z-10 pointer-events-none space-y-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                isResourceDiscussion
                  ? "bg-blue-500/10 text-blue-500"
                  : isCourseDiscussion
                  ? "bg-indigo-500/10 text-indigo-500"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isResourceDiscussion ? (
                <FileTextIcon className="size-5" />
              ) : isCourseDiscussion ? (
                <GraduationCapIcon className="size-5" />
              ) : (
                <MessageSquareIcon className="size-5" />
              )}
            </div>

            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                {contextLabel}
              </span>
              <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {discussion.title}
              </h3>
            </div>
          </div>

          {badgeText && (
            <Badge
              variant="secondary"
              className="rounded-md px-2 py-0.5 text-[11px] font-medium text-muted-foreground shrink-0"
            >
              {badgeText}
            </Badge>
          )}
        </div>

        {/* Excerpt Body */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {discussion.body}
        </p>

        {/* Tags */}
        {discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {discussion.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="size-6 shrink-0" size="sm">
              {discussion.author?.avatarUrl && (
                <AvatarImage
                  src={discussion.author.avatarUrl}
                  alt={discussion.author.name}
                />
              )}
              <AvatarFallback className="text-[9px] font-bold">
                {getInitials(discussion.author?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground">
              {discussion.author?.name || "Student"}
            </span>
            <span className="text-[10px] text-muted-foreground">·</span>
            <span className="text-[11px] text-muted-foreground">
              {formatTimeAgo(discussion.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <Link
              href={`/discussions/${discussion.id}`}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
            >
              <span>{discussion.commentCount} replies</span>
              <ChevronDownIcon className="size-3.5 text-muted-foreground" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontalIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem
                  onClick={handleCopyLink}
                  className="text-xs cursor-pointer"
                >
                  <Share2Icon className="mr-2 size-3.5" />
                  Copy Link
                </DropdownMenuItem>

                {isAuthor && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-xs text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2Icon className="mr-2 size-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
