import type { HealthCheck } from "@/lib/types";
import { CATEGORY_LABELS, INCIDENT_STATUS_LABELS } from "@/lib/types";

export function formatTicketNumber(seq: number): string {
  return `INC${String(seq).padStart(6, "0")}`;
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function ticketMatchesQuery(
  check: HealthCheck,
  rawQuery: string,
): boolean {
  const query = normalizeSearchQuery(rawQuery);
  if (!query) return true;

  const ticket = check.ticketNumber.toLowerCase();
  const ticketDigits = ticket.replace(/\D/g, "");
  const queryDigits = query.replace(/\D/g, "");

  if (ticket.includes(query)) return true;
  if (queryDigits.length >= 3 && ticketDigits.includes(queryDigits)) return true;

  const statusLabel = INCIDENT_STATUS_LABELS[check.incidentStatus].toLowerCase();
  if (statusLabel.includes(query)) return true;

  const haystack = [
    check.name,
    check.code,
    check.description,
    check.impact,
    check.recommendation,
    check.technicalLog ?? "",
    CATEGORY_LABELS[check.category],
    ...check.activity.map((n) => n.body),
    ...check.activity.map((n) => n.author),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function searchTickets(
  checks: HealthCheck[],
  rawQuery: string,
): HealthCheck[] {
  const query = normalizeSearchQuery(rawQuery);
  if (!query) return checks;
  return checks.filter((c) => ticketMatchesQuery(c, query));
}

export function findTicketByExactNumber(
  checks: HealthCheck[],
  rawQuery: string,
): HealthCheck | undefined {
  const query = normalizeSearchQuery(rawQuery);
  if (!query) return undefined;

  const queryDigits = query.replace(/\D/g, "");
  return checks.find((c) => {
    const ticket = c.ticketNumber.toLowerCase();
    if (ticket === query) return true;
    if (query.startsWith("inc") && ticket === query) return true;
    if (queryDigits.length >= 4) {
      return ticket.replace(/\D/g, "") === queryDigits;
    }
    return false;
  });
}
