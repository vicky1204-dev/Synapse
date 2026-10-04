"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CourseFolderGraphicProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  className?: string;
  children?: React.ReactNode;
  showLightbulb?: boolean;
}

/**
 * Renders the custom tabbed folder graphic with peeking translucent document sheets.
 * Follows the Synapse course workspace visual design language.
 */
export function CourseFolderGraphic({
  color = "#525F8C",
  className,
  children,
  showLightbulb = false,
  ...props
}: CourseFolderGraphicProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[280/190] w-full select-none items-end justify-center overflow-visible",
        className,
      )}
      {...props}
    >
      <svg
        viewBox="0 0 280 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-[1.01]"
      >
        <defs>
          {/* Subtle gradient for paper sheets */}
          <linearGradient id="sheetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="sheetGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.5" />
          </linearGradient>

          {/* Front flap lighting */}
          <linearGradient id="flapHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* ── Peeking Paper Sheet 1 (back, tilted left) ── */}
        <g transform="rotate(-3.5 130 65)">
          <rect
            x="24"
            y="12"
            width="228"
            height="130"
            rx="14"
            fill="url(#sheetGrad2)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1.2"
            className="dark:opacity-30"
          />
        </g>

        {/* ── Peeking Paper Sheet 2 (middle, tilted right) ── */}
        <g transform="rotate(2 140 65)">
          <rect
            x="36"
            y="8"
            width="216"
            height="135"
            rx="14"
            fill="url(#sheetGrad1)"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="1.2"
            className="dark:opacity-40"
          />
        </g>

        {/* ── Front Folder Flap with tab on the right ── */}
        <g>
          {/* Base flap color */}
          <path
            d="M 16 52
               L 130 52
               C 144 52, 154 34, 168 34
               L 264 34
               Q 280 34, 280 50
               L 280 174
               Q 280 190, 264 190
               L 16 190
               Q 0 190, 0 174
               L 0 68
               Q 0 52, 16 52
               Z"
            fill={color}
          />

          {/* Subtle gradient overlay for depth */}
          <path
            d="M 16 52
               L 130 52
               C 144 52, 154 34, 168 34
               L 264 34
               Q 280 34, 280 50
               L 280 174
               Q 280 190, 264 190
               L 16 190
               Q 0 190, 0 174
               L 0 68
               Q 0 52, 16 52
               Z"
            fill="url(#flapHighlight)"
          />

          {/* Top highlight border stroke */}
          <path
            d="M 16 52
               L 130 52
               C 144 52, 154 34, 168 34
               L 264 34"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Optional decorative lightbulb accent on top-right area */}
        {showLightbulb && (
          <g transform="translate(254, 12)">
            <circle cx="8" cy="8" r="9" fill="rgba(255,255,255,0.7)" />
            <path
              d="M 6 5 A 2.5 2.5 0 0 1 10 5 C 10 6.5, 9 7.2, 9 8 L 7 8 C 7 7.2, 6 6.5, 6 5 Z M 7 9 L 9 9"
              stroke="#64748B"
              strokeWidth="1"
              fill="none"
            />
          </g>
        )}
      </svg>

      {/* Interactive / overlay children on top of the front flap */}
      {children && (
        <div className="absolute inset-x-0 bottom-0 top-[30%] flex flex-col justify-end p-3.5 sm:p-4">
          {children}
        </div>
      )}
    </div>
  );
}
