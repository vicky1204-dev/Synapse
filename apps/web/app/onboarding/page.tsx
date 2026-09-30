import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding";

export const metadata: Metadata = {
  title: "Onboarding — Synapse",
  description: "Complete your Synapse profile and academic setup.",
};

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle,#b0a8b8_1px,transparent_1px)] bg-size-[10px_10px] p-4 sm:p-6 dark:bg-[radial-gradient(circle,#ffffff1a_1px,transparent_1px)]">
      <OnboardingFlow />
    </main>
  );
}
