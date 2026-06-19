"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TicketSearchBar } from "@/components/ticket-search-bar";
import { AppProvider } from "@/context/app-context";
import { TweaksPanel } from "@/components/tweaks-panel";
import { useEffect, useState } from "react";
import { applyUiPrefsToDom, loadUiPrefs } from "@/lib/ui-prefs";

const NAV = [
  { href: "/overview", label: "Overview" },
  { href: "/alertas", label: "Tickets" },
  { href: "/informe", label: "Informe" },
  { href: "/configuracion", label: "Configuración" },
] as const;

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
        active
          ? "bg-[color:color-mix(in_oklch,var(--accent)_14%,transparent)] text-[var(--fg)] ring-1 ring-[color:color-mix(in_oklch,var(--accent)_25%,transparent)]"
          : "text-[var(--muted)] hover:bg-[color:color-mix(in_oklch,white_4%,transparent)] hover:text-[var(--fg)]",
      ].join(" ")}
    >
      <span
        className={[
          "h-1 w-4 rounded-full transition-opacity",
          active ? "bg-[var(--accent)] opacity-100" : "bg-[var(--border)] opacity-60",
        ].join(" ")}
        aria-hidden
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    applyUiPrefsToDom(loadUiPrefs());
  }, []);

  return (
    <AppProvider>
      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} />
      <div className="relative z-[1] min-h-full flex">
        <aside className="no-print hidden w-64 shrink-0 border-r border-[color:color-mix(in_oklch,var(--border)_70%,transparent)] bg-[color:color-mix(in_oklch,var(--bg-elevated)_85%,transparent)] p-4 backdrop-blur-xl md:block">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:color-mix(in_oklch,var(--accent)_22%,var(--card))] ring-1 ring-[color:color-mix(in_oklch,var(--accent)_40%,transparent)]">
              <span className="font-display text-sm font-semibold tracking-tight text-[var(--fg)]">
                DP
              </span>
              <span
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]"
                aria-hidden
              />
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-semibold tracking-tight text-[var(--fg)]">
                DataPulse
              </div>
              <div className="truncate font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Salud de datos
              </div>
            </div>
          </div>

          <nav className="mt-5 flex flex-col gap-0.5">
            {NAV.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                }
              />
            ))}
          </nav>

          <div className="surface-muted mt-8 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
              Modo demo
            </div>
            <p className="pretty mt-1.5 text-xs leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_65%,var(--muted))]">
              Datos mock · persistencia local · sin backend
            </p>
            <Link
              href="/"
              className="mt-3 inline-block text-xs text-[var(--accent)] hover:underline"
            >
              ← Landing comercial
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="no-print sticky top-0 z-10 border-b border-[color:color-mix(in_oklch,var(--border)_70%,transparent)] bg-[color:color-mix(in_oklch,var(--bg)_75%,transparent)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1 basis-[200px]">
                <div className="truncate font-display text-base font-semibold tracking-tight text-[var(--fg)]">
                  Tus datos te están fallando en silencio
                </div>
                <div className="truncate font-mono text-[11px] text-[var(--muted)]">
                  monitoreo · alertas · informe ejecutivo
                </div>
              </div>
              <div className="hidden min-w-[200px] flex-1 basis-[240px] sm:block">
                <TicketSearchBar compact />
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href="/informe" className="btn-ghost hidden px-3 py-1.5 text-xs font-medium sm:inline-block">
                  Ver informe
                </Link>
                <button
                  onClick={() => setTweaksOpen(true)}
                  className="btn-ghost px-3 py-1.5 text-xs font-medium"
                >
                  Tweaks
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        </div>
      </div>
    </AppProvider>
  );
}
