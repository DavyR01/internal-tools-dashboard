import PageShell from "@/components/layout/PageShell";
import AnalyticsKpis from "@/features/analytics/components/AnalyticsKpis";
import CostEvolutionChart from "@/features/analytics/components/CostEvolutionChart";
import DepartmentCostChart from "@/features/analytics/components/DepartmentCostChart";
import TopToolsChart from "@/features/analytics/components/TopToolsChart";

export default function AnalyticsPage() {
   return (
      <PageShell>
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold">Analytics</h1>
               <p className="mt-1 text-sm text-muted">
                  Track spend, usage and optimization opportunities across departments.
               </p>
            </div>
            <AnalyticsKpis />

            {/* COST ANALYTICS */}
            <div className="space-y-3">
               <h2 className="text-lg font-medium">Cost analytics</h2>
               <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                     <CostEvolutionChart />
                  </div>
                  <DepartmentCostChart />
               </div>
            </div>

            {/* USAGE / OPTIMIZATION */}
            <div className="space-y-3">
               <h2 className="text-lg font-medium">Usage & optimization</h2>
               <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                     <TopToolsChart />
                  </div>
                  {/* <InsightsPanel /> */}
               </div>
            </div>
         </div>
      </PageShell>
   );
}
