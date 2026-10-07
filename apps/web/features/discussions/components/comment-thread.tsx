"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth.store";
import {
  useCreateComment,
  useDeleteComment,
} from "../mutations";
import { formatTimeAgo, getInitials } from "../utils";
import type { Comment } from "../types";
import { MoreHorizontalIcon, Trash2Icon, CornerDownRightIcon } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  discussionId: string;
  childComments: Comment[];
  allComments: Comment[];
}

export function CommentItem({
  comment,
  discussionId,
  childComments,
  allComments,
}: CommentItemProps) {
  const authUser = useAuthStore((s) => s.user);
  const isAuthor = authUser?.id === comment.authorId;
  const isDeleted = comment.status === "deleted";

  const [isReplying, setIsReplying] = React.useState(false);
  const [replyBody, setReplyBody] = React.useState("");

  const createReplyMutation = useCreateComment(discussionId);
  const deleteMutation = useDeleteComment(discussionId);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim()) return;

    await createReplyMutation.mutateAsync({
      body: replyBody.trim(),
      parentCommentId: comment.id,
    });

    setReplyBody("");
    setIsReplying(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteMutation.mutateAsync(comment.id);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-border">
        {/* Comment Author Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-7 shrink-0" size="sm">
              {comment.author?.avatarUrl && (
                <AvatarImage
                  src={comment.author.avatarUrl}
                  alt={comment.author.name}
                />
              )}
              <AvatarFallback className="text-[10px] font-bold">
                {getInitials(comment.author?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-xs font-semibold text-foreground">
                {isDeleted ? "[deleted]" : comment.author?.name || "Student"}
              </span>
              <span className="ml-2 text-[10px] text-muted-foreground">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
          </div>

          {!isDeleted && isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                <MoreHorizontalIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-xl">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-xs text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2Icon className="mr-2 size-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comment Body */}
        <div className="py-2.5 text-xs leading-relaxed text-foreground/90">
          {isDeleted ? (
            <span className="italic text-muted-foreground">[deleted]</span>
          ) : (
            <p className="whitespace-pre-wrap">{comment.body}</p>
          )}
        </div>

        {/* Action button */}
        {!isDeleted && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Reply
            </button>
          </div>
        )}

        {/* Inline Reply Box */}
        {isReplying && (
          <form onSubmit={handlePostReply} className="mt-3 pt-3 border-t border-border/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CornerDownRightIcon className="size-3.5 text-primary" />
              <span>Replying to {comment.author?.name || "Student"}</span>
            </div>
            <Textarea
              placeholder="Write your reply..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              className="min-h-[70px] rounded-xl text-xs"
              autoFocus
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyBody("");
                }}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="rounded-full text-xs font-semibold"
                disabled={createReplyMutation.isPending || !replyBody.trim()}
              >
                {createReplyMutation.isPending && (
                  <Spinner className="mr-1.5 size-3" />
                )}
                Post reply
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Nested Replies */}
      {childComments.length > 0 && (
        <div className="ml-4 pl-4 border-l-2 border-border/60 space-y-3">
          {childComments.map((child) => {
            const grandChildren = allComments.filter(
              (c) => c.parentCommentId === child.id,
            );
            return (
              <CommentItem
                key={child.id}
                comment={child}
                discussionId={discussionId}
                childComments={grandChildren}
                allComments={allComments}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface CommentThreadProps {
  discussionId: string;
  comments: Comment[];
  sortOrder?: "oldest" | "newest";
}

export function CommentThread({
  discussionId,
  comments,
  sortOrder = "oldest",
}: CommentThreadProps) {
  // Sort comments according to sortOrder
  const sorted = React.useMemo(() => {
    return [...comments].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "oldest" ? timeA - timeB : timeB - timeA;
    });
  }, [comments, sortOrder]);

  // Root comments (parentCommentId is undefined or null)
  const rootComments = React.useMemo(() => {
    return sorted.filter((c) => !c.parentCommentId);
  }, [sorted]);

  if (rootComments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center text-xs text-muted-foreground">
        No replies yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rootComments.map((rootComment) => {
        const children = sorted.filter(
          (c) => c.parentCommentId === rootComment.id,
        );
        return (
          <CommentItem
            key={rootComment.id}
            comment={rootComment}
            discussionId={discussionId}
            childComments={children}
            allComments={sorted}
          />
        );
      })}
    </div>
  );
}
