"use client";

import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useAnalyticsOverview } from "../queries";

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
                     />
                     <Tooltip formatter={(v) => euro.format(Number(v))} />
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
