"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { useAnalyticsOverview } from "../queries";
import { ErrorState } from "@/components/ui/ErrorState";

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
            <p className="mt-1 text-xs text-muted pb-4">{helper}</p>
         </CardHeader>
      </Card>
   );
}

export default function AnalyticsKpis() {
   const { data, isLoading, isError, refetch } = useAnalyticsOverview();

   if (isLoading) {
      return (
         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
               <Card key={i}>
                  <CardHeader>
                     <div className="h-4 w-24 rounded bg-muted/40" />
                     <div className="mt-3 h-6 w-16 rounded bg-muted/40" />
                     <div className="mt-2 h-3 w-32 rounded bg-muted/30" />
                  </CardHeader>
               </Card>
            ))}
         </div>
      );
   }

   if (isError || !data) {
      return (
         <ErrorState
            title="Unable to load analytics KPIs"
            description="Please check your connection and try again."
            onRetry={refetch}
         />
      );
   }
   const { budget_overview, cost_analytics } = data;

   return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
         <KpiCard
            label="Monthly spend"
            value={`€${budget_overview.current_month_total}`}
            helper={`vs last month: ${budget_overview.trend_percentage}`}
         />
         <KpiCard
            label="Budget utilization"
            value={budget_overview.budget_utilization}
            helper={`limit: €${budget_overview.monthly_limit}`}
         />
         <KpiCard
            label="Cost per user"
            value={`€${cost_analytics.cost_per_user}`}
            helper={`previous: €${cost_analytics.previous_cost_per_user}`}
         />
         <KpiCard
            label="Active users"
            value={`${cost_analytics.active_users}`}
            helper={`out of ${cost_analytics.total_users} users`}
         />
      </div>
   );
}
