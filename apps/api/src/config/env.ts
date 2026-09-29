/**
 * Environment configuration.
 *
 * All process.env access goes through this module.
 * Never read process.env directly in application code.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(4000),

  /** MongoDB connection string. Never log this value. */
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  /**
   * Comma-separated list of allowed CORS origins.
   * Example: http://localhost:3000,https://synapse.app
   */
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:3000")
    .transform((val) => val.split(",").map((o) => o.trim())),

  /** JWT secret for access tokens. Never log this value. */
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  /** JWT secret for refresh tokens. Never log this value. */
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  /** Access token expiration (e.g., "15m", "1h") */
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  /** Refresh token expiration (e.g., "7d", "30d") */
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  // eslint-disable-next-line no-console
  console.error(
    "Invalid environment variables:\n",
    _parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const env = _parsed.data;
export type Env = typeof env;
