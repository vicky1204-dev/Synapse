import type { Metadata } from "next";
import { LibraryView } from "@/features/resources";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse, discover, and upload shared study resources across campus.",
};

export default function LibraryPage() {
  return <LibraryView />;
}