"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IncidentStatusBadge } from "@/components/incident-status-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { TicketNumberLink } from "@/components/ticket-number";
import { TicketSearchBar } from "@/components/ticket-search-bar";
import { TimeAgo } from "@/components/time-ago";
import { useApp } from "@/context/app-context";
import type { CheckCategory, CheckStatus, IncidentStatus } from "@/lib/types";
import { CATEGORY_LABELS, INCIDENT_STATUS_LABELS } from "@/lib/types";
import { isIncidentOpen } from "@/lib/metrics";
import { searchTickets } from "@/lib/ticket-search";

export function AlertasClient() {
  const { store, sourcesById, updateIncidentStatus } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const qFromUrl = searchParams.get("q") ?? "";

  const [statusFilter, setStatusFilter] = useState<CheckStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CheckCategory | "all">(
    "all",
  );
  const [incidentFilter, setIncidentFilter] = useState<
    IncidentStatus | "all" | "open"
  >("all");
  const [searchQuery, setSearchQuery] = useState(qFromUrl);

  useEffect(() => {
    setSearchQuery(qFromUrl);
  }, [qFromUrl]);

  const filtered = useMemo(() => {
    let list = store.checks
      .filter((c) => statusFilter === "all" || c.status === statusFilter)
      .filter((c) => categoryFilter === "all" || c.category === categoryFilter)
      .filter((c) => {
        if (incidentFilter === "all") return true;
        if (incidentFilter === "open") return isIncidentOpen(c);
        return c.incidentStatus === incidentFilter;
      });

    list = searchTickets(list, searchQuery);

    return list.sort(
      (a, b) =>
        new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime(),
    );
  }, [
    store.checks,
    statusFilter,
    categoryFilter,
    incidentFilter,
    searchQuery,
  ]);

  function applySearch(q: string) {
    setSearchQuery(q);
    const trimmed = q.trim();
    if (trimmed) {
      router.replace(`/alertas?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.replace("/alertas");
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--fg)]">
          Tickets / Alertas
        </h1>
        <p className="pretty text-sm text-[var(--muted)]">
          Incidentes numerados (INC), severidad, seguimiento operativo y evidencia.
        </p>
      </section>

      <section className="sm:hidden">
        <TicketSearchBar compact />
      </section>

      <section className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="alertas-search"
            className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]"
          >
            Buscar en esta lista
          </label>
          <input
            id="alertas-search"
            type="search"
            value={searchQuery}
            onChange={(e) => applySearch(e.target.value)}
            placeholder="INC004818, backup, duplicados…"
            className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[color:color-mix(in_oklch,var(--accent)_40%,var(--border))] focus:outline-none focus:ring-1 focus:ring-[color:color-mix(in_oklch,var(--accent)_35%,transparent)]"
          />
        </div>
        {searchQuery ? (
          <button
            type="button"
            onClick={() => applySearch("")}
            className="btn-ghost shrink-0 px-3 py-2 text-xs font-medium"
          >
            Limpiar búsqueda
          </button>
        ) : null}
      </section>

      <section className="flex flex-wrap gap-2">
        {(["all", "critical", "warn", "ok"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={[
              "rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors",
              statusFilter === s
                ? "border-[color:color-mix(in_oklch,var(--accent)_40%,var(--border))] bg-[color:color-mix(in_oklch,var(--accent)_12%,transparent)] text-[var(--fg)]"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]",
            ].join(" ")}
          >
            {s === "all"
              ? "Todos"
              : s === "critical"
                ? "Urgentes"
                : s === "warn"
                  ? "Prioritarios"
                  : "OK"}
          </button>
        ))}
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as CheckCategory | "all")
          }
          className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 font-mono text-[11px] text-[var(--muted)]"
        >
          <option value="all">Todas las categorías</option>
          {(Object.keys(CATEGORY_LABELS) as CheckCategory[]).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        <select
          value={incidentFilter}
          onChange={(e) =>
            setIncidentFilter(e.target.value as IncidentStatus | "all" | "open")
          }
          className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 font-mono text-[11px] text-[var(--muted)]"
        >
          <option value="all">Todos los estados</option>
          <option value="open">Abiertos</option>
          {(Object.keys(INCIDENT_STATUS_LABELS) as IncidentStatus[]).map(
            (st) => (
              <option key={st} value={st}>
                {INCIDENT_STATUS_LABELS[st]}
              </option>
            ),
          )}
        </select>
      </section>

      {searchQuery ? (
        <p className="font-mono text-[11px] text-[var(--muted)]">
          {filtered.length} resultado{filtered.length === 1 ? "" : "s"} para «
          {searchQuery}»
        </p>
      ) : null}

      <section className="space-y-3">
        {filtered.map((check) => (
          <article key={check.id} className="surface-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <TicketNumberLink check={check} />
                  {check.status !== "ok" ? (
                    <IncidentStatusBadge status={check.incidentStatus} compact />
                  ) : (
                    <IncidentStatusBadge status="resolved" compact />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/alertas/${check.id}`}
                    className="font-display text-sm font-semibold text-[var(--fg)] hover:text-[var(--accent)]"
                  >
                    {check.name}
                  </Link>
                  <SeverityBadge status={check.status} />
                </div>
                <p className="pretty mt-2 text-sm leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_75%,var(--muted))]">
                  {check.description}
                </p>
                {check.technicalLog ? (
                  <pre className="mt-3 max-h-20 overflow-hidden rounded-lg border border-[var(--border)] bg-[oklch(0.11_0.022_258)] px-3 py-2 font-mono text-[10px] leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_65%,var(--muted))] whitespace-pre-wrap">
                    {check.technicalLog.split("\n").slice(0, 3).join("\n")}
                    {check.technicalLog.includes("\n") ? "\n…" : ""}
                  </pre>
                ) : null}
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <div className="rounded-xl border border-[color:color-mix(in_oklch,var(--status-critical)_25%,var(--border))] bg-[color:color-mix(in_oklch,var(--status-critical)_8%,transparent)] p-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-critical)]">
                      Impacto
                    </div>
                    <p className="pretty mt-1 text-xs leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_80%,var(--muted))]">
                      {check.impact}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[color:color-mix(in_oklch,var(--status-ok)_25%,var(--border))] bg-[color:color-mix(in_oklch,var(--status-ok)_8%,transparent)] p-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-ok)]">
                      Recomendación
                    </div>
                    <p className="pretty mt-1 text-xs leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_80%,var(--muted))]">
                      {check.recommendation}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-[var(--muted)]">
                  <span>{CATEGORY_LABELS[check.category]}</span>
                  <span>·</span>
                  <span>{sourcesById[check.sourceId]?.name}</span>
                  <span>·</span>
                  <TimeAgo iso={check.detectedAt} />
                  <span>·</span>
                  <span>−{check.scoreImpact} pts</span>
                  {check.activity.length > 0 ? (
                    <>
                      <span>·</span>
                      <span>{check.activity.length} notas</span>
                    </>
                  ) : null}
                </div>
              </div>
              {check.status !== "ok" && check.incidentStatus === "new" ? (
                <button
                  onClick={() => updateIncidentStatus(check.id, "in_progress")}
                  className="btn-ghost shrink-0 px-3 py-1.5 text-xs font-medium"
                >
                  Tomar incidente
                </button>
              ) : null}
            </div>
          </article>
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No hay tickets con esos filtros
            {searchQuery ? ` para «${searchQuery}»` : ""}.
          </p>
        ) : null}
      </section>
    </div>
  );
}
