import type { ConfidenceRating } from "@/lib/types";
import { confClass } from "@/lib/utils/confidence";

export function ConfidenceBadge({ confidence, title }: { confidence: ConfidenceRating; title?: string }) {
  return (
    <span className={confClass(confidence)} title={title ?? `Confidence: ${confidence}`}>
      {confidence}
    </span>
  );
}
