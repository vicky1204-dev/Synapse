/**
 * SessionGuard.
 *
 * Runs the session initialisation lifecycle for authenticated app routes:
 *
 * 1. On mount, attempts a silent token refresh (POST /auth/refresh) using the
 *    HTTP-only refresh token cookie.  If successful, the access token is
 *    stored in the Zustand auth store and the `useCurrentUser` query runs.
 *
 * 2. While the session is being initialised, renders a full-screen loading
 *    state (prevents flash of unauthenticated content).
 *
 * 3. If the refresh fails (expired or missing cookie), redirects to /login.
 *
 * 4. Once the user is confirmed, renders children.
 *
 * This component is intentionally simple — it does not replace middleware-level
 * protection; it provides a client-side UX gate.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/types";
import ky from "ky";

type SessionState = "loading" | "authenticated" | "unauthenticated";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    let cancelled = false;

    async function initSession() {
      try {
        // Attempt silent refresh using the HTTP-only cookie.
        const res = await ky
          .post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            credentials: "include",
          })
          .json<{ success: true; data: { user: { id: string; email: string; name: string; avatarUrl?: string; onboardingStatus: "pending" | "completed" }; accessToken: string } }>();

        if (cancelled) return;

        setSession(res.data.accessToken, {
          id: res.data.user.id,
          email: res.data.user.email,
          name: res.data.user.name,
          avatarUrl: res.data.user.avatarUrl,
          onboardingStatus: res.data.user.onboardingStatus,
        });

        setSessionState("authenticated");
      } catch (err) {
        if (cancelled) return;

        // Any failure (401, network error, etc.) → redirect to login.
        const isAuthError =
          err instanceof ApiError
            ? err.status === 401
            : true;

        if (isAuthError) {
          setSessionState("unauthenticated");
          router.replace("/login");
        } else {
          // Non-auth error (network outage, etc.) — surface loading state
          // so the user can retry.  In production you'd show an error UI.
          setSessionState("loading");
        }
      }
    }

    initSession();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (sessionState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (sessionState === "unauthenticated") {
    // Router replace is in flight; render nothing while redirecting.
    return null;
  }

  return <>{children}</>;
}
