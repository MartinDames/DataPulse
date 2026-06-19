"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_SCORE, HERO_ALERTS } from "@/lib/landing-data";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function MiniGauge({ score }: { score: number }) {
  const color = "var(--status-critical)";
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative mx-auto h-32 w-32">
      <div
        className="landing-pulse-ring absolute inset-2 rounded-full border border-[color:color-mix(in_oklch,var(--status-critical)_35%,transparent)]"
        aria-hidden
      />
      <div
        className="absolute inset-3 rounded-full opacity-25 blur-xl"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
        aria-hidden
      />
      <svg viewBox="0 0 96 96" className="relative h-full w-full -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-[color:color-mix(in_oklch,var(--border)_80%,transparent)]"
        />
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold tabular-nums tracking-tight">{score}</span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">/ 100</span>
      </div>
    </div>
  );
}

function severityDot(severity: "critical" | "warn") {
  return severity === "critical" ? "var(--status-critical)" : "var(--status-warn)";
}

export function HeroPreview() {
  const [score, setScore] = useState(0);
  const [alertIdx, setAlertIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setScore(DEMO_SCORE);
      return;
    }

    const start = performance.now();
    const duration = 1600;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setScore(Math.round(easeOutCubic(t) * DEMO_SCORE));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAlertIdx((i) => (i + 1) % HERO_ALERTS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  const alert = HERO_ALERTS[alertIdx];

  return (
    <Link href="/overview" className="landing-hero-preview-in group block">
      <div className="landing-preview-panel overflow-hidden p-5 md:p-6">
        <div className="landing-preview-scanline" aria-hidden />
        <div
          className="landing-radar absolute -right-16 -top-16 h-48 w-48 opacity-40"
          aria-hidden
        />

        <div className="relative flex items-center justify-between gap-2 border-b border-[color:color-mix(in_oklch,var(--border)_65%,transparent)] pb-3">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Vista previa · demo
            </div>
            <div className="font-display text-sm font-semibold tracking-tight">Acme Distribución S.A.</div>
          </div>
          <span className="rounded-full bg-[color:color-mix(in_oklch,var(--status-critical)_16%,transparent)] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--status-critical)] ring-1 ring-[color:color-mix(in_oklch,var(--status-critical)_28%,transparent)]">
            Crítico
          </span>
        </div>

        <div className="relative mt-5 grid gap-4 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col items-center justify-center py-2">
            <MiniGauge score={score} />
            <p className="pretty mt-3 text-center text-[11px] leading-relaxed text-[var(--muted)]">
              Score global de salud de datos
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
              Alerta activa
            </div>
            <div
              key={alert.id}
              className="landing-alert-enter surface-muted flex gap-2.5 p-3"
            >
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: severityDot(alert.severity), boxShadow: `0 0 10px ${severityDot(alert.severity)}` }}
                aria-hidden
              />
              <p className="pretty text-xs leading-relaxed text-[color:color-mix(in_oklch,var(--fg)_82%,var(--muted))]">
                {alert.text}
              </p>
            </div>
            <div className="mt-auto grid grid-cols-3 gap-2">
              {[
                { label: "Urgentes", val: "4", tone: "var(--status-critical)" },
                { label: "Priorit.", val: "3", tone: "var(--status-warn)" },
                { label: "OK", val: "2", tone: "var(--status-ok)" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-[color:color-mix(in_oklch,var(--border)_70%,transparent)] bg-[color:color-mix(in_oklch,var(--bg)_50%,transparent)] px-2 py-2 text-center">
                  <div className="font-mono text-[8px] uppercase tracking-wider text-[var(--muted)]">{s.label}</div>
                  <div className="font-display text-lg font-semibold tabular-nums" style={{ color: s.tone }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[color:color-mix(in_oklch,var(--border)_55%,transparent)] pt-3">
          <span className="font-mono text-[9px] text-[var(--muted)]">Último check · hace 4 min</span>
          <span className="text-xs text-[var(--accent)] transition-transform group-hover:translate-x-0.5">
            Abrir demo completa →
          </span>
        </div>
      </div>
    </Link>
  );
}
