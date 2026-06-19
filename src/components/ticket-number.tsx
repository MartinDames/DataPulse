import Link from "next/link";
import type { HealthCheck } from "@/lib/types";

export function TicketNumber({
  number,
  className = "font-mono text-[11px] font-medium tracking-wide text-[var(--accent)]",
}: {
  number: string;
  className?: string;
}) {
  return (
    <span className={className} title={`Ticket ${number}`}>
      {number}
    </span>
  );
}

export function TicketNumberLink({
  check,
  className,
}: {
  check: Pick<HealthCheck, "id" | "ticketNumber">;
  className?: string;
}) {
  return (
    <Link
      href={`/alertas/${check.id}`}
      className={
        className ??
        "font-mono text-[11px] font-medium tracking-wide text-[var(--accent)] hover:underline"
      }
    >
      {check.ticketNumber}
    </Link>
  );
}
