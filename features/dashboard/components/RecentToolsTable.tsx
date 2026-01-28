'use client'

import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { useRecentTools } from "../queries";

export default function RecentToolsTable() {
   const { data, isLoading } = useRecentTools();

   if (isLoading) {
      return <div className="h-48 animate-pulse rounded-2xl bg-surface" />;
   }

   return (
      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-x-auto">
         {/* Scroll container */}
         <div className="min-w-185">
            <Table className=" bg-surface">
               <THead>
                  <tr>
                     <TH>Tool</TH>
                     <TH>Department</TH>
                     <TH>Users</TH>
                     <TH className="text-left">Monthly Cost</TH>
                     <TH>Status</TH>
                  </tr>
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
