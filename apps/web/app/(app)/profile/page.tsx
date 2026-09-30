import type { Metadata } from "next";
import { ProfileView } from "@/features/profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your academic profile, learning goals, and courses.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
