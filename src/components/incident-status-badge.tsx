import type { IncidentStatus } from "@/lib/types";
import { INCIDENT_STATUS_LABELS } from "@/lib/types";
import { incidentStatusBadgeClass } from "@/lib/metrics";

export function IncidentStatusBadge({
  status,
  compact,
}: {
  status: IncidentStatus;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full font-mono uppercase tracking-wide ring-1 ${incidentStatusBadgeClass(status)} ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"
      }`}
    >
      {INCIDENT_STATUS_LABELS[status]}
    </span>
  );
}
