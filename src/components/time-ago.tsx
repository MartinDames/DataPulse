"use client";

import { useEffect, useState } from "react";
import { formatDateTime, formatRelative } from "@/lib/metrics";

/** Fechas relativas solo en cliente — evita hydration mismatch (Date.now / locale). */
export function TimeAgo({
  iso,
  className = "font-mono text-[10px] text-[var(--muted)]",
}: {
  iso: string;
  className?: string;
}) {
  const [text, setText] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    setText(formatRelative(iso));
    setTitle(formatDateTime(iso));
  }, [iso]);

  return (
    <span className={className} title={title ?? undefined}>
      {text ?? "—"}
    </span>
  );
}
