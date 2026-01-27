'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { useDashboardAnalytics } from "../queries";

export default function KpiCards() {
   const { data, isLoading } = useDashboardAnalytics();

   if (isLoading) {
      return (
         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
               <Card key={i} className="h-28 animate-pulse" />
            ))}
         </div>
      );
   }

   const { budget_overview, cost_analytics, kpi_trends } = data;

   return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
         <Card>
            <CardHeader>
               <div className="text-sm text-muted">Budget</div>
               <div className="text-2xl font-semibold">
                  €{budget_overview.current_month_total} / €
                  {budget_overview.monthly_limit}
               </div>
            </CardHeader>
            <CardContent>
               <StatusBadge status="expiring">
                  {kpi_trends.budget_change}
               </StatusBadge>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <div className="text-sm text-muted">Active Tools</div>
               <div className="text-2xl font-semibold">
                  {cost_analytics.active_users}
               </div>
            </CardHeader>
            <CardContent>
               <StatusBadge status="active">
                  {kpi_trends.tools_change}
               </StatusBadge>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <div className="text-sm text-muted">Departments</div>
               <div className="text-2xl font-semibold">8</div>
            </CardHeader>
            <CardContent>
               <StatusBadge status="active">
                  {kpi_trends.departments_change}
               </StatusBadge>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <div className="text-sm text-muted">Cost / User</div>
               <div className="text-2xl font-semibold">
                  €{cost_analytics.cost_per_user}
               </div>
            </CardHeader>
            <CardContent>
               <StatusBadge status="expiring">
                  {kpi_trends.cost_per_user_change}
               </StatusBadge>
            </CardContent>
         </Card>
      </div>
   );
}
