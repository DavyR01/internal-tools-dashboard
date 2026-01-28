"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

function KpiCard({
   label,
   value,
   helper,
}: {
   label: string;
   value: string;
   helper: string;
}) {
   return (
      <Card>
         <CardHeader>
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted">{helper}</p>
         </CardHeader>
         <CardContent />
      </Card>
   );
}

export default function AnalyticsKpis() {
   return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
         <KpiCard label="Monthly spend" value="—" helper="vs last month: —" />
         <KpiCard label="Budget utilization" value="—" helper="limit: —" />
         <KpiCard label="Cost per user" value="—" helper="vs last month: —" />
         <KpiCard label="Active users" value="—" helper="out of — total users" />
      </div>
   );
}
