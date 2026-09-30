"use client";

import { useState } from "react";
import { useProfile } from "../queries";
import { ProfileHeader } from "./profile-header";
import { ProfileDetailsCard } from "./profile-details-card";
import { ProfileEditForm } from "./profile-edit-form";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";

export function ProfileView() {
  const { data: user, isLoading, isError, error, refetch } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Spinner className="size-8 text-primary" />
        <span className="text-muted-foreground text-xs font-medium">
          Loading student profile...
        </span>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="bg-card border-border/80 flex flex-col items-center justify-center gap-4 rounded-3xl border p-12 text-center shadow-xs">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircleIcon className="size-6" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h2 className="text-base font-semibold font-heading text-foreground">
            Unable to load profile
          </h2>
          <p className="text-xs text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while fetching your profile."}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => void refetch()}
          className="rounded-full gap-2"
        >
          <RefreshCwIcon className="size-3.5" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-2">
      {/* Hero Profile Header */}
      <ProfileHeader
        user={user}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing((prev) => !prev)}
      />

      {/* Main Content: Overview Cards or Edit Form */}
      {isEditing ? (
        <ProfileEditForm
          user={user}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileDetailsCard
          user={user}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
