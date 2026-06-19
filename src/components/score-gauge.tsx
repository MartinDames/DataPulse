import type { HealthLevel } from "@/lib/types";
import { levelColor, levelLabel } from "@/lib/metrics";

export function ScoreGauge({ score, level }: { score: number; level: HealthLevel }) {
  const color = levelColor(level);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-40 w-40">
        <div
          className="absolute inset-4 rounded-full opacity-30 blur-2xl"
          style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
          aria-hidden
        />
        <svg viewBox="0 0 120 120" className="relative h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-[color:color-mix(in_oklch,var(--border)_80%,transparent)]"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 drop-shadow-[0_0_8px_color-mix(in_oklch,var(--accent)_50%,transparent)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl font-semibold tracking-tight text-[var(--fg)]">
            {score}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            / 100
          </span>
        </div>
      </div>
      <div
        className="rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider ring-1"
        style={{
          color,
          backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)`,
          borderColor: `color-mix(in oklch, ${color} 28%, transparent)`,
        }}
      >
        {levelLabel(level)}
      </div>
    </div>
  );
}
