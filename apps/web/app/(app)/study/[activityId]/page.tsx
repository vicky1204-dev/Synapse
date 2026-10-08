import type { Metadata } from "next";
import { StudyWorkspaceView } from "@/features/study";

export const metadata: Metadata = {
  title: "Study Workspace | Synapse",
  description: "Focused study session with active resource reading, notes, and focus timer.",
};

interface StudyPageProps {
  params: Promise<{ activityId: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { activityId } = await params;
  return <StudyWorkspaceView activityId={activityId} />;
}
