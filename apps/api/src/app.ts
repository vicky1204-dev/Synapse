/**
 * Express application factory.
 *
 * Constructs and configures the Express application: middleware pipeline,
 * route mounting, and error handling boundary.
 *
 * Intentionally separated from server.ts (HTTP server + process lifecycle)
 * so the app can be imported in tests without binding to a port.
 */

import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { requestId } from "./middleware/request-id";
import { httpLogger } from "./middleware/http-logger";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";
import { v1Router } from "./routes/v1";

export function createApp() {
  const app = express();

  // Set security-related HTTP headers.
  app.use(helmet());

  // CORS — allow only configured origins.
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  
  // Attach a unique ID to every request for log correlation.
  app.use(requestId);

  // Structured HTTP request logging.
  app.use(httpLogger);

  // Parse JSON and URL-encoded request bodies.
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Parse cookies for authentication tokens.
  app.use(cookieParser());

  // Serve uploaded files statically
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.use("/api/v1", v1Router);

  // ---------------------------------------------------------------------------
  // Error boundary
  // ---------------------------------------------------------------------------

  // 404 for unmatched routes.
  app.use(notFound);

  // Global error handler — must be last and must have 4 parameters.
  app.use(errorHandler);

  return app;
}
