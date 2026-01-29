import { Suspense } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolsPageClient from "@/features/tools/components/ToolsPageClient";

export default function ToolsPage() {
   return (
      <PageShell>
         <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-surface" />}>
            <ToolsPageClient />
         </Suspense>
      </PageShell>
   );
}
