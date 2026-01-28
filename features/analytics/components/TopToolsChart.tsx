"use client";

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
   monthly_cost: number;
};

export default function TopToolsChart() {
   const { data, isLoading, isError } = useTopToolsByCost();

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
               <p className="text-sm text-muted">
                  Unable to load top expensive tools.
               </p>
            </CardHeader>
         </Card>
      );
   }

   const normalizeMonthlyCost = (value: unknown) => {
      if (value == null) return 0;

      // gère: number, "900", "€900", "900 €"
      const cleaned = String(value).replace(/[^\d.-]/g, "");
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
   };

   const tools = (data as Tool[])
      .map((t) => ({
         ...t,
         monthly_cost: normalizeMonthlyCost(t.monthly_cost),
      }))
      .filter((t) => t.monthly_cost > 0)
      .sort((a, b) => b.monthly_cost - a.monthly_cost)
      .slice(0, 5);

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
                  <BarChart
                     data={tools}
                     layout="vertical"
                     margin={{ left: 24 }}
                  >
                     <XAxis
                        type="number"
                        tickFormatter={(value) => `€${value}`}
                     />
                     <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                     />
                     <Tooltip
                        formatter={(value) => [`€${value}`, "Monthly cost"]}
                     />
                     <Bar
                        dataKey="monthly_cost"
                        fill="rgb(var(--ring))"
                        radius={[4, 4, 4, 4]}
                     />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </CardContent>
      </Card>
   );
}
