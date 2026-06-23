import type { ConfidenceRating } from "@/lib/types";
import { confClass } from "@/lib/utils/confidence";

export function ConfidenceBadge({ confidence, title, style }: { confidence: ConfidenceRating; title?: string; style?: React.CSSProperties }) {
  return (
    <span className={confClass(confidence)} title={title ?? `Confidence: ${confidence}`} style={style}>
      {confidence}
    </span>
  );
}
