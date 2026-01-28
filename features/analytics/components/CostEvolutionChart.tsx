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
                  <LineChart data={chartData}>
                     <XAxis dataKey="name" />
                     <YAxis />
                     <Tooltip />
                     <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--ring))"
                        strokeWidth={2}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </CardContent>
      </Card>
   );
}
