import PageShell from "@/components/layout/PageShell";
import AnalyticsPageClient from "@/features/analytics/components/AnalyticsOageClient";
import { Suspense } from "react";

export default function AnalyticsPage() {
   return (
      <PageShell>
         <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-surface" />}>
            <AnalyticsPageClient />
         </Suspense>
      </PageShell>
   );
}
