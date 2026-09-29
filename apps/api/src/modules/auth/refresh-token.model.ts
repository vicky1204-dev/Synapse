/**
 * RefreshToken model.
 *
 * Stores refresh tokens for authentication session management.
 * Tokens are rotated on each use and expired tokens are cleaned up.
 */

import { Schema, model } from "mongoose";
import type { IRefreshToken } from "./auth.types";

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ token: 1 }, { unique: true });
refreshTokenSchema.index({ expiresAt: 1 }); // For cleanup queries

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);
