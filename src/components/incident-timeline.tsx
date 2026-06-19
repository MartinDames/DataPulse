"use client";

import { useRef, useState } from "react";
import { NoteAttachments } from "@/components/note-attachments";
import { TimeAgo } from "@/components/time-ago";
import type { ActivityAttachment, ActivityNote } from "@/lib/types";
import { ACTIVITY_ROLE_LABELS } from "@/lib/types";
import { compressImageFile } from "@/lib/image-compress";

function roleAccent(role: ActivityNote["role"]): string {
  switch (role) {
    case "system":
      return "var(--muted)";
    case "dba":
      return "var(--accent)";
    case "management":
      return "var(--status-warn)";
    default:
      return "var(--status-ok)";
  }
}

export function IncidentTimeline({
  activity,
  onAddNote,
}: {
  activity: ActivityNote[];
  onAddNote: (body: string, attachments?: ActivityAttachment[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [pendingAttachment, setPendingAttachment] =
    useState<ActivityAttachment | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sorted = [...activity].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const { dataUrl, name } = await compressImageFile(file);
      setPendingAttachment({
        id: `att-pending-${Date.now()}`,
        name,
        url: dataUrl,
        caption: "Captura adjunta (demo local)",
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Error al subir.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() && !pendingAttachment) return;
    onAddNote(
      draft.trim() || "Evidencia adjunta.",
      pendingAttachment ? [pendingAttachment] : undefined,
    );
    setDraft("");
    setPendingAttachment(null);
    setUploadError(null);
  }

  return (
    <section className="surface-card p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
        Actividad · seguimiento
      </div>
      <p className="pretty mt-1 text-xs text-[color:color-mix(in_oklch,var(--fg)_55%,var(--muted))]">
        Historial tipo ticket — texto, capturas y contexto para cerrar el incidente.
      </p>

      <ol className="mt-5 space-y-0">
        {sorted.map((entry, i) => (
          <li key={entry.id} className="relative flex gap-3 pb-5 last:pb-0">
            {i < sorted.length - 1 ? (
              <span
                className="absolute left-[7px] top-4 bottom-0 w-px bg-[color:color-mix(in_oklch,var(--border)_80%,transparent)]"
                aria-hidden
              />
            ) : null}
            <span
              className="relative z-[1] mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-[var(--card)]"
              style={{ background: roleAccent(entry.role) }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-medium text-sm text-[var(--fg)]">
                  {entry.author}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                  {ACTIVITY_ROLE_LABELS[entry.role]}
                </span>
                <TimeAgo iso={entry.createdAt} />
              </div>
              <p className="pretty mt-1 text-sm leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_82%,var(--muted))]">
                {entry.body}
              </p>
              {entry.attachments?.length ? (
                <NoteAttachments attachments={entry.attachments} />
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <form onSubmit={submit} className="mt-5 border-t border-[var(--border)] pt-4">
        <label
          htmlFor="activity-note"
          className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]"
        >
          Agregar nota
        </label>
        <textarea
          id="activity-note"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Ej: Verificado con operaciones — stock alineado."
          className="mt-2 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[color:color-mix(in_oklch,var(--accent)_40%,var(--border))] focus:outline-none focus:ring-1 focus:ring-[color:color-mix(in_oklch,var(--accent)_35%,transparent)]"
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="btn-ghost px-3 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            {uploading ? "Comprimiendo…" : "Adjuntar captura"}
          </button>
          {pendingAttachment ? (
            <button
              type="button"
              onClick={() => setPendingAttachment(null)}
              className="font-mono text-[10px] text-[var(--status-critical)] hover:underline"
            >
              Quitar imagen
            </button>
          ) : null}
        </div>

        {pendingAttachment ? (
          <div className="mt-2">
            <NoteAttachments attachments={[pendingAttachment]} />
          </div>
        ) : null}

        {uploadError ? (
          <p className="mt-2 text-xs text-[var(--status-critical)]">{uploadError}</p>
        ) : null}

        <p className="mt-2 font-mono text-[9px] leading-relaxed text-[var(--muted)]">
          Demo: la imagen se comprime y guarda en este navegador (~200 KB máx.).
        </p>

        <button
          type="submit"
          disabled={(!draft.trim() && !pendingAttachment) || uploading}
          className="btn-primary mt-3 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Guardar nota
        </button>
      </form>
    </section>
  );
}
