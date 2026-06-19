"use client";

import { useCallback, useEffect, useState } from "react";
import type { ActivityAttachment } from "@/lib/types";

export function NoteAttachments({
  attachments,
}: {
  attachments: ActivityAttachment[];
}) {
  const [lightbox, setLightbox] = useState<ActivityAttachment | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close]);

  if (!attachments.length) return null;

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {attachments.map((att) => (
          <button
            key={att.id}
            type="button"
            onClick={() => setLightbox(att)}
            className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[oklch(0.11_0.022_258)] text-left transition hover:border-[color:color-mix(in_oklch,var(--accent)_35%,var(--border))] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_oklch,var(--accent)_40%,transparent)]"
          >
            <div className="relative h-[72px] w-[128px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={att.url}
                alt={att.caption ?? att.name}
                className="h-full w-full object-cover object-left-top opacity-90 transition group-hover:opacity-100"
              />
            </div>
            {att.caption ? (
              <div className="max-w-[128px] border-t border-[var(--border)] px-2 py-1.5 font-mono text-[9px] leading-snug text-[var(--muted)] group-hover:text-[color:color-mix(in_oklch,var(--fg)_70%,var(--muted))]">
                {att.caption}
              </div>
            ) : null}
          </button>
        ))}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[oklch(0.08_0.02_258/0.88)] p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption ?? lightbox.name}
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-[color:color-mix(in_oklch,var(--accent)_25%,var(--border))] bg-[var(--card)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
              <div className="min-w-0">
                <div className="truncate font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  Evidencia adjunta
                </div>
                <div className="truncate text-sm font-medium text-[var(--fg)]">
                  {lightbox.caption ?? lightbox.name}
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="btn-ghost shrink-0 px-3 py-1.5 text-xs font-medium"
              >
                Cerrar
              </button>
            </div>
            <div className="overflow-auto p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox.url}
                alt={lightbox.caption ?? lightbox.name}
                className="mx-auto max-h-[calc(90vh-5rem)] w-full max-w-3xl object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
