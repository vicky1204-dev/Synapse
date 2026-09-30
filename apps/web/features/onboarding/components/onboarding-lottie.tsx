"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface OnboardingLottieProps {
  src: string;
  className?: string;
}

export function OnboardingLottie({ src, className }: OnboardingLottieProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={className ?? "flex h-44 w-full items-center justify-center"}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={
        className ??
        "flex h-44 w-full items-center justify-center overflow-hidden py-1"
      }
    >
      <DotLottieReact
        key={src}
        src={src}
        loop
        autoplay
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "180px",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
