"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Tool, ToolStatus } from "../queries";

type ToolPatch = Partial<
   Pick<Tool, "name" | "monthly_cost" | "status" | "active_users_count">
>;

export default function ToolEditModal({
   open,
   tool,
   onClose,
   onSave,
   isSaving,
   isError,
}: {
   open: boolean;
   tool: Tool | null;
   onClose: () => void;
   onSave: (patch: ToolPatch) => void;
   isSaving: boolean;
   isError: boolean;
}) {
   
   // Hooks MUST be called unconditionally (even when modal is closed).
   // State is initialized from the tool only on mount.
   const [name, setName] = useState(() => tool?.name ?? "");
   const [monthlyCost, setMonthlyCost] = useState<number | "">(() =>
      typeof tool?.monthly_cost === "number" ? tool.monthly_cost : ""
   );
   const [users, setUsers] = useState<number | "">(() =>
      typeof tool?.active_users_count === "number" ? tool.active_users_count : ""
   );
   const [status, setStatus] = useState<ToolStatus>(() => tool?.status ?? "active");

   const canSave = useMemo(() => !isSaving, [isSaving]);

   if (!open || !tool) return null;

   const nameId = "tool-edit-name";
   const monthlyCostId = "tool-edit-monthly-cost";
   const usersId = "tool-edit-users";
   const statusId = "tool-edit-status";

   return (
      <Modal open title="Edit tool" onClose={onClose}>
         <div className="space-y-4">
            <div className="space-y-1">
               <label className="text-xs text-muted" htmlFor={nameId}>
                  Name
               </label>
               <Input
                  id={nameId}
                  className="border-muted/40"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />
            </div>

            <div className="space-y-1">
               <label className="text-xs text-muted" htmlFor={monthlyCostId}>
                  Monthly cost (€)
               </label>
               <input
                  id={monthlyCostId}
                  className="h-10 w-full rounded-xl border border-muted/40 bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  type="number"
                  value={monthlyCost}
                  onChange={(e) =>
                     setMonthlyCost(e.target.value === "" ? "" : Number(e.target.value))
                  }
               />
            </div>

            <div className="space-y-1">
               <label className="text-xs text-muted" htmlFor={usersId}>
                  Users
               </label>
               <input
                  id={usersId}
                  className="h-10 w-full rounded-xl border border-muted/40 bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  type="number"
                  min={0}
                  value={users}
                  onChange={(e) => setUsers(e.target.value === "" ? "" : Number(e.target.value))}
               />
            </div>

            <div className="space-y-1">
               <label className="text-xs text-muted" htmlFor={statusId}>
                  Status
               </label>
               <select
                  id={statusId}
                  className="h-10 w-full rounded-xl border border-muted/40 bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ToolStatus)}
               >
                  <option value="active">Active</option>
                  <option value="expiring">Expiring</option>
                  <option value="unused">Unused</option>
               </select>
            </div>

            {isError ? (
               <div className="rounded-xl border border-muted/40 bg-elevated/50 p-3 text-sm">
                  <div className="font-medium">Couldn’t save changes</div>
                  <div className="text-muted">Please retry.</div>
               </div>
            ) : null}

            <div className="flex justify-end gap-2 pt-2">
               <Button variant="secondary" onClick={onClose} disabled={isSaving}>
                  Cancel
               </Button>
               <Button
                  onClick={() =>
                     onSave({
                        name: name.trim() || undefined,
                        monthly_cost: monthlyCost === "" ? undefined : monthlyCost,
                        active_users_count: users === "" ? undefined : users,
                        status,
                     })
                  }
                  disabled={!canSave}
               >
                  {isSaving ? "Saving…" : "Save"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
