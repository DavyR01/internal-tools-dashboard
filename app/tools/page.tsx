
"use client";

import PageShell from "@/components/layout/PageShell";
import { useToolsList } from "@/features/tools/queries";

export default function ToolsPage() {
   const { data, isLoading, error } = useToolsList({
      page: 1,
      limit: 10,
      sortBy: "updated_at",
      order: "desc",
   });

   if (isLoading) {
      return <div className="p-6">Loading tools…</div>;
   }

   if (error) {
      return (
         <div className="p-6 text-red-500">
            Failed to load tools
         </div>
      );
   }

   if (!data) {
      return <div className="p-6">No data</div>;
   }

   return (
      <PageShell>
         <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">Tools (debug)</h1>

            <div className="text-sm text-muted">
               Total tools: {data.total}
            </div>

            <ul className="text-sm space-y-1">
               {data.items.map((tool) => (
                  <li key={tool.id}>
                     {tool.name} — {tool.owner_department} — {tool.status}
                  </li>
               ))}
            </ul>
         </div>
      </PageShell>
   );
}
