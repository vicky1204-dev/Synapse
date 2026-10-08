import type { Metadata } from "next";
import Link from "next/link";
import { ContinueStudyingCard } from "@/features/study";
import {
  BookOpenIcon,
  FolderIcon,
  LibraryIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | Synapse",
  description: "Your academic hub for courses, study sessions, resources, and discussions.",
};

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* ── Welcome Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <SparklesIcon className="size-3.5" />
          <span>Dashboard</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick up where you left off or start a new focused study session.
        </p>
      </div>

      {/* ── Continue Studying Hero ── */}
      <section className="space-y-3">
        <ContinueStudyingCard />
      </section>

      {/* ── Quick Navigation Grid ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            href="/study"
            className="group rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs hover:border-border hover:bg-card/90 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-border/60 bg-background text-primary">
                <BookOpenIcon className="size-5" />
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                My Study
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run Pomodoro focus sessions, resume recent activities, and track your study time.
              </p>
            </div>
          </Link>

          <Link
            href="/courses"
            className="group rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs hover:border-border hover:bg-card/90 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-border/60 bg-background text-primary">
                <FolderIcon className="size-5" />
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                My Courses
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Organize your subjects, study packs, notes, and academic resources.
              </p>
            </div>
          </Link>

          <Link
            href="/library"
            className="group rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs shadow-xs hover:border-border hover:bg-card/90 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-border/60 bg-background text-primary">
                <LibraryIcon className="size-5" />
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                Resource Library
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload and preview lecture notes, past exam papers, and shared materials.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
