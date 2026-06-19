export function TechnicalLogPanel({ log }: { log: string }) {
  if (!log) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-[color:color-mix(in_oklch,var(--accent)_22%,var(--border))] bg-[oklch(0.11_0.022_258)]">
      <div className="flex items-center justify-between gap-2 border-b border-[color:color-mix(in_oklch,var(--border)_90%,transparent)] px-4 py-2.5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
          Evidencia técnica
        </div>
        <span className="font-mono text-[10px] text-[var(--muted)]">
          log · read-only
        </span>
      </div>
      <pre className="max-h-64 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_78%,var(--accent-2))] whitespace-pre-wrap break-words">
        {log}
      </pre>
    </section>
  );
}
