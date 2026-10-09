import type { Metadata } from "next";
import { HomeView } from "@/features/home";

export const metadata: Metadata = {
  title: "Dashboard | Synapse",
  description: "Your academic hub for courses, study sessions, resources, and progress.",
};

export default function HomePage() {
  return <HomeView />;
}
