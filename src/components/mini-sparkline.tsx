export function MiniSparkline({
  values,
  label,
  tone = "warn",
}: {
  values: number[];
  label?: string;
  tone?: "ok" | "warn" | "critical";
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 140;
  const h = 40;
  const step = w / Math.max(values.length - 1, 1);

  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  const stroke =
    tone === "ok"
      ? "var(--status-ok)"
      : tone === "critical"
        ? "var(--status-critical)"
        : "var(--status-warn)";

  return (
    <div>
      {label ? (
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
          {label}
        </div>
      ) : null}
      <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full max-w-[140px]">
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  );
}
