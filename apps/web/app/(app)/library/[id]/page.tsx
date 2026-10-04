import type { Metadata } from "next";
import { ResourceDetailView } from "@/features/resources/components/resource-detail-view";

export const metadata: Metadata = {
  title: "Resource",
  description: "View resource details, content, and discussions.",
};

interface ResourcePageProps {
  params: Promise<{ id: string }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { id } = await params;
  return <ResourceDetailView resourceId={id} />;
}
