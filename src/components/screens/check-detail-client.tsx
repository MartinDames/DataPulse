"use client";

import Link from "next/link";
import { IncidentStatusBadge } from "@/components/incident-status-badge";
import { IncidentTimeline } from "@/components/incident-timeline";
import { IncidentWorkflow } from "@/components/incident-workflow";
import { MiniSparkline } from "@/components/mini-sparkline";
import { SeverityBadge } from "@/components/severity-badge";
import { TechnicalLogPanel } from "@/components/technical-log-panel";
import { useApp } from "@/context/app-context";
import { CATEGORY_LABELS } from "@/lib/types";
import { TicketNumber } from "@/components/ticket-number";
import { TimeAgo } from "@/components/time-ago";

export function CheckDetailClient({ checkId }: { checkId: string }) {
  const {
    checksById,
    sourcesById,
    updateIncidentStatus,
    addActivityNote,
  } = useApp();
  const check = checksById[checkId];

  if (!check) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--muted)]">Check no encontrado.</p>
        <Link href="/alertas" className="text-sm text-[var(--accent)] hover:underline">
          ← Volver a alertas
        </Link>
      </div>
    );
  }

  const source = sourcesById[check.sourceId];
  const isOperational = check.status !== "ok";

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/alertas"
          className="font-mono text-[11px] uppercase tracking-wide text-[var(--accent)] hover:underline"
        >
          ← Alertas
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <TicketNumber number={check.ticketNumber} className="font-mono text-sm font-semibold tracking-wide text-[var(--accent)]" />
          <span className="text-[var(--border)]">·</span>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
            {check.name}
          </h1>
          <SeverityBadge status={check.status} />
          <IncidentStatusBadge status={check.incidentStatus} />
        </div>
        <p className="mt-1 font-mono text-xs text-[var(--muted)]">
          {check.code} · {CATEGORY_LABELS[check.category]}
          {check.status === "critical" ? (
            <span className="ml-2 text-[color:color-mix(in_oklch,var(--status-critical)_80%,var(--muted))]">
              · Equiv. operativo P1/P2
            </span>
          ) : check.status === "warn" ? (
            <span className="ml-2 text-[color:color-mix(in_oklch,var(--status-warn)_80%,var(--muted))]">
              · Equiv. operativo P3
            </span>
          ) : null}
        </p>
      </div>

      {isOperational ? (
        <section className="surface-card p-4">
          <IncidentWorkflow
            value={check.incidentStatus}
            onChange={(status) => updateIncidentStatus(check.id, status)}
          />
        </section>
      ) : null}

      {check.technicalLog ? (
        <TechnicalLogPanel log={check.technicalLog} />
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Tendencia (14 días)
          </div>
          <div className="mt-4">
            <MiniSparkline
              values={check.history}
              tone={check.status === "ok" ? "ok" : check.status}
            />
          </div>
          <p className="mt-4 font-mono text-[11px] text-[var(--muted)]">
            Detectado <TimeAgo iso={check.detectedAt} /> · {source?.name ?? check.sourceId}
          </p>
        </div>
        <div className="surface-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Resumen
          </div>
          <p className="pretty mt-3 text-sm leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_85%,var(--muted))]">
            {check.description}
          </p>
          {check.metadata ? (
            <dl className="mt-4 space-y-2">
              {Object.entries(check.metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-4 border-t border-[var(--border)] pt-2 font-mono text-xs"
                >
                  <dt className="text-[var(--muted)]">{key}</dt>
                  <dd className="font-medium text-[var(--fg)]">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[color:color-mix(in_oklch,var(--status-critical)_30%,var(--border))] bg-[color:color-mix(in_oklch,var(--status-critical)_8%,transparent)] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-critical)]">
            Impacto en el negocio
          </div>
          <p className="pretty mt-2 text-sm leading-relaxed text-[var(--fg)]">
            {check.impact}
          </p>
        </div>
        <div className="rounded-2xl border border-[color:color-mix(in_oklch,var(--status-ok)_30%,var(--border))] bg-[color:color-mix(in_oklch,var(--status-ok)_8%,transparent)] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-ok)]">
            Recomendación
          </div>
          <p className="pretty mt-2 text-sm leading-relaxed text-[var(--fg)]">
            {check.recommendation}
          </p>
        </div>
      </section>

      <IncidentTimeline
        activity={check.activity}
        onAddNote={(body, attachments) =>
          addActivityNote(check.id, body, attachments)
        }
      />
    </div>
  );
}
