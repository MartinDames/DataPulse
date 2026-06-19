"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { IncidentStatusBadge } from "@/components/incident-status-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { useApp } from "@/context/app-context";
import {
  findTicketByExactNumber,
  searchTickets,
} from "@/lib/ticket-search";

export function TicketSearchBar({ compact }: { compact?: boolean }) {
  const { store } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTickets(store.checks, query).slice(0, 8);
  }, [store.checks, query]);

  function goToResults() {
    const q = query.trim();
    if (!q) return;
    const exact = findTicketByExactNumber(store.checks, q);
    if (exact) {
      router.push(`/alertas/${exact.id}`);
      setOpen(false);
      setQuery("");
      return;
    }
    router.push(`/alertas?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  function handleFocus() {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setOpen(true);
  }

  function handleBlur() {
    blurTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className={`relative ${compact ? "w-full max-w-xs" : "w-full max-w-md"}`}>
      <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 ring-0 transition focus-within:border-[color:color-mix(in_oklch,var(--accent)_40%,var(--border))] focus-within:ring-1 focus-within:ring-[color:color-mix(in_oklch,var(--accent)_35%,transparent)]">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
          INC
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              goToResults();
            }
            if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
            }
          }}
          placeholder="Buscar ticket…"
          aria-label="Buscar tickets"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none"
        />
      </div>

      {open && query.trim() && results.length > 0 ? (
        <ul
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] py-1 shadow-xl"
          onMouseDown={(e) => e.preventDefault()}
        >
          {results.map((check) => (
            <li key={check.id}>
              <Link
                href={`/alertas/${check.id}`}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="flex flex-col gap-1 px-3 py-2.5 transition hover:bg-[color:color-mix(in_oklch,white_4%,transparent)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-medium text-[var(--accent)]">
                    {check.ticketNumber}
                  </span>
                  <SeverityBadge status={check.status} />
                  {check.status !== "ok" ? (
                    <IncidentStatusBadge status={check.incidentStatus} compact />
                  ) : null}
                </div>
                <span className="truncate text-sm text-[var(--fg)]">{check.name}</span>
              </Link>
            </li>
          ))}
          <li className="border-t border-[var(--border)] px-3 py-2">
            <button
              type="button"
              onClick={goToResults}
              className="font-mono text-[10px] uppercase tracking-wide text-[var(--accent)] hover:underline"
            >
              Ver todos los resultados →
            </button>
          </li>
        </ul>
      ) : null}

      {open && query.trim() && results.length === 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3 text-sm text-[var(--muted)] shadow-xl">
          Sin tickets para «{query.trim()}»
        </div>
      ) : null}
    </div>
  );
}
