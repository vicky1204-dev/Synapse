/**
 * Resource validation schemas.
 */

import { z } from "zod";
import { RESOURCE_TYPES, RESOURCE_VISIBILITIES } from "./resource.types";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createResourceSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),
    type: z.enum(RESOURCE_TYPES, {
      errorMap: () => ({
        message: "Invalid resource type. Supported types: pdf, ppt, doc, link, note",
      }),
    }),
    file: z
      .object({
        provider: z.string().trim().optional(),
        publicId: z.string().trim().optional(),
        url: z.string().trim().optional(),
        mimeType: z.string().trim().optional(),
        sizeBytes: z.number().int().min(0).max(52428800, "File size exceeds 50MB limit").optional(), // 50MB limit
        pageCount: z.number().int().min(0).optional(),
      })
      .optional(),
    visibility: z.enum(RESOURCE_VISIBILITIES).default("public"),
    courseId: z.string().trim().optional(),
    aiMetadata: z
      .object({
        summary: z.string().trim().max(1000).optional(),
        topics: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
        tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // If type is link, URL must be provided and valid
      if (data.type === "link") {
        return Boolean(data.file?.url && /^https?:\/\/.+/.test(data.file.url));
      }
      return true;
    },
    {
      message: "A valid http/https URL is required for link resources",
      path: ["file", "url"],
    },
  );

export const uploadResourceBodySchema = z.object({
  title: z
    .string()
    .trim()
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  type: z.enum(RESOURCE_TYPES).optional(),
  visibility: z.enum(RESOURCE_VISIBILITIES).default("public"),
  courseId: z.string().trim().optional(),
});

export const updateResourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  visibility: z.enum(RESOURCE_VISIBILITIES).optional(),
  aiMetadata: z
    .object({
      summary: z.string().trim().max(1000).optional(),
      topics: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
      tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
    })
    .optional(),
});

export const queryResourcesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  type: z.enum(RESOURCE_TYPES).optional(),
  visibility: z.enum(RESOURCE_VISIBILITIES).optional(),
  topic: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  uploaderId: z.string().regex(objectIdRegex, "Invalid uploader ID").optional(),
  courseId: z.string().regex(objectIdRegex, "Invalid course ID").optional(),
});

export const associateCourseResourceSchema = z.object({
  courseId: z.string().regex(objectIdRegex, "Invalid course ID"),
  position: z.number().int().optional(),
});
