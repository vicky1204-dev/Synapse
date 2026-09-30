/**
 * Storage service.
 *
 * Supports Cloudinary cloud storage and local disk storage fallback.
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "../config/env";
import { logger } from "../lib/logger";

const hasCloudinary = Boolean(
  env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET,
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info("Cloudinary storage initialized successfully.");
} else {
  logger.info(
    "Cloudinary credentials not provided. Using local disk storage (/uploads).",
  );
}

export interface StoredFileResult {
  url: string;
  provider: "cloudinary" | "local";
  publicId: string;
  mimeType: string;
  sizeBytes: number;
}

export async function uploadFileToStorage(
  file: Express.Multer.File,
): Promise<StoredFileResult> {
  if (hasCloudinary && file.path) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "synapse/resources",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      });

      // Optionally clean up local temp file after uploading to Cloudinary
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (cleanupErr) {
        logger.warn("Could not delete local temp upload file", {
          path: file.path,
          error: cleanupErr,
        });
      }

      return {
        url: uploadResult.secure_url,
        provider: "cloudinary",
        publicId: uploadResult.public_id,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      };
    } catch (err) {
      logger.error("Cloudinary upload failed, falling back to local file", {
        error: err,
      });
      // Fall through to local fallback
    }
  }

  // Local fallback
  return {
    url: `/uploads/${file.filename}`,
    provider: "local",
    publicId: file.filename,
    mimeType: file.mimetype,
    sizeBytes: file.size,
  };
}
