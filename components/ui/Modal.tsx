"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Modal({
   open,
   onClose,
   title,
   children,
}: {
   open: boolean;
   onClose: () => void;
   title: string;
   children: ReactNode;
}) {
   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50">
         {/* backdrop (visual only) */}
         <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

         {/* click-catcher */}
         <div
            className="absolute inset-0 flex items-center justify-center p-4"
            onClick={onClose}
         >
            <div
               className={cn(
                  "relative w-full max-w-lg rounded-2xl border border-border bg-surface shadow-lg"
               )}
               role="dialog"
               aria-modal="true"
               onClick={(e) => e.stopPropagation()}
            >
               <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                  <div className="text-sm font-semibold">{title}</div>
                  <button
                     type="button"
                     className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-elevated/60"
                     onClick={onClose}
                     aria-label="Close modal"
                  >
                     ✕
                  </button>
               </div>

               <div className="p-5">{children}</div>
            </div>
         </div>
      </div>
   );
}
