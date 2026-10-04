"use client";

import { useState, useEffect, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Spinner } from "@/components/ui/spinner";
import { resolveFileUrl } from "../utils";

/**
 * Resource viewer that adapts to resource type:
 * - pdf  → native browser PDF viewer with object/iframe embed
 * - note → fetches markdown text, renders with react-markdown + GFM
 * - link → <iframe> embed with sandbox
 * - word/ppt → graceful fallback with download link (no in-browser renderer)
 */

interface ResourceViewerProps {
  type: "pdf" | "word" | "ppt" | "note" | "link";
  url?: string;
  title: string;
}

// ---------------------------------------------------------------------------
// Markdown viewer — fetches raw content and renders with react-markdown
// ---------------------------------------------------------------------------

function MarkdownContent({ url, title }: { url: string; title: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const resolvedUrl = resolveFileUrl(url);

  useEffect(() => {
    let cancelled = false;

    fetch(resolvedUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch markdown");
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedUrl]);

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          Could not load the markdown content.
        </p>
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-foreground dark:text-background"
        >
          Open raw file
        </a>
      </div>
    );
  }

  if (content === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-8 py-10">
        <article className="prose prose-sm prose-neutral dark:prose-invert max-w-none [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border/60 [&_pre]:bg-muted/50 [&_pre]:p-4 [&_code]:rounded [&_code]:bg-muted/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.8em] [&_blockquote]:border-l-primary/40 [&_table]:overflow-hidden [&_table]:rounded-xl [&_thead]:bg-muted/50">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PDF viewer — browser native with toolbar and fallback
// ---------------------------------------------------------------------------

function PdfViewer({ url, title }: { url: string; title: string }) {
  const resolvedUrl = resolveFileUrl(url);
  const isExternal =
    resolvedUrl.startsWith("http://") || resolvedUrl.startsWith("https://");
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resolvedUrl)}&embedded=true`;

  return (
    <div className="relative flex h-full w-full flex-col bg-muted/10">
      {isExternal && (
        <div className="flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-1.5 text-xs backdrop-blur-xs">
          <span className="max-w-[200px] truncate text-muted-foreground sm:max-w-xs">
            {title}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUseGoogleViewer((prev) => !prev)}
              className="cursor-pointer text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              {useGoogleViewer
                ? "Switch to Native Viewer"
                : "Having trouble? Try Google Docs Viewer"}
            </button>
            <span className="text-border">|</span>
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Direct Link ↗
            </a>
          </div>
        </div>
      )}

      <div className="relative min-h-0 flex-1">
        {useGoogleViewer ? (
          <iframe
            src={googleViewerUrl}
            title={title}
            className="h-full w-full border-none"
          />
        ) : (
          <object
            data={`${resolvedUrl}#toolbar=1&view=FitH`}
            type="application/pdf"
            className="h-full w-full border-none"
            title={title}
          >
            <iframe
              src={`${resolvedUrl}#toolbar=1&view=FitH`}
              title={title}
              className="h-full w-full border-none"
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">
                  Unable to preview this PDF directly in the browser.
                </p>
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-foreground dark:text-background"
                >
                  Open PDF in new tab
                </a>
              </div>
            </iframe>
          </object>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Link embed — sandboxed iframe
// ---------------------------------------------------------------------------

function LinkEmbed({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-2xl">
          🌐
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">
            This page cannot be embedded due to security restrictions.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-foreground dark:text-background"
        >
          Open in new tab
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title={title}
      className="h-full w-full border-none"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

// ---------------------------------------------------------------------------
// Unsupported type (Word / PPT) — download fallback
// ---------------------------------------------------------------------------

function UnsupportedViewer({
  type,
  url,
  title,
}: {
  type: string;
  url?: string;
  title: string;
}) {
  const emoji = type === "word" ? "📄" : type === "ppt" ? "📊" : "📁";
  const description =
    type === "word"
      ? "Word documents cannot be previewed in the browser."
      : type === "ppt"
        ? "PowerPoint files cannot be previewed in the browser."
        : "This file type cannot be previewed.";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-2xl">
        {emoji}
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {url && (
        <a
          href={resolveFileUrl(url)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-foreground dark:text-background"
        >
          Download / Open
        </a>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// No content state
// ---------------------------------------------------------------------------

function NoContent({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-xl">
        📭
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          No file or URL is associated with this resource.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported viewer
// ---------------------------------------------------------------------------

export function ResourceViewer({ type, url, title }: ResourceViewerProps) {
  if (!url) {
    return <NoContent title={title} />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Spinner className="size-6 text-primary" />
        </div>
      }
    >
      {type === "pdf" && <PdfViewer url={url} title={title} />}
      {type === "note" && <MarkdownContent url={url} title={title} />}
      {type === "link" && <LinkEmbed url={url} title={title} />}
      {(type === "word" || type === "ppt") && (
        <UnsupportedViewer type={type} url={url} title={title} />
      )}
    </Suspense>
  );
}
