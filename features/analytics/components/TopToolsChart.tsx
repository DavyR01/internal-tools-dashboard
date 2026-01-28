"use client";

import { useEffect, useMemo, useState } from "react";
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
} from "recharts";

import { useTopToolsByCost } from "../queries";
import ChartTooltip, {
   RechartsTooltipContentProps,
} from "@/components/ui/ChartToolTip";
import { AnalyticsWidget } from "@/components/ui/AnalyticsWidget";

type Tool = {
   id: number;
   name: string;
   monthly_cost: unknown;
};

const euro = new Intl.NumberFormat("fr-FR", {
   style: "currency",
   currency: "EUR",
   maximumFractionDigits: 0,
});

function normalizeMonthlyCost(value: unknown) {
   if (value == null) return 0;
   const cleaned = String(value).replace(/[^\d.-]/g, "");
   const n = Number(cleaned);
   return Number.isFinite(n) ? n : 0;
}

function truncateLabel(label: string, max = 14) {
   return label.length > max ? `${label.slice(0, max)}…` : label;
}

export default function TopToolsChart() {
   const { data, isLoading, isError, refetch } = useTopToolsByCost();
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 640);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
   }, []);

   const tools = useMemo(() => {
      if (!data) return [];

      return (data as Tool[])
         .map((t) => ({
            id: t.id,
            name: t.name,
            monthly_cost: normalizeMonthlyCost(t.monthly_cost),
         }))
         .filter((t) => t.monthly_cost > 0)
         .sort((a, b) => b.monthly_cost - a.monthly_cost)
         .slice(0, 5);
   }, [data]);

   return (
      <AnalyticsWidget
         title="Top expensive tools"
         description="Highest monthly costs across the tools catalog."
         isLoading={isLoading}
         isError={isError}
         onRetry={refetch}
         isEmpty={!isLoading && !isError && tools.length === 0}
         emptyTitle="No tool data"
         emptyDescription="No tools with a defined monthly cost were found."
      >
         <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
               {isMobile ? (
                  <BarChart
                     data={tools}
                     margin={{ top: 8, right: 12, bottom: 24, left: 8 }}
                  >
                     <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => truncateLabel(String(v), 8)}
                     />
                     <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => euro.format(Number(v))}
                        width={72}
                     />
                     <Tooltip
                        content={(props) => (
                           <ChartTooltip
                              {...(props as unknown as RechartsTooltipContentProps)}
                              euro={euro}
                              valueLabel="Monthly cost"
                              getTitle={({ payloadItem }) =>
                                 (payloadItem?.name as string) ?? "Tool"
                              }
                           />
                        )}
                        cursor={{ fill: "rgb(var(--muted))", fillOpacity: 0.08 }}
                     />
                     <Bar
                        dataKey="monthly_cost"
                        fill="rgb(var(--ring))"
                        radius={[4, 4, 0, 0]}
                     />
                  </BarChart>
               ) : (
                  <BarChart
                     data={tools}
                     layout="vertical"
                     margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
                  >
                     <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => euro.format(Number(v))}
                     />
                     <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        width={130}
                        tickFormatter={(v) => truncateLabel(String(v), 14)}
                     />
                     <Tooltip
                        content={(props) => (
                           <ChartTooltip
                              {...(props as unknown as RechartsTooltipContentProps)}
                              euro={euro}
                              valueLabel="Monthly cost"
                              getTitle={({ payloadItem }) =>
                                 (payloadItem?.name as string) ?? "Tool"
                              }
                           />
                        )}
                        cursor={{ fill: "rgb(var(--muted))", fillOpacity: 0.08 }}
                     />
                     <Bar
                        dataKey="monthly_cost"
                        fill="rgb(var(--ring))"
                        radius={[4, 4, 4, 4]}
                     />
                  </BarChart>
               )}
            </ResponsiveContainer>
         </div>

         <p className="mt-3 text-xs text-muted">
            Only tools with a defined monthly cost are displayed.
         </p>
      </AnalyticsWidget>
   );
}
