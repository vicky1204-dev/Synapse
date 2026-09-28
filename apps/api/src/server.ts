/**
 * Server entry point.
 *
 * Responsible for:
 * - Loading environment variables
 * - Connecting to MongoDB
 * - Creating the HTTP server
 * - Binding to the configured port
 * - Graceful shutdown on SIGTERM / SIGINT
 *
 * Keep this file focused on process lifecycle.
 * Application logic lives in app.ts.
 */

import "dotenv/config";
import http from "http";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { connectDB, disconnectDB } from "./lib/db";
import { createApp } from "./app";

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

const app = createApp();
const server = http.createServer(app);

// Boot sequence: connect to MongoDB, then start accepting HTTP requests.
(async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    logger.info({
      message: "Synapse API started",
      port: env.PORT,
      env: env.NODE_ENV,
    });
  });
})();


// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------

/**
 * Gracefully shut down the HTTP server.
 *
 * Stops accepting new connections and waits for in-flight requests to
 * complete before exiting. This allows load balancers and orchestrators
 * to drain traffic cleanly.
 */
function shutdown(signal: string) {
  logger.info({ message: `Received ${signal}. Shutting down gracefully.` });

  server.close(async (err) => {
    if (err) {
      logger.error({ message: "Error during shutdown", error: err.message });
      process.exit(1);
    }

    await disconnectDB();
    logger.info({ message: "Server closed. Exiting." });
    process.exit(0);
  });

  // Force exit if graceful shutdown takes longer than 10 seconds.
  setTimeout(() => {
    logger.error({ message: "Shutdown timed out. Forcing exit." });
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Catch unhandled promise rejections — log and exit to surface bugs early.
process.on("unhandledRejection", (reason) => {
  logger.error({ message: "Unhandled rejection", reason });
  process.exit(1);
});
