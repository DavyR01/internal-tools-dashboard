"use client";

import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

type SearchModalProps = {
   open: boolean;
   onClose: () => void;
   initialValue?: string;
   onSubmit: (query: string) => void;
};


function Portal({ children }: { children: React.ReactNode }) {
   if (typeof window === "undefined") return null;
   return createPortal(children, document.body);
}

export default function SearchModal({ open, onClose, initialValue = "", onSubmit }: SearchModalProps) {
   const [value, setValue] = useState(initialValue);

   useEffect(() => {
      if (open) setValue(initialValue);
   }, [open, initialValue]);

   if (!open) return null;
   if (!open) return null;

   return (
      <Portal>
         <div className="lg:hidden">
            {/* Backdrop */}
            <button
               type="button"
               className="fixed inset-0 z-[100] bg-black/50"
               aria-label="Close search"
               onClick={onClose}
            />

            {/* Modal */}
            <div
               id="search-modal"
               role="dialog"
               aria-modal="true"
               className="fixed left-1/2 top-24 z-[110] w-[92vw] max-w-md -translate-x-1/2 rounded-xl border border-border bg-surface p-4 shadow-lg"
            >
               <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">Search</div>
                  <div className="flex-1" />
                  <button
                     type="button"
                     className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
                     aria-label="Close search"
                     onClick={onClose}
                  >
                     <X className="h-5 w-5" />
                  </button>
               </div>

               <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />

                  {/* A11y label (audit-proof) */}
                  <label htmlFor="modal-search" className="sr-only">
                     Search tools
                  </label>
                  <input
                     id="modal-search"
                     aria-label="Search tools"
                     autoFocus
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           onSubmit(value);
                        }
                     }}
                     className="h-10 w-full rounded-xl border border-border bg-transparent pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/40"
                     placeholder="Search Tools..."
                  />
               </div>
            </div>
         </div>
      </Portal>
   );
}
