"use client";

import { useSearchParams } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ToolsCatalog from "@/features/tools/components/ToolsCatalog";

export default function ToolsPage() {
   const searchParams = useSearchParams();
   const q = searchParams.get("q") ?? "";

   return (
      <PageShell>
         <div className="space-y-6">
            <div>
               <h1 className="text-2xl font-semibold">Tools catalog</h1>
               <p className="mt-1 text-sm text-muted">
                  Browse and manage your organization’s internal SaaS tools.
               </p>
            </div>

            {/* Remount only when q changes to keep UI in sync with URL without setState in effects */}
            <ToolsCatalog key={`q=${q}`} initialQuery={q} />
         </div>
      </PageShell>
   );
}
