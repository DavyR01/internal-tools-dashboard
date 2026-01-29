"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Tool, ToolStatus } from "../queries";

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
   onSave: (patch: Partial<Pick<Tool, "name" | "monthly_cost" | "status">>) => void;
   isSaving: boolean;
   isError: boolean;
}) {
   // Important: if the modal is closed or tool is missing, do not mount it.

   // Initialize form state from the current tool *on mount*.
   const [name, setName] = useState(() => tool?.name ?? "");
   const [monthlyCost, setMonthlyCost] = useState<number | "">(() =>
      typeof tool?.monthly_cost === "number" ? tool?.monthly_cost : ""
   );
   const [status, setStatus] = useState<ToolStatus>(() => tool?.status ?? "active");

   // Lightweight "dirty" detection if you later want to disable Save unless changes.
   const canSave = useMemo(() => !isSaving, [isSaving]);

   if (!open || !tool) return null;

   return (
      <Modal open title="Edit tool" onClose={onClose}>
         <div className="space-y-4">
            <div className="space-y-1">
               <div className="text-xs text-muted">Name</div>
               <Input className="border-muted/40" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1">
               <div className="text-xs text-muted">Monthly cost (€)</div>
               <input
                  className="h-10 w-full rounded-xl border border-muted/40 bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  type="number"
                  value={monthlyCost}
                  onChange={(e) =>
                     setMonthlyCost(e.target.value === "" ? "" : Number(e.target.value))
                  }
               />
            </div>

            <div className="space-y-1">
               <div className="text-xs text-muted">Status</div>
               <select
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
