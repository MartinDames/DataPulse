"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#problema", label: "Problema" },
  { href: "#solucion", label: "Solución" },
  { href: "#pricing", label: "Planes" },
  { href: "#contacto", label: "Contacto" },
] as const;

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "landing-nav sticky top-0 z-20 border-b border-transparent backdrop-blur-xl transition-[background,border-color] duration-300",
        scrolled ? "is-scrolled" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[color:color-mix(in_oklch,var(--accent)_22%,var(--card))] ring-1 ring-[color:color-mix(in_oklch,var(--accent)_40%,transparent)]">
            <span className="font-display text-xs font-semibold">DP</span>
            <span
              className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
              aria-hidden
            />
          </div>
          <span className="font-display text-sm font-semibold tracking-tight">DataPulse</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative transition-colors hover:text-[var(--fg)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--accent)] after:transition-[width] hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link href="/overview" className="btn-ghost px-3.5 py-1.5 text-xs font-medium">
          Ver demo
        </Link>
      </div>
    </header>
  );
}
