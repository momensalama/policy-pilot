"use client";

import { useState } from "react";
import { MagicCard } from "@/components/ui/magic-card";
import { Badge } from "@/components/ui/badge";
import type { AssessmentFormData } from "@/lib/validations";
import { ACTIVITY_PREVIEW_LENGTH } from "@/lib/constants";

interface ReviewCardProps {
  data: AssessmentFormData;
}

export function ReviewCard({ data }: Readonly<ReviewCardProps>) {
  return (
    <MagicCard
      className="p-4 rounded-lg"
      gradientFrom="oklch(0.555 0.163 48.998)"
      gradientTo="oklch(0.879 0.169 91.605)"
      gradientColor="oklch(0.555 0.163 48.998 / 0.05)"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Review your information</h3>

        <div className="grid gap-3 text-sm min-w-0 overflow-hidden">
          <Row label="Company" value={data.companyName} />
          <Row label="Email" value={data.companyEmail} />
          <Row label="Location" value={data.companyLocation} />
          <ActivityRow value={data.primaryActivity} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Shareholders
          </p>
          <div className="flex flex-wrap gap-2">
            {data.shareholders.map((s, i) => (
              <Badge key={i} variant="secondary">
                {s.name} — {s.sharePercentage}%
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </MagicCard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <p className="font-medium break-all max-h-20 overflow-y-auto overflow-x-hidden">
        {value}
      </p>
    </div>
  );
}

function ActivityRow({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false);
  const isTruncatable = value.length > ACTIVITY_PREVIEW_LENGTH;
  const displayed =
    isTruncatable && !expanded
      ? value.slice(0, ACTIVITY_PREVIEW_LENGTH).trimEnd() + "…"
      : value;

  return (
    <div className="space-y-0.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        Activity
      </span>
      <p className="font-medium break-all max-h-20 overflow-y-auto overflow-x-hidden">
        {displayed}
      </p>
      {isTruncatable && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-xs text-primary hover:underline mt-0.5"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
