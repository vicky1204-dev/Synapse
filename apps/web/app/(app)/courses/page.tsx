import type { Metadata } from "next";
import { CoursesView } from "@/features/courses";

export const metadata: Metadata = {
  title: "My Courses | Synapse",
  description: "Personal course workspaces, study packs, notes, and discussions.",
};

export default function CoursesPage() {
  return <CoursesView />;
}