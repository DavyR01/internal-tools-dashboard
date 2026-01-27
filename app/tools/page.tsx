import PageShell from "@/components/layout/PageShell";
import ToolsCatalog from "@/features/tools/components/ToolsCatalog";

export default function ToolsPage() {
   return (
      <PageShell>
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold">Tools catalog</h1>
               <p className="mt-1 text-sm text-muted">
                  Browse and manage your organization’s internal SaaS tools.
               </p>
            </div>
            <ToolsCatalog />
         </div>
      </PageShell>
   );
}
