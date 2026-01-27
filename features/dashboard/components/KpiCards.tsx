"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { useDashboardAnalytics } from "../queries";
import { Building2, TrendingUp, Users, Wrench } from "lucide-react";

function TrendPill({
   value,
   tone,
}: {
   value: string;
   tone: "green" | "purple" | "orange" | "pink";
}) {
   const tones = {
      green: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
      purple: "bg-indigo-500/15 text-indigo-500 border-indigo-500/20",
      orange: "bg-orange-500/15 text-orange-500 border-orange-500/20",
      pink: "bg-pink-500/15 text-pink-500 border-pink-500/20",
   };

   return (
      <span
         className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
            tones[tone]
         )}
      >
         {value}
      </span>
   );
}

function IconBadge({
   tone,
   children,
}: {
   tone: "green" | "purple" | "orange" | "pink";
   children: React.ReactNode;
}) {
   const tones = {
      green: "bg-emerald-500 text-white",
      purple: "bg-indigo-500 text-white",
      orange: "bg-orange-500 text-white",
      pink: "bg-pink-500 text-white",
   };

   return (
      <div
         className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            tones[tone]
         )}
      >
         {children}
      </div>
   );
}

function formatBudget(current: number, limit: number) {
   // garde simple et lisible (mock : €28,750/€30k)
   const currentFmt = current.toLocaleString("en-US");
   const limitK = Math.round(limit / 1000);
   return `€${currentFmt}/€${limitK}k`;
}

export default function KpiCards() {
   const { data, isLoading } = useDashboardAnalytics();

   if (isLoading) {
      return (
         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
               <Card key={i} className="h-35 animate-pulse" />
            ))}
         </div>
      );
   }

   const { budget_overview, cost_analytics, kpi_trends } = data;

   return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
         {/* Monthly Budget */}
         <Card className="p-6">
            <div className="flex items-start justify-between">
               <div>
                  <div className="text-sm font-medium text-muted">Monthly Budget</div>
               </div>
               <IconBadge tone="green">
                  <TrendingUp className="h-5 w-5" />
               </IconBadge>
            </div>

            <div className="mt-6 text-3xl font-semibold tracking-tight">
               {formatBudget(
                  budget_overview.current_month_total,
                  budget_overview.monthly_limit
               )}
            </div>

            <div className="mt-4">
               <TrendPill value={kpi_trends.budget_change} tone="green" />
            </div>
         </Card>

         {/* Active Tools */}
         <Card className="p-6">
            <div className="flex items-start justify-between">
               <div className="text-sm font-medium text-muted">Active Tools</div>
               <IconBadge tone="purple">
                  <Wrench className="h-5 w-5" />
               </IconBadge>
            </div>

            <div className="mt-6 text-3xl font-semibold tracking-tight">{cost_analytics.active_users}</div>

            <div className="mt-4">
               <TrendPill value={kpi_trends.tools_change} tone="purple" />
            </div>
         </Card>

         {/* Departments */}
         <Card className="p-6">
            <div className="flex items-start justify-between">
               <div className="text-sm font-medium text-muted">Departments</div>
               <IconBadge tone="orange">
                  <Building2 className="h-5 w-5" />
               </IconBadge>
            </div>

            <div className="mt-6 text-3xl font-semibold tracking-tight">8</div>

            <div className="mt-4">
               <TrendPill value={kpi_trends.departments_change} tone="orange" />
            </div>
         </Card>

         {/* Cost/User */}
         <Card className="p-6">
            <div className="flex items-start justify-between">
               <div className="text-sm font-medium text-muted">Cost/User</div>
               <IconBadge tone="pink">
                  <Users className="h-5 w-5" />
               </IconBadge>
            </div>

            <div className="mt-6 text-3xl font-semibold tracking-tight">
               €{cost_analytics.cost_per_user}
            </div>

            <div className="mt-4">
               <TrendPill value={kpi_trends.cost_per_user_change} tone="pink" />
            </div>
         </Card>
      </div>
   );
}
