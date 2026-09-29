/**
 * Auth Zustand store.
 *
 * Owns client-side session state:
 * - accessToken: the short-lived JWT kept in memory (never in localStorage).
 * - user: the current user snapshot, populated after session initialisation.
 *
 * This is deliberately minimal. Server state (full user data, session validity)
 * lives in TanStack Query. This store only holds what the API client needs to
 * attach the Authorization header and what the layout needs to gate routes.
 */

"use client";

import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  onboardingStatus: "pending" | "completed";
}

interface AuthState {
  accessToken: string | null;
  user: SessionUser | null;

  // Actions
  setSession: (accessToken: string, user: SessionUser) => void;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,

  setSession: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearSession: () => set({ accessToken: null, user: null }),
}));
