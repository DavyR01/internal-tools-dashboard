'use client';

import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
import type { Tool } from "../queries";

export default function ToolsTable({
   tools,
   isLoading,
   isError,
   onRetry,
}: {
   tools: Tool[];
   isLoading: boolean;
   isError: boolean;
   onRetry: () => void;
}) {
   if (isError) {
      return (
         <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="text-sm font-medium">Couldn’t load tools</div>
            <div className="mt-1 text-sm text-muted">Please retry.</div>
            <div className="mt-4">
               <Button variant="secondary" onClick={onRetry}>
                  Retry
               </Button>
            </div>
         </div>
      );
   }


   function formatCurrencyEUR(value: unknown) {
      const n = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(n)) return "—";
      return new Intl.NumberFormat("fr-FR", {
         style: "currency",
         currency: "EUR",
         maximumFractionDigits: 0,
      }).format(n);
   }

   return (
      <div className="-mx-4 overflow-x-auto px-4">
         <div className="min-w-[950px]">
            <Table>
               <THead>
                  <TR className="border-t-0">
                     <TH className="sticky left-0 z-20 bg-surface">Tool</TH>
                     <TH>Category</TH>
                     <TH>Department</TH>
                     <TH className="text-right whitespace-nowrap">Users</TH>
                     <TH className="text-right whitespace-nowrap">Monthly cost</TH>
                     <TH className="text-right whitespace-nowrap">Last update</TH>
                     <TH>Status</TH>
                     <TH className="sticky right-0 z-20 bg-surface text-right whitespace-nowrap">
                        Actions
                     </TH>
                  </TR>
               </THead>

               <tbody>
                  {isLoading ? (
                     Array.from({ length: 8 }).map((_, i) => (
                        <TR key={i}>
                           <TD colSpan={8} className="py-4">
                              <div className="h-4 w-full animate-pulse rounded-lg bg-elevated/70" />
                           </TD>
                        </TR>
                     ))
                  ) : tools.length === 0 ? (
                     <TR>
                        <TD colSpan={8} className="py-10 text-center text-sm text-muted">
                           No tools found.
                        </TD>
                     </TR>
                  ) : (
                     tools.map((tool) => (
                        <TR key={tool.id}>
                           <TD className="sticky left-0 z-10 bg-surface">
                              <div className="flex items-center gap-3">
                                 <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl bg-elevated flex items-center justify-center">
                                    <img
                                       src={tool.icon_url}
                                       alt=""
                                       className="h-full w-full object-contain p-1"
                                       loading="lazy"
                                       onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                          e.currentTarget.parentElement?.classList.add("text-xs", "font-semibold", "text-muted");
                                          e.currentTarget.parentElement!.textContent = tool.name.charAt(0);
                                       }}
                                    />
                                 </div>
                                 <div className="min-w-0 max-w-75">
                                    <div className="truncate font-medium" title={tool.name}>
                                       {tool.name}
                                    </div>
                                    <div className="truncate text-xs text-muted" title={tool.description}>
                                       {tool.description}
                                    </div>
                                 </div>

                              </div>
                           </TD>
                           <TD className="text-muted">{tool.category}</TD>
                           <TD className="text-muted">{tool.owner_department}</TD>
                           <TD className="text-right whitespace-nowrap">{tool.active_users_count}</TD>
                           <TD className="text-right whitespace-nowrap">
                              {formatCurrencyEUR(tool.monthly_cost)}
                           </TD>
                           <TD className="text-right whitespace-nowrap">
                              {new Date(tool.updated_at).toLocaleDateString()}
                           </TD>
                           <TD>
                              <StatusBadge status={tool.status} />
                           </TD>
                           <TD className="sticky right-0 z-10 bg-surface text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                 <Button variant="secondary">
                                    View
                                 </Button>
                                 <Button variant="secondary">
                                    Edit
                                 </Button>
                              </div>
                           </TD>
                        </TR>
                     ))
                  )}
               </tbody>
            </Table>
         </div>
      </div>
   );
}
