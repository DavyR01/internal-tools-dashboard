"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ToolsTable from "./ToolsTable";
import ToolViewModal from "./ToolViewModal";
import ToolEditModal from "./ToolEditModal";
import {
   useDepartments,
   useToolsList,
   useUpdateTool,
   type Tool,
   type ToolStatus,
   type ToolsSortBy,
   type SortOrder,
} from "../queries";

//  Debounce hook (correct: uses useEffect, not useMemo).
function useDebouncedValue<T>(value: T, delay = 300) {
   const [debounced, setDebounced] = useState(value);

   useEffect(() => {
      const t = window.setTimeout(() => setDebounced(value), delay);
      return () => window.clearTimeout(t);
   }, [value, delay]);

   return debounced;
}

type ToolModalState =
   | { mode: "view"; tool: Tool }
   | { mode: "edit"; tool: Tool }
   | null;

const TOOL_STATUSES: ToolStatus[] = ["active", "expiring", "unused"];

function parseStatus(value: string): ToolStatus | "all" {
   if (value === "all") return "all";
   if ((TOOL_STATUSES as readonly string[]).includes(value)) return value as ToolStatus;
   return "all";
}

export default function ToolsCatalog() {
   const searchParams = useSearchParams();
   const urlQ = searchParams.get("q") ?? "";

   // Pagination & filters (local UI state)
   const [page, setPage] = useState(1);
   const limit = 10;

   const [status, setStatus] = useState<ToolStatus | "all">("all");
   const [department, setDepartment] = useState<string>("all");
   const [sortBy, setSortBy] = useState<ToolsSortBy>("updated_at");
   const [order, setOrder] = useState<SortOrder>("desc");

   // Search input state:
   const [q, setQ] = useState(urlQ);
   const debouncedQ = useDebouncedValue(q, 300);

   // When user types / changes filters, we reset the page
   function resetPage() {
      setPage(1);
   }

   // Build query params for the server list
   const params = useMemo(
      () => ({
         page,
         limit,
         sortBy,
         order,
         status: status === "all" ? undefined : status,
         department: department === "all" ? undefined : department,
         q: debouncedQ.trim() ? debouncedQ : undefined,
      }),
      [page, limit, sortBy, order, status, department, debouncedQ]
   );

   const tools = useToolsList(params);
   const departments = useDepartments();

   const totalPages = tools.data
      ? Math.max(1, Math.ceil(tools.data.total / tools.data.limit))
      : 1;

   // ---- Modal state (view/edit) ----
   const [modal, setModal] = useState<ToolModalState>(null);
   const closeModal = () => setModal(null);

   // ---- Edit mutation (modal handles its own form UI) ----
   const updateTool = useUpdateTool();

   const [, setEditMonthlyCost] = useState<number | "">("");
   const [, setEditStatus] = useState<ToolStatus>("active");
   const [, setEditName] = useState("");

   function openView(tool: Tool) {
      setModal({ mode: "view", tool });
   }

   function openEdit(tool: Tool) {
      setEditMonthlyCost(
         typeof tool.monthly_cost === "number"
            ? tool.monthly_cost
            : tool.monthly_cost != null
               ? Number(tool.monthly_cost)
               : ""
      );
      setEditStatus(tool.status);
      setEditName(tool.name ?? "");
      setModal({ mode: "edit", tool });
   }

   return (
      <Card>
         <CardContent className="space-y-4">
            {/* Filters row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Search: key={urlQ} ensures UI picks up global header search without an effect */}
                  <div className="space-y-1" key={urlQ}>
                     <div className="text-xs text-muted">Search</div>
                     <Input
                        value={q}
                        onChange={(e) => {
                           setQ(e.target.value);
                           resetPage();
                        }}
                        placeholder="Search tools…"
                     />
                  </div>

                  <div className="space-y-1">
                     <div className="text-xs text-muted">Status</div>
                     <select
                        className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:ring-1"
                        value={status}
                        onChange={(e) => {
                           setStatus(parseStatus(e.target.value));
                           resetPage();
                        }}
                     >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="expiring">Expiring</option>
                        <option value="unused">Unused</option>
                     </select>
                  </div>

                  <div className="space-y-1">
                     <div className="text-xs text-muted">Department</div>
                     <select
                        className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:ring-1 focus:ring-ring/30"
                        value={department}
                        onChange={(e) => {
                           setDepartment(e.target.value);
                           resetPage();
                        }}
                     >
                        <option value="all">All</option>
                        {(departments.data ?? []).map((d) => (
                           <option key={d.id} value={d.name}>
                              {d.name}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-1">
                     <div className="text-xs text-muted">Sort</div>
                     <select
                        className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:ring-1 focus:ring-ring/30"
                        value={`${sortBy}:${order}`}
                        onChange={(e) => {
                           const [sb, ord] = e.target.value.split(":");
                           setSortBy(sb as ToolsSortBy);
                           setOrder(ord as SortOrder);
                           resetPage();
                        }}
                     >
                        <option value="updated_at:desc">Last update (desc)</option>
                        <option value="updated_at:asc">Last update (asc)</option>
                        <option value="monthly_cost:desc">Monthly cost (desc)</option>
                        <option value="monthly_cost:asc">Monthly cost (asc)</option>
                        <option value="name:asc">Name (A→Z)</option>
                        <option value="name:desc">Name (Z→A)</option>
                     </select>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <Button
                     variant="secondary"
                     onClick={() => {
                        // Reset local UI state; URL q remains
                        // header search still deep-links via /tools?q=...
                        setQ("");
                        setStatus("all");
                        setDepartment("all");
                        setSortBy("updated_at");
                        setOrder("desc");
                        setPage(1);
                     }}
                  >
                     Reset
                  </Button>
               </div>
            </div>

            {/* Table */}
            <ToolsTable
               tools={tools.data?.items ?? []}
               isLoading={tools.isLoading}
               isError={tools.isError}
               onRetry={() => tools.refetch()}
               onView={openView}
               onEdit={openEdit}
            />

            {/* Footer */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
               <div className="text-sm text-muted">
                  {tools.data ? (
                     <>
                        Showing <span className="text-text">{tools.data.items.length}</span> of{" "}
                        <span className="text-text">{tools.data.total}</span> tools
                     </>
                  ) : (
                     "—"
                  )}
                  {tools.isFetching ? <span className="ml-2 text-xs">(refreshing…)</span> : null}
               </div>

               <div className="flex items-center gap-2">
                  <Button
                     variant="secondary"
                     onClick={() => setPage((p) => Math.max(1, p - 1))}
                     disabled={page <= 1}
                  >
                     Prev
                  </Button>
                  <div className="text-sm text-muted">
                     Page <span className="text-text">{page}</span> /{" "}
                     <span className="text-text">{totalPages}</span>
                  </div>
                  <Button
                     variant="secondary"
                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                     disabled={page >= totalPages}
                  >
                     Next
                  </Button>
               </div>
            </div>

            {/* ---- Modals ---- */}
            {modal?.mode === "view" ? (
               <ToolViewModal open tool={modal.tool} onClose={closeModal} />
            ) : null}

            {modal?.mode === "edit" ? (
               <ToolEditModal
                  open
                  tool={modal.tool}
                  onClose={closeModal}
                  isSaving={updateTool.isPending}
                  isError={updateTool.isError}
                  onSave={(patch) => {
                     updateTool.mutate(
                        { id: modal.tool.id, patch },
                        { onSuccess: closeModal }
                     );
                  }}
               />
            ) : null}
         </CardContent>
      </Card>
   );
}
