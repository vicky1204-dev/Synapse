/**
 * Auth feature — mutations.
 *
 * TanStack Query mutation hooks for login, register, and logout.
 *
 * Pattern:
 * - Call the API function.
 * - On success: update the auth store, then invalidate the `me` query so the
 *   cache reflects the latest user data.
 * - On error: the normalised ApiError is surfaced through `mutation.error`.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, logout } from "./api";
import { authKeys } from "./keys";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginRequest, RegisterRequest } from "./types";

// ---------------------------------------------------------------------------
// useLogin
// ---------------------------------------------------------------------------

export function useLogin() {
  const qc = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    onSuccess: (data) => {
      setSession(data.accessToken, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        avatarUrl: data.user.avatarUrl,
        onboardingStatus: data.user.onboardingStatus,
      });
      // Populate the me cache immediately.
      qc.setQueryData(authKeys.me(), data.user);
    },
  });
}

// ---------------------------------------------------------------------------
// useRegister
// ---------------------------------------------------------------------------

export function useRegister() {
  const qc = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (body: RegisterRequest) => register(body),
    onSuccess: (data) => {
      setSession(data.accessToken, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        avatarUrl: data.user.avatarUrl,
        onboardingStatus: data.user.onboardingStatus,
      });
      qc.setQueryData(authKeys.me(), data.user);
    },
  });
}

// ---------------------------------------------------------------------------
// useLogout
// ---------------------------------------------------------------------------

export function useLogout() {
  const qc = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      // Always clear local state even if the server request fails.
      clearSession();
      qc.removeQueries({ queryKey: authKeys.all });
    },
  });
}
