import type { Metadata } from "next";
import { DiscussionsFeedView } from "@/features/discussions";

export const metadata: Metadata = {
  title: "Discussions | Synapse",
  description: "Asynchronous peer discussions, question threads, and academic Q&A.",
};

export default function DiscussionsPage() {
  return <DiscussionsFeedView />;
}
