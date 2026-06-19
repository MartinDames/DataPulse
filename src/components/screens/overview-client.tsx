"use client";

import Link from "next/link";
import { useMemo } from "react";
import { IncidentStatusBadge } from "@/components/incident-status-badge";
import { ScoreGauge } from "@/components/score-gauge";
import { SeverityBadge } from "@/components/severity-badge";
import { TicketNumber } from "@/components/ticket-number";
import { useApp } from "@/context/app-context";
import { CATEGORY_LABELS } from "@/lib/types";
import { TimeAgo } from "@/components/time-ago";
import { getHealthMetrics } from "@/lib/metrics";

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "ok" | "warn" | "critical" | "neutral";
}) {
  const toneVar =
    tone === "critical"
      ? "var(--status-critical)"
      : tone === "warn"
        ? "var(--status-warn)"
        : tone === "ok"
          ? "var(--status-ok)"
          : "var(--fg)";

  return (
    <div className="surface-card p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
        {label}
      </div>
      <div
        className="mt-1 font-display text-3xl font-semibold tracking-tight"
        style={{ color: toneVar }}
      >
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-[var(--muted)]">{hint}</div>
      ) : null}
    </div>
  );
}

export function OverviewClient() {
  const { store, sourcesById } = useApp();
  const metrics = useMemo(
    () => getHealthMetrics(store.checks),
    [store.checks],
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
          Overview
        </h1>
        <p className="pretty text-sm text-[var(--muted)]">
          {store.organization.name}
          <span className="mx-2 text-[var(--border)]">·</span>
          <span className="font-mono text-xs">{store.organization.plan}</span>
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
        <div className="surface-card flex items-center justify-center p-8">
          <ScoreGauge score={metrics.score} level={metrics.level} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Urgentes"
            value={`${metrics.byStatus.critical}`}
            hint="Acción inmediata"
            tone="critical"
          />
          <StatCard
            label="Prioritarios"
            value={`${metrics.byStatus.warn}`}
            hint="Revisar esta semana"
            tone="warn"
          />
          <StatCard
            label="OK"
            value={`${metrics.byStatus.ok}`}
            hint="Checks saludables"
            tone="ok"
          />
          <StatCard
            label="Abiertos"
            value={`${metrics.openIncidents}`}
            hint="Incidentes sin resolver"
            tone="neutral"
          />
          <StatCard
            label="En curso"
            value={`${metrics.inProgress}`}
            hint="Trabajo o verificación"
            tone="warn"
          />
        </div>
      </section>

      <section className="surface-card p-4">
        <div className="mb-3 font-display text-sm font-semibold text-[var(--fg)]">
          Fuentes de datos
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {store.dataSources.map((src) => (
            <div key={src.id} className="surface-muted p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--fg)]">
                    {src.name}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--muted)]">
                    Sync <TimeAgo iso={src.lastSyncAt} />
                  </div>
                </div>
                <SeverityBadge status={src.status} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div>
            <div className="font-display text-sm font-semibold text-[var(--fg)]">
              Últimos checks
            </div>
            <div className="text-xs text-[var(--muted)]">
              Ordenados por detección reciente
            </div>
          </div>
          <Link
            href="/alertas"
            className="font-mono text-[11px] uppercase tracking-wide text-[var(--accent)] hover:underline"
          >
            Ver todas →
          </Link>
        </div>
        <ul className="divide-y divide-[color:color-mix(in_oklch,var(--border)_60%,transparent)]">
          {metrics.recent.map((check) => (
            <li key={check.id}>
              <Link
                href={`/alertas/${check.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-[color:color-mix(in_oklch,white_3%,transparent)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <TicketNumber number={check.ticketNumber} className="font-mono text-[10px] text-[var(--accent)]" />
                    <span className="text-sm font-medium text-[var(--fg)]">
                      {check.name}
                    </span>
                    <SeverityBadge status={check.status} />
                    {check.status !== "ok" ? (
                      <IncidentStatusBadge status={check.incidentStatus} compact />
                    ) : null}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[11px] text-[var(--muted)]">
                    {CATEGORY_LABELS[check.category]} ·{" "}
                    {sourcesById[check.sourceId]?.name ?? check.sourceId}
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-[var(--muted)]">
                <TimeAgo iso={check.detectedAt} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
