"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContributions } from "@/features/contributions";
import {
  UploadCloudIcon,
  BookmarkCheckIcon,
  MessageSquareIcon,
  ChevronRightIcon,
  SparklesIcon,
  HeartHandshakeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileContributionSummaryCard() {
  const { data, isLoading } = useUserContributions();

  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border/80 shadow-xs md:col-span-2">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48 rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const summary = data?.summary ?? {
    uploadedResourcesCount: 0,
    createdDiscussionsCount: 0,
    totalCommentsCount: 0,
    totalSavesReceived: 0,
  };

  const hasAnyContributions =
    summary.uploadedResourcesCount > 0 ||
    summary.createdDiscussionsCount > 0 ||
    summary.totalCommentsCount > 0;

  return (
    <Card className="rounded-3xl border border-border/80 shadow-xs md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <SparklesIcon className="size-4 text-primary" />
            <CardTitle className="text-base font-heading">
              Contributions & Community Reach
            </CardTitle>
          </div>
          <Link
            href="/contributions"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "rounded-full text-xs gap-1 h-8 text-muted-foreground hover:text-foreground",
            )}
          >
            <span>View All</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Uploaded */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-3.5 transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Resources</span>
              <UploadCloudIcon className="size-3.5 text-blue-500" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-foreground">
                {summary.uploadedResourcesCount}
              </span>
              <p className="text-[11px] text-muted-foreground">Uploaded</p>
            </div>
          </div>

          {/* Saves Received */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-3.5 transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Peer Saves</span>
              <BookmarkCheckIcon className="size-3.5 text-amber-500" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-foreground">
                {summary.totalSavesReceived}
              </span>
              <p className="text-[11px] text-muted-foreground">Bookmarks</p>
            </div>
          </div>

          {/* Discussions */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-3.5 transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Discussions</span>
              <MessageSquareIcon className="size-3.5 text-emerald-500" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-foreground">
                {summary.createdDiscussionsCount}
              </span>
              <p className="text-[11px] text-muted-foreground">Threads</p>
            </div>
          </div>

          {/* Comments */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-3.5 transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Responses</span>
              <HeartHandshakeIcon className="size-3.5 text-purple-500" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-foreground">
                {summary.totalCommentsCount}
              </span>
              <p className="text-[11px] text-muted-foreground">Comments</p>
            </div>
          </div>
        </div>

        {!hasAnyContributions && (
          <div className="mt-3.5 flex items-center justify-between rounded-2xl bg-muted/30 px-4 py-2.5 border border-border/40 text-xs text-muted-foreground">
            <span>You haven&apos;t contributed materials or started discussions yet.</span>
            <Link
              href="/contributions"
              className="font-medium text-primary hover:underline ml-2 shrink-0"
            >
              Get started →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
