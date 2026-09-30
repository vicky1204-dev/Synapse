"use client";

import type { LucideIcon } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

interface ProfileEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ProfileEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: ProfileEmptyStateProps) {
  return (
    <Empty className={className ?? "border-border/60 bg-muted/20 border py-8"}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary/10 text-primary">
          <Icon className="size-5" />
        </EmptyMedia>
        <EmptyTitle className="text-base">{title}</EmptyTitle>
        <EmptyDescription className="text-xs">{description}</EmptyDescription>
      </EmptyHeader>
      {actionLabel && onAction && (
        <EmptyContent>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
