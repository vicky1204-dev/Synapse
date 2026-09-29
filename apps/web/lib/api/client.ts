/**
 * Central API client.
 *
 * All requests to the Synapse Express API go through this module.
 *
 * Design decisions:
 * - `ky` is a small, modern fetch wrapper with hook support.
 * - The base URL is driven by NEXT_PUBLIC_API_URL (required).
 * - Credentials (cookies) are always sent — the refresh token lives in an
 *   HTTP-only cookie managed by the server.
 * - The access token is injected via a `beforeRequest` hook that reads from
 *   the Zustand auth store. The store is imported lazily to avoid cycles.
 * - On a 401 response, the client attempts one silent refresh, updates the
 *   store, and retries the original request once.
 * - API errors are normalised to `ApiError` so callers branch on `code`.
 */

import ky from "ky";
import type {
  BeforeRequestHook,
  AfterResponseHook,
} from "ky";
import { ApiError, type ApiErrorResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!API_BASE_URL && typeof window === "undefined") {
  console.warn("[api-client] NEXT_PUBLIC_API_URL is not set.");
}

// ---------------------------------------------------------------------------
// Token injection
// ---------------------------------------------------------------------------

const injectAccessToken: BeforeRequestHook = async ({ request }) => {
  const { useAuthStore } = await import("@/stores/auth.store");
  const token = useAuthStore.getState().accessToken;
  if (token) {
    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return new Request(request, { headers });
  }
};

// ---------------------------------------------------------------------------
// Silent token refresh on 401
// ---------------------------------------------------------------------------

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function silentRefresh(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await ky
        .post(`${API_BASE_URL}/api/v1/auth/refresh`, {
          credentials: "include",
        })
        .json<{ success: true; data: { accessToken: string } }>();

      const { useAuthStore } = await import("@/stores/auth.store");
      useAuthStore.getState().setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch {
      const { useAuthStore } = await import("@/stores/auth.store");
      useAuthStore.getState().clearSession();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

const handleUnauthorized: AfterResponseHook = async ({ request, response }) => {
  if (response.status !== 401) return;

  const newToken = await silentRefresh();
  if (!newToken) return;

  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${newToken}`);
  return ky(new Request(request, { headers }));
};

// ---------------------------------------------------------------------------
// Error normalisation
// ---------------------------------------------------------------------------

const normaliseError: AfterResponseHook = async ({ response }) => {
  if (response.ok) return;

  let code = "UNKNOWN_ERROR";
  let message = response.statusText || "An unexpected error occurred.";

  try {
    const body = (await response.clone().json()) as ApiErrorResponse;
    if (!body.success && body.error) {
      code = body.error.code;
      message = body.error.message;
    }
  } catch {
    // Body is not JSON — keep defaults.
  }

  throw new ApiError(code, response.status, message);
};

// ---------------------------------------------------------------------------
// Client instance
// ---------------------------------------------------------------------------

export const apiClient = ky.create({
  baseUrl: API_BASE_URL,
  credentials: "include",
  hooks: {
    beforeRequest: [injectAccessToken],
    afterResponse: [handleUnauthorized, normaliseError],
  },
  retry: 0, // Manual retry logic above.
});
