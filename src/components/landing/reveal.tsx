"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

export function Reveal({
  children,
  className = "",
  stagger = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={[
        stagger ? "landing-reveal-stagger" : "landing-reveal",
        visible ? "is-visible" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
