"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/features/courses/queries";
import { useCreateDiscussion } from "../mutations";
import { PlusIcon, XIcon, GraduationCapIcon } from "lucide-react";

interface CreateDiscussionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCourseId?: string;
  initialResourceId?: string;
  onSuccess?: (discussionId: string) => void;
}

export function CreateDiscussionDialog({
  open,
  onOpenChange,
  initialCourseId,
  initialResourceId,
  onSuccess,
}: CreateDiscussionDialogProps) {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [courseId, setCourseId] = React.useState(initialCourseId || "none");
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const { data: coursesData } = useCourses({ limit: 50 });
  const courses = coursesData?.data ?? [];

  const createMutation = useCreateDiscussion();

  const resetForm = () => {
    setTitle("");
    setBody("");
    setCourseId(initialCourseId || "none");
    setTags([]);
    setTagInput("");
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    } else if (initialCourseId) {
      setCourseId(initialCourseId);
    }
    onOpenChange(nextOpen);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (val && !tags.includes(val) && tags.length < 10) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a discussion title.");
      return;
    }
    if (!body.trim()) {
      setError("Please write the discussion details.");
      return;
    }

    setError(null);

    try {
      const discussion = await createMutation.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        courseId: courseId && courseId !== "none" ? courseId : undefined,
        resourceId: initialResourceId,
        tags,
      });

      onOpenChange(false);
      onSuccess?.(discussion.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create discussion");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PlusIcon className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg">
                Start a New Discussion
              </DialogTitle>
              <DialogDescription className="text-xs">
                Ask a question, share insights, or discuss topics with your peers.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <Field>
            <FieldLabel className="text-xs font-semibold">Title</FieldLabel>
            <Input
              placeholder="e.g. Does LRU always replace the least recently used page?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl text-sm"
              maxLength={200}
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-xs font-semibold">Course Workspace (Optional)</FieldLabel>
            {initialCourseId ? (
              <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3 py-2 text-xs">
                <GraduationCapIcon className="size-4 text-primary" />
                <span className="font-medium text-foreground">
                  Attached to current course workspace
                </span>
              </div>
            ) : (
              <Select
                value={courseId}
                onValueChange={(val) => setCourseId(val || "none")}
              >
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Select course workspace (optional)" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">General Topic (No course)</SelectItem>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title} {c.code ? `(${c.code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field>
            <FieldLabel className="text-xs font-semibold">Description / Question</FieldLabel>
            <Textarea
              placeholder="Describe your question or discussion point in detail. Provide context or specific problem areas..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[140px] rounded-xl text-sm leading-relaxed"
              maxLength={10000}
              required
            />
          </Field>

          <Field>
            <FieldLabel className="text-xs font-semibold">
              Tags (press Enter to add)
            </FieldLabel>
            <div className="space-y-2">
              <Input
                placeholder="e.g. Operating Systems, Algorithms, Midterms"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="rounded-xl text-sm"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full px-2.5 py-0.5 text-xs flex items-center gap-1 font-normal"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-xs"
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full text-xs font-semibold shadow-xs"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && (
                <Spinner className="mr-1.5 size-3.5" />
              )}
              Publish Discussion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
