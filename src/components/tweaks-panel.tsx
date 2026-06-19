"use client";

import { useEffect, useMemo, useState } from "react";
import type { Accent, Density, UiPrefs } from "@/lib/ui-prefs";
import { applyUiPrefsToDom, loadUiPrefs, saveUiPrefs } from "@/lib/ui-prefs";

export function TweaksPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [prefs, setPrefs] = useState<UiPrefs>(() => loadUiPrefs());

  useEffect(() => {
    applyUiPrefsToDom(prefs);
    saveUiPrefs(prefs);
  }, [prefs]);

  const density: Density = prefs.density;
  const accent: Accent = prefs.accent;

  const containerClass = useMemo(() => {
    return [
      "fixed inset-0 z-50",
      open ? "pointer-events-auto" : "pointer-events-none",
    ].join(" ");
  }, [open]);

  return (
    <div className={containerClass} aria-hidden={!open}>
      <div
        className={[
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />
      <aside
        className={[
          "absolute right-0 top-0 h-full w-[360px] max-w-[92vw] border-l border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div className="min-w-0">
            <div className="font-display text-sm font-semibold text-[var(--fg)]">
              Tweaks
            </div>
            <div className="text-xs text-[var(--muted)]">
              Variantes para demo comercial
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost px-3 py-1.5 text-xs font-medium">
            Cerrar
          </button>
        </div>

        <div className="space-y-4 p-4">
          <section className="surface-muted p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
              Densidad
            </div>
            <div className="mt-3 flex gap-2">
              {(["comfortable", "compact"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setPrefs((p) => ({ ...p, density: d }))}
                  className={[
                    "h-9 flex-1 rounded-xl border px-3 text-sm font-medium transition-colors",
                    density === d
                      ? "border-[color:color-mix(in_oklch,var(--accent)_40%,var(--border))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--card))] text-[var(--fg)]"
                      : "border-[var(--border)] bg-transparent text-[var(--muted)] hover:text-[var(--fg)]",
                  ].join(" ")}
                >
                  {d === "comfortable" ? "Confort" : "Compacto"}
                </button>
              ))}
            </div>
          </section>

          <section className="surface-muted p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
              Acento
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(
                [
                  ["cobalt", "Cobalto"],
                  ["terra", "Terracota"],
                  ["signal", "Señal"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setPrefs((p) => ({ ...p, accent: id }))}
                  className={[
                    "h-9 rounded-xl border px-2 text-xs font-medium transition-colors",
                    accent === id
                      ? "border-[color:color-mix(in_oklch,var(--accent)_40%,var(--border))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--card))] text-[var(--fg)]"
                      : "border-[var(--border)] bg-transparent text-[var(--muted)] hover:text-[var(--fg)]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="pretty mt-3 text-xs text-[var(--muted)]">
              Cambiá el acento en vivo para que parezca del cliente en 10 segundos.
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}
