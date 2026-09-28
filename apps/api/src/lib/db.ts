/**
 * MongoDB / Mongoose connection.
 *
 * Exposes two functions:
 *   connectDB()    — call once on server startup, before listening.
 *   disconnectDB() — call on graceful shutdown.
 *
 * Connection lifecycle rules:
 * - A single shared connection is maintained per process.
 * - Mongoose buffers commands while the connection is re-establishing,
 *   so transient disconnects do not require application-level retry logic.
 * - The MONGODB_URI must never be logged.
 *
 * Model conventions are documented in lib/model.conventions.md.
 */

import mongoose from "mongoose";
import { env } from "../config/env";
import { logger } from "./logger";


// Stricten Mongoose behaviour: throw if a field is not in the schema.
mongoose.set("strictQuery", true);

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      // Prefer the newer Server Discovery and Monitoring engine.
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info({ message: "MongoDB connected", db: mongoose.connection.name });
  } catch (error) {
    logger.error({
      message: "MongoDB connection failed",
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Disconnection
// ---------------------------------------------------------------------------

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info({ message: "MongoDB disconnected" });
  } catch (error) {
    logger.error({
      message: "MongoDB disconnect error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// ---------------------------------------------------------------------------
// Connection event listeners
// ---------------------------------------------------------------------------

mongoose.connection.on("error", (error: Error) => {
  logger.error({
    message: "MongoDB connection error",
    error: error.message,
  });
});
