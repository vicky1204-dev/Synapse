"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User } from "@/features/auth/types";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  MailIcon,
  PencilIcon,
  SparklesIcon,
} from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export function ProfileHeader({
  user,
  isEditing,
  onToggleEdit,
}: ProfileHeaderProps) {
  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-card border-border/80 flex flex-col gap-6 rounded-3xl border p-6 shadow-xs sm:p-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <Avatar className="size-20 shrink-0 border-2 border-primary/20 shadow-xs sm:size-24">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold font-heading">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl font-heading">
                {user.name}
              </h1>
              {user.onboardingStatus === "completed" ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1 py-0.5 rounded-full"
                >
                  <CheckCircle2Icon className="size-3" />
                  Active Student
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1 py-0.5 rounded-full"
                >
                  <ClockIcon className="size-3" />
                  Onboarding Incomplete
                </Badge>
              )}
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5">
                <MailIcon className="size-3.5 opacity-70" />
                {user.email}
              </span>

              {formattedJoinDate && (
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5 opacity-70" />
                  Joined {formattedJoinDate}
                </span>
              )}

              {user.academicProfile?.program && (
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <SparklesIcon className="size-3.5 text-primary" />
                  {user.academicProfile.program}
                  {user.academicProfile.year && ` • Year ${user.academicProfile.year}`}
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={onToggleEdit}
          variant={isEditing ? "secondary" : "default"}
          size="sm"
          className="rounded-full gap-2 self-stretch sm:self-auto"
        >
          <PencilIcon className="size-3.5" />
          {isEditing ? "View Overview" : "Edit Profile"}
        </Button>
      </div>
    </div>
  );
}
