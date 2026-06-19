import type { HealthCheck, HealthLevel, IncidentStatus } from "@/lib/types";
import {
  computeHealthLevel,
  computeHealthScore,
  countByStatus,
} from "@/lib/demo-data";

export function isIncidentOpen(check: HealthCheck): boolean {
  return check.status !== "ok" && check.incidentStatus !== "resolved";
}

export function getHealthMetrics(checks: HealthCheck[]) {
  const score = computeHealthScore(checks);
  const level = computeHealthLevel(score);
  const byStatus = countByStatus(checks);
  const openIncidents = checks.filter(isIncidentOpen).length;
  const inProgress = checks.filter(
    (c) => c.incidentStatus === "in_progress" || c.incidentStatus === "verifying",
  ).length;
  const recent = [...checks]
    .sort(
      (a, b) =>
        new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime(),
    )
    .slice(0, 5);

  return { score, level, byStatus, openIncidents, inProgress, recent };
}

export function levelLabel(level: HealthLevel): string {
  if (level === "healthy") return "Saludable";
  if (level === "degraded") return "En riesgo";
  return "Crítico";
}

export function levelColor(level: HealthLevel): string {
  if (level === "healthy") return "var(--status-ok)";
  if (level === "degraded") return "var(--status-warn)";
  return "var(--status-critical)";
}

export function statusBadgeClass(status: HealthCheck["status"]): string {
  if (status === "ok")
    return "bg-[color:color-mix(in_oklch,var(--status-ok)_18%,transparent)] text-[var(--status-ok)] ring-[color:color-mix(in_oklch,var(--status-ok)_30%,transparent)]";
  if (status === "warn")
    return "bg-[color:color-mix(in_oklch,var(--status-warn)_18%,transparent)] text-[var(--status-warn)] ring-[color:color-mix(in_oklch,var(--status-warn)_30%,transparent)]";
  return "bg-[color:color-mix(in_oklch,var(--status-critical)_18%,transparent)] text-[var(--status-critical)] ring-[color:color-mix(in_oklch,var(--status-critical)_30%,transparent)]";
}

export function incidentStatusBadgeClass(status: IncidentStatus): string {
  switch (status) {
    case "new":
      return "bg-[color:color-mix(in_oklch,var(--status-critical)_14%,transparent)] text-[var(--status-critical)] ring-[color:color-mix(in_oklch,var(--status-critical)_28%,transparent)]";
    case "in_progress":
      return "bg-[color:color-mix(in_oklch,var(--accent)_14%,transparent)] text-[var(--accent)] ring-[color:color-mix(in_oklch,var(--accent)_28%,transparent)]";
    case "verifying":
      return "bg-[color:color-mix(in_oklch,var(--status-warn)_14%,transparent)] text-[var(--status-warn)] ring-[color:color-mix(in_oklch,var(--status-warn)_28%,transparent)]";
    case "resolved":
      return "bg-[color:color-mix(in_oklch,var(--status-ok)_14%,transparent)] text-[var(--status-ok)] ring-[color:color-mix(in_oklch,var(--status-ok)_28%,transparent)]";
  }
}

export function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Hace menos de 1 h";
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d${days === 1 ? "ía" : "ías"}`;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}
