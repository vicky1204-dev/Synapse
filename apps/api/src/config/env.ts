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

  /**
   * Comma-separated list of allowed CORS origins.
   * Example: http://localhost:3000,https://synapse.app
   */
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:3000")
    .transform((val) => val.split(",").map((o) => o.trim())),
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error(
    "❌  Invalid environment variables:\n",
    _parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const env = _parsed.data;
export type Env = typeof env;
