"use client";

import { useState, useRef } from "react";
import {
  FileTextIcon,
  XIcon,
  AlertCircleIcon,
  FolderUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  maxSizeBytes?: number; // default 50MB
}

export function FileDropzone({
  selectedFile,
  onFileSelect,
  maxSizeBytes = 50 * 1024 * 1024,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectFile = (file: File) => {
    setErrorMessage(null);

    // Validate size limit (50MB)
    if (file.size > maxSizeBytes) {
      setErrorMessage("File exceeds the 50 MB size limit.");
      return;
    }

    // Supported formats: PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), Markdown (.md)
    const validExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".md",
      ".markdown",
      ".txt",
    ];
    const fileName = file.name.toLowerCase();
    const isSupported = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isSupported) {
      setErrorMessage(
        "Unsupported format. Please upload a PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), or Markdown (.md) file.",
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSelectFile(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        validateAndSelectFile(file);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.md,.markdown,.txt"
        onChange={handleFileInputChange}
      />

      {selectedFile ? (
        <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background shadow-xs text-primary">
              <FileTextIcon className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-foreground">
                {selectedFile.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFileSelect(null)}
            className="size-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-3.5 rounded-3xl p-10 md:p-12 text-center cursor-pointer transition-all duration-200",
            "bg-[#F0F7FB] dark:bg-muted/30 border border-transparent hover:border-border/60",
            isDragOver && "scale-[0.99] border-primary/40 bg-[#E8F3F9] dark:bg-muted/50",
          )}
        >
          {/* Circular Icon badge */}
          <div className="flex size-14 items-center justify-center rounded-full bg-white dark:bg-background shadow-xs text-muted-foreground">
            <FolderUpIcon className="size-6 text-foreground/80" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Drop a PDF or document here
            </h3>
            <p className="text-xs text-muted-foreground">
              or select one from your computer
            </p>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-neutral-800 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90"
          >
            Choose File
          </button>
        </div>
      )}

      {/* Format & Size Legend */}
      <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground px-1">
        <span>Supported format: PDF, DOC, PPT, MD</span>
        <span>Maximum file size: 50 MB</span>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-2.5 text-xs text-destructive">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
