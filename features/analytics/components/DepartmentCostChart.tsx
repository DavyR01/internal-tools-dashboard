"use client";

import {
   PieChart,
   Pie,
   Tooltip,
   ResponsiveContainer,
   Cell,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useToolsForDepartmentCostBreakdown } from "../queries";
import ChartTooltip, { RechartsTooltipContentProps } from "@/components/ui/ChartToolTip";


type Tool = {
   id: number;
   owner_department: string;
   monthly_cost: number;
};

function buildDepartmentCostData(tools: Tool[]) {
   const map = new Map<string, number>();

   for (const t of tools) {
      const dept = t.owner_department || "Unknown";
      const cost = Number(t.monthly_cost) || 0;
      map.set(dept, (map.get(dept) ?? 0) + cost);
   }

   return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
}

export default function DepartmentCostChart() {
   const { data, isLoading, isError } = useToolsForDepartmentCostBreakdown();

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <h3 className="text-sm font-medium">Cost by department</h3>
               <p className="mt-1 text-xs text-muted">
                  Share of total monthly spend by department.
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
                  Unable to load department breakdown.
               </p>
            </CardHeader>
         </Card>
      );
   }

   const tools = data as Tool[];
   const chartData = buildDepartmentCostData(tools);
   const opacities = [0.95, 0.75, 0.55, 0.4, 0.28, 0.2];

   const euro = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
   });

   return (
      <Card>
         <CardHeader>
            <h3 className="text-sm font-medium">Cost by department</h3>
            <p className="mt-1 text-xs text-muted">
               Share of total monthly spend by department.
            </p>
         </CardHeader>

         <CardContent>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="62%"
                        outerRadius="86%"
                        paddingAngle={2}
                     >
                        {chartData.map((_, i) => (
                           <Cell
                              key={i}
                              fill="rgb(var(--ring))"
                              fillOpacity={opacities[i % opacities.length]}
                              stroke="rgb(var(--surface))"
                              strokeWidth={2}
                           />
                        ))}
                     </Pie>
                     <Tooltip
                        content={(props) => (
                           <ChartTooltip
                              {...(props as unknown as RechartsTooltipContentProps)}
                              euro={euro}
                              valueLabel="Monthly spend"
                              getTitle={({ payloadItem }) => (payloadItem?.name as string) ?? "Department"}
                           />
                        )}
                        cursor={{ fill: "rgb(var(--muted))", fillOpacity: 0.08 }}
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </CardContent>
      </Card>
   );
}
