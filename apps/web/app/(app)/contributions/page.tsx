import type { Metadata } from "next";
import { ContributionsView } from "@/features/contributions";

export const metadata: Metadata = {
  title: "My Contributions | Synapse",
  description:
    "Review your knowledge contributions, uploaded learning resources, and community discussions.",
};

export default function ContributionsPage() {
  return <ContributionsView />;
}
