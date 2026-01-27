import PageShell from "@/components/layout/PageShell";
import KpiCards from "@/features/dashboard/components/KpiCards";
import RecentToolsTable from "@/features/dashboard/components/RecentToolsTable";

export default function DashboardPage() {
   return (
      <PageShell>
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold">Internal Tools Dashboard</h1>
               <p className="mt-1 text-sm text-muted">
                  Monitor and manage your organizations software tools and expenses
               </p>
            </div>
            <KpiCards />
            <div>
               <h2 className="mb-3 text-lg font-medium">Recent tools</h2>
               <RecentToolsTable />
            </div>
         </div>
      </PageShell>
   );
}
