import type { OpportunityLevel } from "@/lib/types";
import { levelClass } from "@/lib/utils/confidence";

export function LevelBadge({ level }: { level: OpportunityLevel }) {
  return <span className={levelClass(level)}>{level} opportunity</span>;
}

/**
 * Circular score indicator (SVG). `tone="dark"` renders for the navy hero panel
 * (white number, bright-teal ring, translucent track).
 */
export function ScoreDial({
  score,
  size = 132,
  tone = "light",
}: {
  score: number;
  size?: number;
  tone?: "light" | "dark";
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = c * pct;

  const dark = tone === "dark";
  const track = dark ? "rgba(255,255,255,0.16)" : "var(--line)";
  const ring = dark ? "var(--accent-bright)" : "var(--accent)";
  const numColor = dark ? "var(--ink-on-dark)" : "var(--ink)";

  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Opportunity score ${score} of 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        <span className="display" style={{ fontSize: size * 0.32, fontWeight: 600, color: numColor }}>{score}</span>
        <span className="eyebrow" style={{ marginTop: 5, color: dark ? "var(--muted-on-dark)" : "var(--muted)" }}>/ 100</span>
      </div>
    </div>
  );
}
