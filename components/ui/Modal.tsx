"use client";

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
   children: React.ReactNode;
}) {
   if (!open) return null;

   return (
      <div className="fixed inset-0 z-[50]">
         {/* backdrop */}
         <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
         />

         {/* panel */}
         <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
               className={cn(
                  "w-full max-w-lg rounded-2xl border border-border bg-surface shadow-lg",
                  "relative"
               )}
               role="dialog"
               aria-modal="true"
            >
               <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                  <div className="text-sm font-semibold">{title}</div>
                  <button
                     className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-elevated/60"
                     onClick={onClose}
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
