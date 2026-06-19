import type { CheckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { statusBadgeClass } from "@/lib/metrics";

export function SeverityBadge({ status }: { status: CheckStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadgeClass(status)}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
