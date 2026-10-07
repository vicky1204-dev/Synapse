/**
 * Courses feature — mutations.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  associateCourseResource,
  disassociateCourseResource,
} from "./api";
import { courseKeys } from "./keys";
import { toast } from "@/components/ui/toast";
import type { CreateCourseRequest, UpdateCourseRequest } from "./types";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => createCourse(data),
    onSuccess: (course) => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.add({
        title: "Course created",
        description: `"${course.title}" has been created.`,
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Creation failed",
        description: err.message || "Failed to create course. Please try again.",
        type: "error",
      });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) =>
      updateCourse(id, data),
    onSuccess: (course) => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.add({
        title: "Course updated",
        description: `"${course.title}" has been updated.`,
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Update failed",
        description: err.message || "Failed to update course. Please try again.",
        type: "error",
      });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.add({
        title: "Course deleted",
        description: "The course workspace and associations were removed.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Delete failed",
        description: err.message || "Failed to delete course.",
        type: "error",
      });
    },
  });
}

export function useAssociateCourseResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      resourceId,
      position,
    }: {
      courseId: string;
      resourceId: string;
      position?: number;
    }) => associateCourseResource(courseId, resourceId, position),
    onSuccess: (_, { courseId }) => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      void queryClient.invalidateQueries({ queryKey: courseKeys.resources(courseId) });
      void queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.add({
        title: "Resource added to course",
        description: "The resource is now linked to this course workspace.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Link failed",
        description: err.message || "Failed to link resource to course.",
        type: "error",
      });
    },
  });
}

export function useDisassociateCourseResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      resourceId,
    }: {
      courseId: string;
      resourceId: string;
    }) => disassociateCourseResource(courseId, resourceId),
    onSuccess: (_, { courseId }) => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      void queryClient.invalidateQueries({ queryKey: courseKeys.resources(courseId) });
      void queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.add({
        title: "Resource removed",
        description: "The resource was unlinked from this course workspace.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Unlink failed",
        description: err.message || "Failed to unlink resource from course.",
        type: "error",
      });
    },
  });
}
