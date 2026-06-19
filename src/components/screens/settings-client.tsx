"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/context/app-context";
import type { DataHealthStore } from "@/lib/types";
import { exportStoreJson } from "@/lib/storage";

function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsText(file);
  });
}

export function SettingsClient() {
  const { store, replaceAll, resetToDemo } = useApp();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sample = useMemo(() => JSON.stringify(store, null, 2), [store]);

  async function onImport(file: File | null) {
    if (!file) return;
    setMessage(null);
    setBusy(true);
    try {
      const text = await readFileText(file);
      const next = JSON.parse(text) as DataHealthStore;
      if (!next || next.version !== 1) {
        throw new Error("JSON inválido o versión no soportada.");
      }
      replaceAll(next);
      setMessage("Store importado correctamente.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al importar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
          Configuración
        </h1>
        <p className="pretty text-sm text-[var(--muted)]">
          Exportá o importá el store demo. Reset para volver a datos de ejemplo.
        </p>
      </section>

      {message ? (
        <div className="surface-muted px-4 py-3 text-sm text-[var(--fg)]">
          {message}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-4">
          <div className="font-display text-sm font-semibold text-[var(--fg)]">
            Exportar store (JSON)
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Guardá una versión personalizada para otra PC o cliente.
          </p>
          <button
            onClick={() => exportStoreJson(store)}
            className="btn-ghost mt-4 px-4 py-2 text-sm font-medium"
          >
            Descargar JSON
          </button>
        </div>

        <div className="surface-card p-4">
          <div className="font-display text-sm font-semibold text-[var(--fg)]">
            Importar store (JSON)
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Reemplazá checks, fuentes y organización demo.
          </p>
          <label className="btn-primary mt-4 inline-block cursor-pointer px-4 py-2 text-sm font-medium">
            {busy ? "Importando…" : "Elegir archivo"}
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              disabled={busy}
              onChange={(e) => onImport(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </section>

      <section className="surface-card p-4">
        <div className="font-display text-sm font-semibold text-[var(--fg)]">
          Reset a demo
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Borra localStorage y vuelve a Distribuidora Norte S.A.
        </p>
        <button
          onClick={() => {
            resetToDemo();
            setMessage("Demo restaurada.");
          }}
          className="mt-4 rounded-full border border-[color:color-mix(in_oklch,var(--status-critical)_35%,var(--border))] bg-[color:color-mix(in_oklch,var(--status-critical)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--status-critical)]"
        >
          Restaurar datos demo
        </button>
      </section>

      <section className="surface-muted p-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
          Vista previa del store actual
        </div>
        <pre className="mt-2 max-h-48 overflow-auto rounded-xl bg-[var(--bg)] p-3 font-mono text-[10px] text-[color:color-mix(in_oklch,var(--fg)_70%,var(--muted))]">
          {sample.slice(0, 1200)}
          {sample.length > 1200 ? "\n…" : ""}
        </pre>
      </section>
    </div>
  );
}
