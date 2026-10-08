import type { Metadata } from "next";
import { StudyEntryView } from "@/features/study";

export const metadata: Metadata = {
  title: "My Study | Synapse",
  description: "Pick up where you left off, start focused study sessions, and track learning progress.",
};

export default function StudyPage() {
  return <StudyEntryView />;
}
