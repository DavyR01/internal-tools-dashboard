"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ToolsTable from "./ToolsTable";
import {
   useDepartments,
   useToolsList,
   Tool,
   ToolStatus,
   ToolsSortBy,
   SortOrder,
   useUpdateTool,
} from "../queries";
import ToolViewModal from "./ToolViewModal";
import ToolEditModal from "./ToolEditModal";

function useDebouncedValue<T>(value: T, delay = 300) {
   const [debounced, setDebounced] = useState(value);

   useMemo(() => {
      const t = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(t);
   }, [value, delay]);

   return debounced;
}

type ToolModalState =
   | { mode: "view"; tool: Tool }
   | { mode: "edit"; tool: Tool }
   | null;

function formatDate(value: string | undefined) {
   if (!value) return "—";
   const d = new Date(value);
   if (Number.isNaN(d.getTime())) return "—";
   return d.toLocaleDateString();
}

export default function ToolsCatalog() {
   const [page, setPage] = useState(1);
   const limit = 10;

   const [status, setStatus] = useState<ToolStatus | "all">("all");
   const [department, setDepartment] = useState<string>("all");
   const [sortBy, setSortBy] = useState<ToolsSortBy>("updated_at");
   const [order, setOrder] = useState<SortOrder>("desc");

   const [q, setQ] = useState("");
   const debouncedQ = useDebouncedValue(q, 300);

   const params = {
      page,
      limit,
      sortBy,
      order,
      status: status === "all" ? undefined : status,
      department: department === "all" ? undefined : department,
      q: debouncedQ.trim() ? debouncedQ : undefined,
   } as const;

   const tools = useToolsList(params);
   const departments = useDepartments();

   const totalPages = tools.data ? Math.max(1, Math.ceil(tools.data.total / tools.data.limit)) : 1;

   function resetPage() {
      setPage(1);
   }

   // ---- Modal state (view/edit) ----
   const [modal, setModal] = useState<ToolModalState>(null);
   const closeModal = () => setModal(null);

   // ---- Edit form state (minimal) ----
   const updateTool = useUpdateTool();
   const [editMonthlyCost, setEditMonthlyCost] = useState<number | "">("");
   const [editStatus, setEditStatus] = useState<ToolStatus>("active");
   const [editName, setEditName] = useState("");

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

   function onSaveEdit() {
      if (!modal || modal.mode !== "edit") return;

      const patch: Partial<Pick<Tool, "monthly_cost" | "status" | "name">> = {
         status: editStatus,
      };

      if (editMonthlyCost !== "") patch.monthly_cost = editMonthlyCost;
      if (editName.trim()) patch.name = editName.trim();

      updateTool.mutate(
         { id: modal.tool.id, patch },
         {
            onSuccess: () => closeModal(),
         }
      );
   }

   return (
      <Card>
         <CardContent className="space-y-4">
            {/* Filters row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
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
                        className="h-10 w-full rounded-xl border border-border/20 bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                        value={status}
                        onChange={(e) => {
                           setStatus(e.target.value as any);
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
                        className="h-10 w-full rounded-xl border border-border/20 bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
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
                        className="h-10 w-full rounded-xl border border-border/20 bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
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
               isError={!!tools.error}
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
               <ToolViewModal
                  open={modal?.mode === "view"}
                  tool={modal?.tool ?? null}
                  onClose={closeModal}
               />
            ) : null}

            {modal?.mode === "edit" ? (
               <ToolEditModal
                  open={modal?.mode === "edit"}
                  tool={modal?.tool ?? null}
                  onClose={closeModal}
                  isSaving={updateTool.isPending}
                  isError={updateTool.isError}
                  onSave={(patch) => {
                     if (!modal?.tool) return;
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
