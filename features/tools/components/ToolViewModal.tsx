"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Tool } from "../queries";

function formatDate(value?: string) {
   if (!value) return "—";
   const d = new Date(value);
   if (Number.isNaN(d.getTime())) return "—";
   return d.toLocaleDateString();
}

export default function ToolViewModal({
   open,
   tool,
   onClose,
}: {
   open: boolean;
   tool: Tool | null;
   onClose: () => void;
}) {
   if (!open || !tool) return null;

   return (
      <Modal open title="Tool details" onClose={onClose}>
         <div className="space-y-4 text-sm">
            <div>
               <div className="text-xs text-muted">Name</div>
               <div className="font-medium">{tool.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                  <div className="text-xs text-muted">Category</div>
                  <div>{tool.category ?? "—"}</div>
               </div>
               <div>
                  <div className="text-xs text-muted">Vendor</div>
                  <div>{tool.vendor ?? "—"}</div>
               </div>
               <div>
                  <div className="text-xs text-muted">Department</div>
                  <div>{tool.owner_department ?? "—"}</div>
               </div>
               <div>
                  <div className="text-xs text-muted">Status</div>
                  <div>{tool.status}</div>
               </div>
               <div>
                  <div className="text-xs text-muted">Users</div>
                  <div>{tool.active_users_count ?? "—"}</div>
               </div>
               <div>
                  <div className="text-xs text-muted">Monthly cost</div>
                  <div>{typeof tool.monthly_cost === "number" ? `${tool.monthly_cost} €` : "—"}</div>
               </div>
            </div>

            <div>
               <div className="text-xs text-muted">Description</div>
               <div className="text-muted">{tool.description ?? "—"}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                  <div className="text-xs text-muted">Created</div>
                  <div>{formatDate(tool.created_at)}</div>
               </div>
               <div>
                  <div className="text-xs text-muted">Last update</div>
                  <div>{formatDate(tool.updated_at)}</div>
               </div>
            </div>

            {tool.website_url ? (
               <div>
                  <div className="text-xs text-muted">Website</div>
                  <a
                     href={tool.website_url}
                     target="_blank"
                     rel="noreferrer"
                     className="underline underline-offset-4"
                  >
                     {tool.website_url}
                  </a>
               </div>
            ) : null}

            <div className="flex justify-end pt-2">
               <Button variant="secondary" onClick={onClose}>
                  Close
               </Button>
            </div>
         </div>
      </Modal>
   );
}
