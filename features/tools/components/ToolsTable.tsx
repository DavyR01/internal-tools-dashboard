"use client";

import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
import { useToggleToolStatus, type Tool } from "../queries";


const TOOL_COL_W = "w-[340px]";
const ACTIONS_COL_W = "w-[170px]";


function formatCurrencyEUR(value: unknown) {
   const n = typeof value === "number" ? value : Number(value);
   if (!Number.isFinite(n)) return "—";
   return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
   }).format(n);
}

function formatDate(value: unknown) {
   const d = new Date(String(value));
   if (Number.isNaN(d.getTime())) return "—";
   return d.toLocaleDateString();
}

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

   const toggleStatus = useToggleToolStatus();

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

   return (
      <div className="-mx-4 overflow-x-auto px-4">
         <div className="min-w-[1200px]">
            <Table>
               <THead>
                  <TR className="border-t-0">
                     <TH
                        className={[
                           "sticky left-0 z-30 bg-surface",
                           TOOL_COL_W,
                           "shadow-[8px_0_12px_-12px_rgba(0,0,0,0.35)]",
                        ].join(" ")}
                     >
                        Tool
                     </TH>
                     <TH>Category</TH>
                     <TH>Department</TH>
                     <TH className="text-right whitespace-nowrap">Users</TH>
                     <TH className="text-right whitespace-nowrap">Monthly cost</TH>
                     <TH className="text-right whitespace-nowrap">Last update</TH>
                     <TH>Status</TH>
                     <TH
                        className={[
                           "sticky right-0 z-30 bg-surface text-right whitespace-nowrap",
                           ACTIONS_COL_W,
                           "shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]",
                        ].join(" ")}
                     >
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
                     tools.map((tool) => {
                        const isRowLoading =
                           toggleStatus.isPending &&
                           toggleStatus.variables?.id === tool.id;
                        return (
                           <TR key={tool.id}>
                              {/* TOOL (sticky left) */}
                              <TD
                                 className={[
                                    "sticky left-0 z-20 bg-surface",
                                    TOOL_COL_W,
                                    "shadow-[8px_0_12px_-12px_rgba(0,0,0,0.35)]",
                                 ].join(" ")}
                              >
                                 <div className="flex items-center gap-3">
                                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-elevated">
                                       <img
                                          src={tool.icon_url}
                                          alt=""
                                          className="h-full w-full object-contain p-1"
                                          loading="lazy"
                                          onError={(e) => {
                                             // fallback: hide broken img + show initial
                                             e.currentTarget.style.display = "none";
                                             const parent = e.currentTarget.parentElement;
                                             if (!parent) return;
                                             parent.classList.add("text-xs", "font-semibold", "text-muted");
                                             parent.textContent = tool.name?.charAt(0) ?? "—";
                                          }}
                                       />
                                    </div>

                                    <div className="min-w-0 max-w-[240px]">
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
                              <TD className="text-right whitespace-nowrap">{tool.active_users_count ?? "—"}</TD>
                              <TD className="text-right whitespace-nowrap">{formatCurrencyEUR(tool.monthly_cost)}</TD>
                              <TD className="text-right whitespace-nowrap">{formatDate(tool.updated_at)}</TD>

                              <TD>
                                 <StatusBadge status={tool.status} />
                              </TD>

                              {/* ACTIONS (sticky right) */}
                              <TD
                                 className={[
                                    "right-0 z-20 bg-surface text-right whitespace-nowrap",
                                    ACTIONS_COL_W,
                                 ].join(" ")}
                              >
                                 <div className="inline-flex items-center justify-end gap-2">
                                    <Button
                                       variant="secondary"
                                       className="h-8 px-3 text-xs"
                                       onClick={() => {
                                          const nextStatus = tool.status === "active" ? "unused" : "active";
                                          toggleStatus.mutate({ id: tool.id, nextStatus });
                                       }}
                                       disabled={isRowLoading}
                                    >
                                       {tool.status === "active" ? "Disable" : "Enable"}
                                    </Button>

                                    <Button variant="secondary" className="h-8 px-3 text-xs">
                                       View
                                    </Button>
                                    <Button variant="secondary" className="h-8 px-3 text-xs">
                                       Edit
                                    </Button>
                                 </div>
                              </TD>
                           </TR>
                        )
                     })
                  )}
               </tbody>
            </Table>
         </div>
      </div>
   );
}
