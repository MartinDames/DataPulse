"use client";

import type { IncidentStatus } from "@/lib/types";
import {
  INCIDENT_STATUS_LABELS,
  INCIDENT_STATUS_ORDER,
} from "@/lib/types";

export function IncidentWorkflow({
  value,
  onChange,
  disabled,
}: {
  value: IncidentStatus;
  onChange: (status: IncidentStatus) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
        Estado del incidente
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Estado del incidente"
      >
        {INCIDENT_STATUS_ORDER.map((status) => {
          const active = value === status;
          return (
            <button
              key={status}
              type="button"
              disabled={disabled}
              onClick={() => onChange(status)}
              className={[
                "rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-all",
                active
                  ? "border-[color:color-mix(in_oklch,var(--accent)_45%,var(--border))] bg-[color:color-mix(in_oklch,var(--accent)_14%,transparent)] text-[var(--fg)] shadow-[0_0_0_1px_color-mix(in_oklch,var(--accent)_20%,transparent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[color:color-mix(in_oklch,var(--accent)_25%,var(--border))] hover:text-[var(--fg)]",
                disabled ? "cursor-not-allowed opacity-50" : "",
              ].join(" ")}
            >
              {INCIDENT_STATUS_LABELS[status]}
            </button>
          );
        })}
      </div>
      <div className="hidden md:flex items-center gap-1 pt-1">
        {INCIDENT_STATUS_ORDER.map((status, i) => (
          <div key={status} className="flex flex-1 items-center gap-1">
            <div
              className={[
                "h-1 flex-1 rounded-full transition-colors",
                INCIDENT_STATUS_ORDER.indexOf(value) >= i
                  ? "bg-[color:color-mix(in_oklch,var(--accent)_55%,var(--border))]"
                  : "bg-[var(--border)]",
              ].join(" ")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
