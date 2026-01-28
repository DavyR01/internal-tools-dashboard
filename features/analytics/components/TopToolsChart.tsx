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

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useTopToolsByCost } from "../queries";

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


type RechartsTooltipContentProps = {
   active?: boolean;
   label?: string;
   payload?: ReadonlyArray<{
      value?: number | string;
      name?: string;
      payload?: { name?: string };
   }>;
};

function TopToolsTooltip({
   active,
   payload,
   euro,
}: RechartsTooltipContentProps & { euro: Intl.NumberFormat }) {
   if (!active || !payload?.length) return null;

   const row = payload[0];
   const toolName =
      row?.payload?.name || row?.name || "Tool";

   const raw = row?.value;
   const value = typeof raw === "number" ? raw : Number(raw ?? 0);

   return (
      <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm">
         <div className="font-medium">{toolName}</div>
         <div className="mt-1 text-xs text-muted">
            Monthly cost: <span className="text-text">{euro.format(value)}</span>
         </div>
      </div>
   );
}


export default function TopToolsChart() {
   const { data, isLoading, isError } = useTopToolsByCost();

   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 640); // Tailwind sm
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

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <h3 className="text-sm font-medium">Top expensive tools</h3>
               <p className="mt-1 text-xs text-muted">
                  Highest monthly costs across the tools catalog.
               </p>
            </CardHeader>
            <CardContent>
               <div className="h-64 rounded bg-muted/40" />
            </CardContent>
         </Card>
      );
   }

   if (isError || !data) {
      return (
         <Card>
            <CardHeader>
               <p className="text-sm text-muted">Unable to load top expensive tools.</p>
            </CardHeader>
         </Card>
      );
   }

   if (tools.length === 0) {
      return (
         <Card>
            <CardHeader>
               <h3 className="text-sm font-medium">Top expensive tools</h3>
               <p className="mt-1 text-xs text-muted">
                  Highest monthly costs across the tools catalog.
               </p>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted">
                  No tools with a defined monthly cost were found.
               </p>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <h3 className="text-sm font-medium">Top expensive tools</h3>
            <p className="mt-1 text-xs text-muted">
               Highest monthly costs across the tools catalog.
            </p>
         </CardHeader>

         <CardContent>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  {isMobile ? (
                     // Mobile: barres verticales, noms sur X (plus lisible)
                     <BarChart data={tools} margin={{ top: 8, right: 12, bottom: 24, left: 8 }}>
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
                              <TopToolsTooltip
                                 {...(props as unknown as RechartsTooltipContentProps)}
                                 euro={euro}
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
                     // Desktop: horizontal, noms sur Y (OK en large)
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
                              <TopToolsTooltip
                                 {...(props as unknown as RechartsTooltipContentProps)}
                                 euro={euro}
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
         </CardContent>
      </Card>
   );
}
