/**
 * Upload middleware.
 *
 * Configures multer for file uploads with size and MIME type restrictions.
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { BadRequestError } from "./error-handler";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `resource-${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".md",
  ".markdown",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
]);

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIME_TYPES.has(file.mimetype) || ALLOWED_EXTENSIONS.has(ext)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError(
          `Unsupported file format: ${file.originalname}. Only PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), and Markdown (.md) are supported.`,
          "UNSUPPORTED_FILE_TYPE",
        ),
      );
    }
  },
});
