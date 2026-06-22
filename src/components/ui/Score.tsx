import type { OpportunityLevel } from "@/lib/types";
import { levelClass } from "@/lib/utils/confidence";

export function LevelBadge({ level }: { level: OpportunityLevel }) {
  return <span className={levelClass(level)}>{level} opportunity</span>;
}

/** Compact circular score indicator drawn in SVG (the petrol accent ring). */
export function ScoreDial({ score, size = 116 }: { score: number; size?: number }) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = c * pct;

  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Opportunity score ${score} of 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
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
        <span className="display" style={{ fontSize: size * 0.3, fontWeight: 600, color: "var(--ink)" }}>{score}</span>
        <span className="eyebrow" style={{ marginTop: 4 }}>/ 100</span>
      </div>
    </div>
  );
}
