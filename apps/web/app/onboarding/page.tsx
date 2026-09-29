import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Complete your Synapse profile setup.",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold">Welcome to Synapse</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Setting up your workspace…
        </p>
      </div>
    </div>
  );
}
