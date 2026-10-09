import type { Metadata } from "next";
import { SavedResourcesView } from "@/features/saved";

export const metadata: Metadata = {
  title: "Saved Resources | Synapse",
  description: "Access your bookmarked lecture slides, notes, and study materials.",
};

export default function SavedPage() {
  return <SavedResourcesView />;
}