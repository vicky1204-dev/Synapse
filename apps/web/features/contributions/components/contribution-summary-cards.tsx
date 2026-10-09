"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { UserContributionsSummary } from "../types";
import {
  UploadCloudIcon,
  BookmarkCheckIcon,
  MessageSquareIcon,
  MessagesSquareIcon,
} from "lucide-react";

interface ContributionSummaryCardsProps {
  summary: UserContributionsSummary;
}

export function ContributionSummaryCards({
  summary,
}: ContributionSummaryCardsProps) {
  const cards = [
    {
      label: "Resources Shared",
      value: summary.uploadedResourcesCount,
      description: "Documents and study materials",
      icon: UploadCloudIcon,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Saves Received",
      value: summary.totalSavesReceived,
      description: "Peers who saved your uploads",
      icon: BookmarkCheckIcon,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Discussions Started",
      value: summary.createdDiscussionsCount,
      description: "Community threads created",
      icon: MessageSquareIcon,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Comments & Replies",
      value: summary.totalCommentsCount,
      description: "Peer discussion responses",
      icon: MessagesSquareIcon,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-colors"
          >
            <CardContent className="p-0 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </span>
                <div
                  className={`flex size-8 items-center justify-center rounded-xl border ${card.color}`}
                >
                  <Icon className="size-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value.toLocaleString()}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
