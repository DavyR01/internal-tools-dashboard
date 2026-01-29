"use client";

import * as React from "react";
import { X, Search } from "lucide-react";

type SearchModalProps = {
   open: boolean;
   onClose: () => void;
   initialValue?: string;
   onSubmit: (query: string) => void;
};

export default function SearchModal({
   open,
   onClose,
   initialValue = "",
   onSubmit,
}: SearchModalProps) {
   const inputRef = React.useRef<HTMLInputElement | null>(null);
   const [value, setValue] = React.useState(initialValue);

   // Keep input in sync when modal is reopened with a new initialValue
   React.useEffect(() => {
      if (!open) return;
      setValue(initialValue);
   }, [open, initialValue]);

   // Focus input when opening (no setState involved)
   React.useEffect(() => {
      if (!open) return;
      requestAnimationFrame(() => inputRef.current?.focus());
   }, [open]);

   const handleSubmit = () => {
      onSubmit(value.trim());
   };

   return (
      <div
         // Always mounted: smooth open/close with CSS only
         className={[
            "fixed inset-0 z-200 lg:hidden", // keep consistent with your overlay layering
            "transition-opacity duration-200 ease-out",
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
         ].join(" ")}
         aria-hidden={!open}
         onClick={onClose}
      >
         {/* Backdrop */}
         <div className="absolute inset-0 bg-black/40" />

         {/* Panel */}
         <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className={[
               "absolute left-1/2 top-16 w-[92%] max-w-lg -translate-x-1/2",
               "rounded-2xl border border-border bg-surface shadow-xl",
               "transition-all duration-200 ease-out",
               open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-[0.98] opacity-0",
            ].join(" ")}
            onClick={(e) => e.stopPropagation()}
         >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
               <div className="text-sm font-medium">Search tools</div>
               <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="Close"
               >
                  <X className="h-4 w-4" />
               </button>
            </div>

            <div className="p-4">
               <label htmlFor="mobile-search" className="sr-only">
                  Search tools
               </label>

               <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                  <input
                     ref={inputRef}
                     id="mobile-search"
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                     }}
                     className="h-11 w-full rounded-xl border border-border bg-transparent pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/40"
                     placeholder="Search Tools..."
                  />
               </div>

               <div className="mt-3 flex justify-end gap-2">
                  <button
                     type="button"
                     onClick={onClose}
                     className="h-10 rounded-xl border border-border px-4 text-sm transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                     Cancel
                  </button>
                  <button
                     type="button"
                     onClick={handleSubmit}
                     className="h-10 rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
                  >
                     Search
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
