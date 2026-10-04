/**
 * Resources feature — validation schemas.
 */

import { z } from "zod";

export const resourceUploadFormSchema = z
  .object({
    uploadMode: z.enum(["file", "link"]),
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional()
      .or(z.literal("")),
    type: z.enum(["pdf", "word", "ppt", "note", "link"]),
    visibility: z.enum(["public", "private"]),
    courseId: z.string().optional().or(z.literal("")),
    linkUrl: z
      .string()
      .trim()
      .url("Please enter a valid URL (http/https)")
      .optional()
      .or(z.literal("")),
    tags: z.array(z.string().trim().min(1).max(50)),
    aiSummary: z.string().optional(),
    aiTopics: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (data.uploadMode === "link") {
        return Boolean(data.linkUrl && data.linkUrl.length > 0);
      }
      return true;
    },
    {
      message: "A valid URL is required for external link resources",
      path: ["linkUrl"],
    },
  );

export type ResourceUploadFormValues = z.infer<
  typeof resourceUploadFormSchema
>;
