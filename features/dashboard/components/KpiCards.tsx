"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { useDashboardAnalytics } from "../queries";
import { Building2, TrendingUp, Users, Wrench } from "lucide-react";

/* ---------- UI helpers (spécifiques KPI) ---------- */

type Tone = "green" | "purple" | "orange" | "pink";

const tones: Record<Tone, string> = {
   green: "bg-emerald-500",
   purple: "bg-indigo-500",
   orange: "bg-orange-500",
   pink: "bg-pink-500",
};

function TrendPill({
   value,
   tone,
}: {
   value: string;
   tone: Tone
}) {
   return (
      <span
         className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white",
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
   tone: Tone;
   children: React.ReactNode;
}) {
   return (
      <div
         className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-white",
            tones[tone]
         )}
      >
         {children}
      </div>
   );
}

/* ---------- Utils ---------- */

function formatBudget(current: number, limit: number) {
   const currentFormatted = current.toLocaleString("en-US");
   const limitFormatted = `${Math.round(limit / 1000)}k`;

   return (
      <>
         <span className="text-text">€{currentFormatted}</span>
         <span className="mx-1 text-muted">/</span>
         <span className="text-muted">€{limitFormatted}</span>
      </>
   );
}

/* ---------- Component ---------- */

export default function KpiCards() {
   const { data, isLoading } = useDashboardAnalytics();

   if (isLoading) {
      return (
         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
               <Card
                  key={i}
                  className="h-35 animate-pulse border-none shadow-sm"
               />
            ))}
         </div>
      );
   }

   const { budget_overview, cost_analytics, kpi_trends } = data;

   const KPI_ITEMS = [
      {
         key: "budget",
         label: "Monthly Budget",
         tone: "green" as const,
         icon: TrendingUp,
         value: formatBudget(
            budget_overview.current_month_total,
            budget_overview.monthly_limit
         ),
         trend: kpi_trends.budget_change,
      },
      {
         key: "tools",
         label: "Active Tools",
         tone: "purple" as const,
         icon: Wrench,
         value: cost_analytics.active_users,
         trend: kpi_trends.tools_change,
      },
      {
         key: "departments",
         label: "Departments",
         tone: "orange" as const,
         icon: Building2,
         value: kpi_trends.departments_change
            ? budget_overview.departments ?? "_"
            : "",
         trend: kpi_trends.departments_change,
      },
      {
         key: "cpu",
         label: "Cost/User",
         tone: "pink" as const,
         icon: Users,
         value: `€${cost_analytics.cost_per_user}`,
         trend: kpi_trends.cost_per_user_change,
      },
   ];


   return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
         {KPI_ITEMS.map(({ key, label, tone, icon: Icon, value, trend }) => (
            <Card key={key} className="p-6">
               <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted">{label}</div>
                  <IconBadge tone={tone}>
                     <Icon className="h-5 w-5" />
                  </IconBadge>
               </div>

               <div className="mt-6 text-3xl font-semibold tracking-tight">{value}</div>

               <div className="mt-4">
                  <TrendPill value={trend} tone={tone} />
               </div>
            </Card>
         ))}
      </div>
   );

}
