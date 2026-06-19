"use client";

import { useMemo } from "react";
import { SeverityBadge } from "@/components/severity-badge";
import { TicketNumber } from "@/components/ticket-number";
import { useApp } from "@/context/app-context";
import { CATEGORY_LABELS } from "@/lib/types";
import { getHealthMetrics, levelLabel } from "@/lib/metrics";

export function InformeClient() {
  const { store } = useApp();
  const metrics = useMemo(
    () => getHealthMetrics(store.checks),
    [store.checks],
  );

  const issues = store.checks.filter((c) => c.status !== "ok");
  const critical = issues.filter((c) => c.status === "critical");
  const warnings = issues.filter((c) => c.status === "warn");

  const reportDate = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Informe ejecutivo
          </h1>
          <p className="pretty text-sm text-[var(--muted)]">
            Resumen de 1 página para gerencia — imprimible o PDF desde el navegador.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-primary px-4 py-2 text-sm font-medium"
        >
          Imprimir / Guardar PDF
        </button>
      </div>

      <article
        className="rounded-2xl border border-[var(--border)] p-8 shadow-sm print:border-black/20 print:bg-[var(--cream)] print:text-[#191919] print:shadow-none"
        style={{ background: "var(--cream)", color: "#191919" }}
      >
        <header className="border-b border-black/10 pb-6 print:border-black/20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b6560]">
                DataPulse · Diagnóstico de salud de datos
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#191919]">
                {store.organization.name}
              </h2>
              <p className="mt-1 text-sm text-[#5c5752]">
                Informe generado el {reportDate}
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-4xl font-semibold text-[#191919]">
                {metrics.score}
                <span className="text-lg text-[#6b6560]">/100</span>
              </div>
              <div className="text-sm font-medium text-[#3d3a36]">
                {levelLabel(metrics.level)}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#6b6560]">
            Resumen ejecutivo
          </h3>
          <p className="pretty mt-2 text-sm leading-relaxed text-[#2a2826]">
            Se detectaron{" "}
            <strong>{critical.length} hallazgos críticos</strong> y{" "}
            <strong>{warnings.length} advertencias</strong> en{" "}
            {store.dataSources.length} fuentes de datos. El score global de{" "}
            {metrics.score} indica riesgo operativo: problemas de backup,
            integridad y sincronización Excel/ERP pueden generar pérdidas antes
            de que el equipo las note.
          </p>
        </section>

        <section className="mt-6">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#6b6560]">
            Prioridad inmediata (críticos)
          </h3>
          <ol className="mt-3 space-y-3">
            {critical.map((c, i) => (
              <li key={c.id} className="text-sm text-[#2a2826]">
                <span className="font-mono text-xs font-medium text-[#4a5568]">
                  {c.ticketNumber}
                </span>
                {" · "}
                <span className="font-semibold text-[#191919]">
                  {i + 1}. {c.name}
                </span>
                <span className="text-[#5c5752]"> — {c.impact}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#6b6560]">
            Detalle de hallazgos
          </h3>
          <table className="mt-3 w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-[#6b6560]">
                <th className="py-2 pr-2">Ticket</th>
                <th className="py-2 pr-2">Check</th>
                <th className="py-2 pr-2">Categoría</th>
                <th className="py-2 pr-2">Estado</th>
                <th className="py-2">Recomendación</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((c) => (
                <tr key={c.id} className="border-b border-black/5">
                  <td className="py-2 pr-2 font-mono text-[11px] font-medium text-[#4a5568]">
                    {c.ticketNumber}
                  </td>
                  <td className="py-2 pr-2 font-medium text-[#191919]">{c.name}</td>
                  <td className="py-2 pr-2 text-[#5c5752]">
                    {CATEGORY_LABELS[c.category]}
                  </td>
                  <td className="py-2 pr-2">
                    <SeverityBadge status={c.status} />
                  </td>
                  <td className="py-2 text-[#3d3a36]">{c.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="mt-8 border-t border-black/10 pt-4 text-xs text-[#6b6560] print:border-black/20">
          <p>
            Próximo paso sugerido: <strong>Piloto diagnóstico 7 días</strong>
            — revisión completa, informe ampliado y plan de remediación.
          </p>
          <p className="mt-1">DataPulse · DamesSystems · Demo comercial</p>
        </footer>
      </article>
    </div>
  );
}
