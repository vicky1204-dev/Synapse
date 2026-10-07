import type { Metadata } from "next";
import { DiscussionDetailView } from "@/features/discussions";

export const metadata: Metadata = {
  title: "Discussion | Synapse",
  description: "View peer discussion thread, replies, and notes context.",
};

interface DiscussionPageProps {
  params: Promise<{ id: string }>;
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { id } = await params;
  return <DiscussionDetailView discussionId={id} />;
}
