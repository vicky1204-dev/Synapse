/**
 * HTTP request logger middleware.
 *
 * Uses Morgan to produce structured log lines that include the request ID
 * so every HTTP event can be correlated with application logs.
 */

import morgan from "morgan";
import type { Request, Response } from "express";
import { logger } from "../lib/logger";
import { env } from "../config/env";

// Write Morgan output through Winston so all log lines go to one stream.
const stream = {
  write: (message: string) => logger.http(message.trimEnd()),
};

// Include the request ID in every log line.
morgan.token("id", (req: Request) => req.id);

const format =
  env.NODE_ENV === "production"
    ? ":id :method :url :status :res[content-length] - :response-time ms"
    : ":id :method :url :status - :response-time ms";

export const httpLogger = morgan(format, { stream });
