/**
 * Auth feature — types.
 *
 * Frontend-facing types for authentication.
 * Mirrors the backend `UserResponse` and `AuthResponse` DTOs.
 */

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export type OnboardingStatus = "pending" | "completed";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  onboardingStatus: OnboardingStatus;
  academicProfile?: {
    program?: string;
    year?: number;
    institution?: string;
  };
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export interface AuthData {
  user: User;
  accessToken: string;
}
