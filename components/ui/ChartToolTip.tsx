"use client";

type RechartsTooltipContentProps = {
   active?: boolean;
   label?: string;
   payload?: ReadonlyArray<{
      value?: number | string;
      payload?: Record<string, unknown>;
   }>;
};

type Props = RechartsTooltipContentProps & {
   euro: Intl.NumberFormat;
   valueLabel: string;
   getTitle: (args: { label?: string; payloadItem?: Record<string, unknown> }) => string;
};

export default function ChartTooltip({
   active,
   payload,
   label,
   euro,
   valueLabel,
   getTitle,
}: Props) {
   if (!active || !payload?.length) return null;

   const payloadItem = (payload[0]?.payload as Record<string, unknown> | undefined) ?? undefined;

   const raw = payload[0]?.value;
   const value = typeof raw === "number" ? raw : Number(raw ?? 0);

   const title = getTitle({ label, payloadItem });

   return (
      <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm">
         <div className="font-medium">{title}</div>
         <div className="mt-1 text-xs text-muted">
            {valueLabel}: <span className="font-medium text-[rgb(var(--ring))]">{euro.format(value)}</span>
         </div>
      </div>
   );
}

export type { RechartsTooltipContentProps };
