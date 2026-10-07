"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  FolderIcon,
  FileTextIcon,
  GlobeIcon,
  PlusIcon,
  Link2Icon,
  MoreHorizontalIcon,
  Trash2Icon,
  RotateCwIcon,
  EyeIcon,
} from "lucide-react";
import { useDisassociateCourseResource } from "../mutations";
import { UploadDialog } from "@/features/resources/components/upload-dialog";
import { LinkResourceDialog } from "./link-resource-dialog";
import type { Course, CourseResourceItem } from "../types";

interface CourseResourcesTabProps {
  course: Course;
  resources: CourseResourceItem[];
  onTabChange: (tab: "overview" | "resources" | "study" | "discussions") => void;
}

export function CourseResourcesTab({
  course,
  resources,
  onTabChange,
}: CourseResourcesTabProps) {
  const router = useRouter();
  const disassociateMutation = useDisassociateCourseResource();

  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [resourceToUnlink, setResourceToUnlink] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const existingResourceIds = resources.map((r) => r.resourceId);

  const handleUnlinkConfirm = () => {
    if (!resourceToUnlink) return;
    disassociateMutation.mutate({
      courseId: course.id,
      resourceId: resourceToUnlink.id,
    });
    setResourceToUnlink(null);
  };

  return (
    <div className="space-y-10">
      {/* ── Resource Library Section ── */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FolderIcon className="size-4 text-muted-foreground" />
            <h2 className="font-heading text-base font-semibold text-foreground">
              Resource library
            </h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
              {resources.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLinkDialogOpen(true)}
              className="rounded-full text-xs font-medium"
            >
              <Link2Icon className="mr-1.5 size-3.5" />
              Link from Library
            </Button>

            <UploadDialog
              courseId={course.id}
              triggerButton={
                <Button size="sm" className="rounded-full text-xs font-medium shadow-xs">
                  <PlusIcon className="mr-1.5 size-3.5" />
                  Upload Resource
                </Button>
              }
            />
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-10 text-center space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
              <FileTextIcon className="size-6" />
            </div>
            <h3 className="font-heading text-sm font-semibold text-foreground">
              No resources associated with this course
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Upload course syllabus, lecture slides, and notes, or link existing materials
              from your knowledge library.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLinkDialogOpen(true)}
                className="rounded-full text-xs"
              >
                <Link2Icon className="mr-1.5 size-3.5" />
                Link Existing
              </Button>
              <UploadDialog
                courseId={course.id}
                triggerButton={
                  <Button size="sm" className="rounded-full text-xs">
                    <PlusIcon className="mr-1.5 size-3.5" />
                    Upload
                  </Button>
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map(({ id: associationId, resource }) => {
              const isLink = resource.type === "link";
              const metaSubtitle = isLink
                ? "External link reference"
                : `${resource.type.toUpperCase()} reference · ${
                    resource.file?.pageCount ? `${resource.file.pageCount} pages` : "Lecture note"
                  }`;

              return (
                <div
                  key={associationId}
                  className="group relative flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs shadow-xs transition-all hover:border-border hover:shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Title */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          {isLink ? (
                            <GlobeIcon className="size-5" />
                          ) : (
                            <FileTextIcon className="size-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3
                            onClick={() => router.push(`/library/${resource.id}`)}
                            className="cursor-pointer font-heading text-sm font-semibold text-foreground truncate hover:text-primary transition-colors"
                            title={resource.title}
                          >
                            {resource.title}
                          </h3>
                          <p className="text-[11px] font-medium text-muted-foreground truncate">
                            {metaSubtitle}
                          </p>
                        </div>
                      </div>

                      {/* Options Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label="Resource options"
                          className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-hidden"
                        >
                          <MoreHorizontalIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => router.push(`/library/${resource.id}`)}
                          >
                            <EyeIcon className="size-4 mr-2" />
                            View Resource
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              setResourceToUnlink({
                                id: resource.id,
                                title: resource.title,
                              })
                            }
                          >
                            <Trash2Icon className="size-4 mr-2" />
                            Remove from Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Summary / Description preview */}
                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {resource.aiMetadata?.summary ||
                        resource.description ||
                        "Covers core course topics, definitions, formulas, and review problems."}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 mt-2 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/library/${resource.id}`)}
                      className="rounded-full px-4 text-xs font-semibold hover:bg-foreground hover:text-background transition-colors"
                    >
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Study Pack Relationship Section ── */}
      <section className="space-y-5 pt-4">
        <div className="flex items-center gap-2">
          <FolderIcon className="size-4 text-muted-foreground" />
          <h2 className="font-heading text-base font-semibold text-foreground">
            Study Pack relationship
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: Math.max(1, Math.min(3, Math.ceil(resources.length / 2))) }).map(
            (_, idx) => {
              const packTitle =
                idx === 0
                  ? `${course.title} - Study Pack`
                  : idx === 1
                    ? `${course.title} - Midterm Review`
                    : `${course.title} - Advanced Practice`;

              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 p-5 sm:p-6 backdrop-blur-xs shadow-xs space-y-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <FolderIcon className="size-4 text-primary" />
                      <span className="truncate">{packTitle}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on {resources.length} {resources.length === 1 ? "resource" : "resources"}
                    </p>
                  </div>

                  {/* Sources Preview */}
                  <div className="space-y-2 py-1">
                    {resources.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-xs text-foreground/90 font-medium truncate"
                      >
                        {item.resource.type === "link" ? (
                          <GlobeIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        ) : (
                          <FileTextIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <span className="truncate">{item.resource.title}</span>
                      </div>
                    ))}
                    {resources.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">
                        Link resources above to populate study pack topics.
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                    <Button
                      size="sm"
                      onClick={() => onTabChange("study")}
                      className="rounded-full px-4 text-xs font-semibold shadow-xs"
                    >
                      Study
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTabChange("study")}
                      className="rounded-full px-3 text-xs"
                    >
                      <RotateCwIcon className="mr-1 size-3" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTabChange("resources")}
                      className="rounded-full px-3 text-xs"
                    >
                      View sources
                    </Button>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>

      {/* Link Existing Resources Dialog */}
      <LinkResourceDialog
        courseId={course.id}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        existingResourceIds={existingResourceIds}
      />

      {/* Unlink Confirmation Alert */}
      <AlertDialog
        open={Boolean(resourceToUnlink)}
        onOpenChange={(open) => {
          if (!open) setResourceToUnlink(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Resource from Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &ldquo;{resourceToUnlink?.title}&rdquo; from this
              course? The resource itself will remain in your global knowledge library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleUnlinkConfirm}
              disabled={disassociateMutation.isPending}
            >
              {disassociateMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
