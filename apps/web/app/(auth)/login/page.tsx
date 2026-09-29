import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Synapse account.",
};

export default function LoginPage() {
  return <LoginForm />;
}