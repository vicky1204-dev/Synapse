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
import { useAuthStore, type SessionUser } from "@/stores/auth.store";
import ky from "ky";

type SessionState = "loading" | "authenticated" | "unauthenticated";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

let inFlightSessionPromise: Promise<{
  accessToken: string;
  user: SessionUser;
} | null> | null = null;

async function checkSession(): Promise<{
  accessToken: string;
  user: SessionUser;
} | null> {
  if (inFlightSessionPromise) return inFlightSessionPromise;

  inFlightSessionPromise = (async () => {
    try {
      const res = await ky
        .post(`${API_BASE_URL}/api/v1/auth/refresh`, {
          credentials: "include",
        })
        .json<{
          success: true;
          data: {
            user: SessionUser;
            accessToken: string;
          };
        }>();

      return {
        accessToken: res.data.accessToken,
        user: {
          id: res.data.user.id,
          email: res.data.user.email,
          name: res.data.user.name,
          avatarUrl: res.data.user.avatarUrl,
          onboardingStatus: res.data.user.onboardingStatus,
        },
      };
    } catch {
      return null;
    } finally {
      inFlightSessionPromise = null;
    }
  })();

  return inFlightSessionPromise;
}

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const storeAccessToken = useAuthStore((s) => s.accessToken);
  const storeUser = useAuthStore((s) => s.user);
  const isAlreadyAuthed = Boolean(storeAccessToken && storeUser);

  const [sessionState, setSessionState] = useState<SessionState>(
    isAlreadyAuthed ? "authenticated" : "loading",
  );
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    // If the session is already established in memory (e.g. after login/register),
    // skip silent refresh entirely.
    if (isAlreadyAuthed) {
      return;
    }

    let isMounted = true;

    checkSession().then((session) => {
      if (!isMounted) return;

      if (session) {
        setSession(session.accessToken, session.user);
        setSessionState("authenticated");
      } else {
        setSessionState("unauthenticated");
        router.replace("/login");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isAlreadyAuthed, router, setSession]);

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
