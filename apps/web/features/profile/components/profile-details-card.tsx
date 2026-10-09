"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/features/auth/types";
import { useSubjects } from "@/features/onboarding/queries";
import { ProfileEmptyState } from "./profile-empty-state";
import { ProfileContributionSummaryCard } from "./profile-contribution-summary-card";
import {
  BookOpenIcon,
  Building2Icon,
  CompassIcon,
  GraduationCapIcon,
  HashIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react";

interface ProfileDetailsCardProps {
  user: User;
  onEdit: () => void;
}

export function ProfileDetailsCard({ user, onEdit }: ProfileDetailsCardProps) {
  const { data: subjects = [] } = useSubjects();

  const userSubjects = subjects.filter((s) =>
    user.subjectIds?.includes(s.id),
  );

  const academic = user.academicProfile;
  const hasAcademic = Boolean(
    academic?.program || academic?.year || academic?.institution,
  );
  const hasGoals = Boolean(user.onboardingGoals && user.onboardingGoals.length > 0);
  const hasSubjects = Boolean(user.subjectIds && user.subjectIds.length > 0);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Academic Profile Card */}
      <Card className="rounded-3xl border border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <GraduationCapIcon className="size-4 text-primary" />
            <CardTitle className="text-base font-heading">
              Academic Information
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasAcademic ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between rounded-2xl bg-muted/30 p-3.5 border border-border/40">
                <span className="text-xs font-medium text-muted-foreground">
                  Program / Major
                </span>
                <span className="text-xs font-semibold text-foreground text-right">
                  {academic?.program || (
                    <span className="italic text-muted-foreground font-normal">
                      Not specified
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-start justify-between rounded-2xl bg-muted/30 p-3.5 border border-border/40">
                <span className="text-xs font-medium text-muted-foreground">
                  Year of Study
                </span>
                <span className="text-xs font-semibold text-foreground text-right">
                  {academic?.year ? (
                    `Year ${academic.year}`
                  ) : (
                    <span className="italic text-muted-foreground font-normal">
                      Not specified
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-start justify-between rounded-2xl bg-muted/30 p-3.5 border border-border/40">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Building2Icon className="size-3.5 opacity-60" />
                  Institution
                </span>
                <span className="text-xs font-semibold text-foreground text-right">
                  {academic?.institution || (
                    <span className="italic text-muted-foreground font-normal">
                      Not specified
                    </span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <ProfileEmptyState
              icon={GraduationCapIcon}
              title="Academic profile is empty"
              description="Add your program, institution, and year to personalize your courses and study materials."
              actionLabel="Complete Academic Info"
              onAction={onEdit}
            />
          )}
        </CardContent>
      </Card>

      {/* Learning Goals Card */}
      <Card className="rounded-3xl border border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <TargetIcon className="size-4 text-primary" />
            <CardTitle className="text-base font-heading">
              Learning Goals & Intent
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {hasGoals ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {user.onboardingGoals?.map((goal) => (
                <Badge
                  key={goal}
                  variant="secondary"
                  className="rounded-full bg-primary/10 text-primary border-primary/20 px-3.5 py-1 text-xs font-medium flex items-center gap-1.5"
                >
                  <SparklesIcon className="size-3" />
                  {goal}
                </Badge>
              ))}
            </div>
          ) : (
            <ProfileEmptyState
              icon={TargetIcon}
              title="No learning goals set"
              description="Define your study goals to help Synapse tailor flashcards, practice questions, and study packs."
              actionLabel="Set Learning Goals"
              onAction={onEdit}
            />
          )}
        </CardContent>
      </Card>

      {/* Contributions Summary Card (Full width on md) */}
      <ProfileContributionSummaryCard />

      {/* Enrolled Subjects Card (Full width on md) */}
      <Card className="rounded-3xl border border-border/80 shadow-xs md:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <BookOpenIcon className="size-4 text-primary" />
              <CardTitle className="text-base font-heading">
                Selected Subjects & Courses
              </CardTitle>
            </div>
            {hasSubjects && (
              <Badge variant="outline" className="rounded-full text-xs">
                {userSubjects.length > 0 ? userSubjects.length : user.subjectIds?.length} Subjects
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasSubjects ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {userSubjects.length > 0 ? (
                userSubjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col justify-between gap-2 rounded-2xl border border-border/60 bg-muted/20 p-4 transition-all hover:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {sub.name}
                      </span>
                      {sub.department && (
                        <Badge
                          variant="secondary"
                          className="rounded-md text-[10px] uppercase tracking-wider"
                        >
                          {sub.department}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <HashIcon className="size-3 opacity-60" />
                      {sub.slug}
                    </span>
                  </div>
                ))
              ) : (
                user.subjectIds?.map((id) => (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/20 p-3.5 text-xs text-muted-foreground"
                  >
                    <CompassIcon className="size-4 text-primary" />
                    <span className="truncate">Subject ID: {id}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <ProfileEmptyState
              icon={BookOpenIcon}
              title="No subjects selected yet"
              description="Choose your subjects or courses of interest to seed your workspace with course containers and resources."
              actionLabel="Add Subjects"
              onAction={onEdit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
