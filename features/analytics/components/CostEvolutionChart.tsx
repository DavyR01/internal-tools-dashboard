"use client";

import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   CartesianGrid,
} from "recharts";

import { useAnalyticsOverview } from "../queries";
import ChartTooltip, {
   RechartsTooltipContentProps,
} from "@/components/ui/ChartToolTip";
import { AnalyticsWidget } from "@/components/ui/AnalyticsWidget";

export default function CostEvolutionChart() {
   const { data, isLoading, isError, refetch } = useAnalyticsOverview();

   const euro = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
   });

   const chartData = data
      ? [
         {
            name: "Previous month",
            value: data.budget_overview.previous_month_total,
         },
         {
            name: "Current month",
            value: data.budget_overview.current_month_total,
         },
      ]
      : [];

   const values = chartData.map((d) => d.value);
   const min = values.length ? Math.min(...values) : 0;
   const max = values.length ? Math.max(...values) : 0;
   const padding = (max - min) * 0.1 || max * 0.05;

   return (
      <AnalyticsWidget
         title="Monthly spend evolution"
         description="Comparison between previous and current month spend."
         isLoading={isLoading}
         isError={isError}
         onRetry={refetch}
         isEmpty={!data || chartData.length === 0}
         emptyTitle="No cost data"
         emptyDescription="No monthly spend data is available."
      >
         <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
               >
                  <CartesianGrid
                     strokeDasharray="3 3"
                     stroke="rgb(var(--muted))"
                     strokeOpacity={0.4}
                     vertical={false}
                  />
                  <XAxis
                     dataKey="name"
                     axisLine={false}
                     tickLine={false}
                     tick={{ fontSize: 12 }}
                  />
                  <YAxis
                     axisLine={false}
                     tickLine={false}
                     tick={{ fontSize: 12 }}
                     tickFormatter={(v) => euro.format(Number(v))}
                     width={72}
                     domain={[min - padding, max + padding]}
                  />
                  <Tooltip
                     content={(props) => (
                        <ChartTooltip
                           {...(props as unknown as RechartsTooltipContentProps)}
                           euro={euro}
                           valueLabel="Spend"
                           getTitle={({ label }) => label ?? "Month"}
                        />
                     )}
                     cursor={{ stroke: "rgb(var(--border))", strokeWidth: 1 }}
                  />
                  <Line
                     type="monotone"
                     dataKey="value"
                     stroke="rgb(var(--ring))"
                     strokeWidth={2}
                     dot={{ r: 3 }}
                     activeDot={{ r: 5 }}
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </AnalyticsWidget>
   );
}
