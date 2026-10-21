import { Badge } from "@/shared/components/admin/ui/Badge";
import { SEGMENT_BADGES } from "../../constants";
import type { CustomerSegment } from "../../types";

export function SegmentBadge({ segment }: { segment: CustomerSegment }) {
  const config = SEGMENT_BADGES[segment];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
