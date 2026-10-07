"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CommentThread } from "./comment-thread";
import { useDiscussion, useDiscussionComments } from "../queries";
import { useCreateComment, useDeleteDiscussion } from "../mutations";
import { useResource } from "@/features/resources/queries";
import { useCourse } from "@/features/courses/queries";
import { useAuthStore } from "@/stores/auth.store";
import { formatTimeAgo, getInitials } from "../utils";
import {
  ChevronLeftIcon,
  BookmarkIcon,
  MoreHorizontalIcon,
  Share2Icon,
  Trash2Icon,
  FileTextIcon,
  GraduationCapIcon,
  ArrowRightIcon,
  MessageSquareIcon,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface DiscussionDetailViewProps {
  discussionId: string;
}

export function DiscussionDetailView({
  discussionId,
}: DiscussionDetailViewProps) {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);

  const { data: discussion, isLoading, error } = useDiscussion(discussionId);
  const { data: comments = [] } = useDiscussionComments(discussionId);

  const resourceId = discussion?.resourceId || discussion?.context?.resource?.id;
  const courseId = discussion?.courseId || discussion?.context?.course?.id;

  const { data: resource } = useResource(resourceId || "");
  const { data: course } = useCourse(courseId || "");

  const [replyText, setReplyText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"oldest" | "newest">("oldest");
  const [isSaved, setIsSaved] = React.useState(false);

  const createCommentMutation = useCreateComment(discussionId);
  const deleteDiscussionMutation = useDeleteDiscussion();

  const isAuthor = authUser?.id === discussion?.authorId;

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await createCommentMutation.mutateAsync({
      body: replyText.trim(),
    });

    setReplyText("");
  };

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(window.location.href);
    toast.add({
      title: "Link copied",
      description: "Discussion link copied to clipboard.",
      type: "success",
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this discussion?")) {
      await deleteDiscussionMutation.mutateAsync(discussionId);
      router.push("/discussions");
    }
  };

  // Derive unique participants (author + comment authors)
  const participants = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; avatarUrl?: string }>();
    if (discussion?.author) {
      map.set(discussion.authorId, {
        id: discussion.authorId,
        name: discussion.author.name,
        avatarUrl: discussion.author.avatarUrl,
      });
    }
    for (const c of comments) {
      if (c.author && !map.has(c.authorId)) {
        map.set(c.authorId, {
          id: c.authorId,
          name: c.author.name,
          avatarUrl: c.author.avatarUrl,
        });
      }
    }
    return Array.from(map.values());
  }, [discussion, comments]);

  if (isLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto py-6 space-y-6">
        <div className="h-8 w-48 rounded-lg bg-muted/30 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 rounded-3xl bg-muted/20 animate-pulse" />
            <div className="h-48 rounded-3xl bg-muted/20 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-48 rounded-3xl bg-muted/20 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Discussion not found
        </h2>
        <p className="text-xs text-muted-foreground">
          This thread may have been removed or does not exist.
        </p>
        <Link
          href="/discussions"
          className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:opacity-90 transition"
        >
          Back to Discussions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 py-2">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/discussions"
            className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
          >
            <ChevronLeftIcon className="size-4" />
            <span>Discussions</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {course?.title || discussion.context?.course?.title || "General"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSaved(!isSaved);
              toast.add({
                title: isSaved ? "Removed from saved" : "Discussion saved",
                description: isSaved
                  ? "Discussion removed from saved."
                  : "Saved to your bookmarks.",
                type: "success",
              });
            }}
            className={`rounded-full text-xs gap-1.5 ${
              isSaved ? "border-primary text-primary" : ""
            }`}
          >
            <BookmarkIcon className={`size-3.5 ${isSaved ? "fill-primary" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-full border border-border/70 hover:bg-muted text-muted-foreground transition">
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
                    Delete Discussion
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Grid: Left thread content, Right context sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Post + Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Discussion Card */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-xs space-y-5">
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 shrink-0">
                  {discussion.author?.avatarUrl && (
                    <AvatarImage
                      src={discussion.author.avatarUrl}
                      alt={discussion.author.name}
                    />
                  )}
                  <AvatarFallback className="text-xs font-bold">
                    {getInitials(discussion.author?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {discussion.author?.name || "Student"}
                    </span>
                    {isAuthor && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Author
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(discussion.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="font-heading text-lg font-bold text-foreground sm:text-xl leading-snug">
              {discussion.title}
            </h1>

            {/* Post Body */}
            <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {discussion.body}
            </div>

            {/* Tags */}
            {discussion.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {discussion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Card Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground">
              <span>{comments.length} replies</span>
              <span>
                Last activity {formatTimeAgo(discussion.updatedAt || discussion.createdAt)}
              </span>
            </div>
          </div>

          {/* Replies Section Header */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Replies
            </h2>

            <div className="w-32">
              <Select
                value={sortOrder}
                onValueChange={(v) => setSortOrder(v as "oldest" | "newest")}
              >
                <SelectTrigger className="rounded-full text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comment Thread Tree */}
          <CommentThread
            discussionId={discussion.id}
            comments={comments}
            sortOrder={sortOrder}
          />

          {/* Bottom Main Comment Composer */}
          <form
            onSubmit={handlePostReply}
            className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <MessageSquareIcon className="size-4 text-primary" />
              <span>Leave a reply</span>
            </div>

            <Textarea
              placeholder="Write a thoughtful reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[90px] rounded-xl text-xs leading-relaxed"
              required
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground">
                Be constructive and respectful to your peers.
              </span>

              <Button
                type="submit"
                size="sm"
                className="rounded-full text-xs font-semibold px-4"
                disabled={createCommentMutation.isPending || !replyText.trim()}
              >
                {createCommentMutation.isPending && (
                  <Spinner className="mr-1.5 size-3.5" />
                )}
                Post reply
              </Button>
            </div>
          </form>
        </div>

        {/* Right Sidebar: Context Cards */}
        <div className="space-y-4">
          {/* Attached Resource Card */}
          {(resource || discussion.context?.resource) && (
            <div className="rounded-3xl border border-border/70 bg-card p-5 space-y-3.5 shadow-xs">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                ATTACHED RESOURCE
              </span>

              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/80 to-purple-600/90 p-6 text-white text-center flex flex-col items-center justify-center min-h-[110px]">
                <FileTextIcon className="size-8 mb-1 opacity-90" />
                <span className="text-xs font-semibold opacity-90 line-clamp-1">
                  {resource?.title || discussion.context?.resource?.title}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-heading text-sm font-semibold text-foreground truncate">
                  {resource?.title || discussion.context?.resource?.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {resource?.type?.toUpperCase() || discussion.context?.resource?.type || "RESOURCE"} ·{" "}
                  {resource?.file?.pageCount
                    ? `${resource.file.pageCount} pages`
                    : resource?.aiMetadata?.topics?.[0] || "Academic Study"}
                </p>
              </div>

              <Link
                href={`/library/${
                  resource?.id || discussion.context?.resource?.id || discussion.resourceId
                }`}
                className="inline-flex w-full items-center justify-center rounded-full border border-border/80 bg-background px-4 py-2 text-xs font-semibold hover:bg-muted transition text-foreground"
              >
                Open resource
                <ArrowRightIcon className="ml-1.5 size-3" />
              </Link>
            </div>
          )}

          {/* Attached Course Card */}
          {(course || discussion.context?.course) && (
            <div className="rounded-3xl border border-border/70 bg-card p-5 space-y-3.5 shadow-xs">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                COURSE
              </span>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <GraduationCapIcon className="size-4 text-primary" />
                  <h3 className="font-heading text-sm font-semibold text-foreground truncate">
                    {course?.title || discussion.context?.course?.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {course?.code || discussion.context?.course?.code || "Workspace"}
                  {course?.semester ? ` · Semester ${course.semester}` : ""}
                </p>
              </div>

              <Link
                href={`/courses/${
                  course?.id || discussion.context?.course?.id || discussion.courseId
                }`}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition"
              >
                View Course Workspace
                <ArrowRightIcon className="ml-1.5 size-3" />
              </Link>
            </div>
          )}

          {/* Participants Card */}
          <div className="rounded-3xl border border-border/70 bg-card p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Participants
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {participants.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {participants.map((p) => (
                <div key={p.id} title={p.name}>
                  <Avatar className="size-8 border-2 border-background" size="sm">
                    {p.avatarUrl && <AvatarImage src={p.avatarUrl} alt={p.name} />}
                    <AvatarFallback className="text-[10px] font-bold">
                      {getInitials(p.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
