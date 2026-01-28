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

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useAnalyticsOverview } from "../queries";
import ChartTooltip, { RechartsTooltipContentProps } from "@/components/ui/ChartToolTip";



export default function CostEvolutionChart() {
   const { data, isLoading, isError } = useAnalyticsOverview();

   const euro = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
   });

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <h3 className="text-sm font-medium">Monthly spend evolution</h3>
               <p className="mt-1 text-xs text-muted">
                  Total monthly spend trend.
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
               <p className="text-sm text-muted">
                  Unable to load spend evolution.
               </p>
            </CardHeader>
         </Card>
      );
   }

   const chartData = [
      {
         name: "Previous month",
         value: data.budget_overview.previous_month_total,
      },
      {
         name: "Current month",
         value: data.budget_overview.current_month_total,
      },
   ];

   const values = chartData.map((d) => d.value);
   const min = Math.min(...values);
   const max = Math.max(...values);
   const padding = (max - min) * 0.1 || max * 0.05;


   return (
      <Card>
         <CardHeader>
            <h3 className="text-sm font-medium">Monthly spend evolution</h3>
            <p className="mt-1 text-xs text-muted">
               Comparison between previous and current month spend.
            </p>
         </CardHeader>
         <CardContent>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
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
         </CardContent>
      </Card>
   );
}
