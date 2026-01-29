'use client'

import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { useRecentTools } from "../queries";
import { Calendar } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function RecentToolsTable() {
   const { data, isLoading, isError, refetch } = useRecentTools();

   if (isLoading) {
      return <div className="h-48 animate-pulse rounded-2xl bg-surface" />;
   }

   if (isError) {
      return (
         <ErrorState
            title="Unable to load recent tools"
            description="Please check your connection and try again."
            onRetry={refetch}
            className="h-48"
         />
      );
   }


   return (
      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-x-auto">
         {/* Header interne */}
         <div className="flex items-center justify-between px-4 py-5">
            <h3 className="text-lg font-semibold">Recent Tools</h3>

            <div className="flex items-center gap-2 text-xs text-muted">
               <Calendar className="h-4 w-4" />
               <span>Last 30 days</span>
            </div>
         </div>

         {/* Scroll container */}
         <div className="min-w-185">
            <Table className=" bg-surface">
               <THead>
                  <TR className="border-t-0">
                     <TH>Tool</TH>
                     <TH>Department</TH>
                     <TH>Users</TH>
                     <TH className="text-left">Monthly Cost</TH>
                     <TH>Status</TH>
                  </TR>
               </THead>
               <tbody>
                  {data.map((tool: any) => (
                     <TR key={tool.id}>
                        <TD>
                           <div className="flex items-center gap-3">
                              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-elevated">
                                 {tool.icon_url ? (
                                    <img
                                       src={tool.icon_url}
                                       alt={tool.name}
                                       className="h-full w-full object-contain p-1"
                                       loading="lazy"
                                       onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                          const parent = e.currentTarget.parentElement;
                                          if (!parent) return;
                                          parent.classList.add("text-xs", "font-semibold", "text-muted");
                                          parent.textContent = tool.name?.charAt(0) ?? "—";
                                       }} />
                                 ) : (
                                    <span className="text-xs font-semibold text-muted">
                                       {tool.name?.charAt(0)}
                                    </span>
                                 )}
                              </div>

                              <div className="min-w-0">
                                 <div className="truncate font-medium" title={tool.name}>
                                    {tool.name}
                                 </div>
                              </div>
                           </div>
                        </TD>
                        <TD>{tool.owner_department}</TD>
                        <TD>{tool.active_users_count}</TD>
                        <TD className="text-left">€{tool.monthly_cost}</TD>
                        <TD>
                           <StatusBadge status={tool.status} />
                        </TD>
                     </TR>
                  ))}
               </tbody>
            </Table>
         </div>
      </div>
   );
}
