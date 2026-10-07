import type { Metadata } from "next";
import { CourseDetailView } from "@/features/courses";

export const metadata: Metadata = {
  title: "Course Workspace | Synapse",
  description: "Personal course workspace, study packs, notes, and discussions.",
};

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  return <CourseDetailView courseId={courseId} />;
}
