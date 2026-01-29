"use client";

import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

type SearchModalProps = {
   open: boolean;
   onClose: () => void;
   initialValue?: string;
   onSubmit: (query: string) => void;
};

function Portal({ children }: { children: React.ReactNode }) {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) return null;
   return createPortal(children, document.body);
}

export default function SearchModal({
   open,
   onClose,
   initialValue = "",
   onSubmit,
}: SearchModalProps) {
   const [value, setValue] = useState(initialValue);

   // Keep input in sync when opening the modal with a new initialValue.
   useEffect(() => {
      if (!open) return;
      setValue(initialValue);
   }, [open, initialValue]);

   return (
      <Portal>
         <div
            className={cn(
               "lg:hidden",
               open ? "pointer-events-auto" : "pointer-events-none"
            )}
            aria-hidden={!open}
         >
            {/* Backdrop */}
            <div
               className={cn(
                  "fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200",
                  open ? "opacity-100" : "opacity-0"
               )}
               aria-hidden="true"
               onClick={onClose}
            />

            {/* Modal */}
            <div
               id="search-modal"
               role="dialog"
               aria-modal="true"
               className={cn(
                  "fixed left-1/2 top-24 z-[110] w-[92vw] max-w-md -translate-x-1/2 rounded-xl border border-border bg-surface p-4 shadow-lg",
                  "transition duration-200 ease-out will-change-transform will-change-opacity",
                  open ? "opacity-100 scale-100" : "opacity-0 scale-95"
               )}
               onClick={(e) => e.stopPropagation()}
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

                  <label htmlFor="modal-search" className="sr-only">
                     Search tools
                  </label>
                  <input
                     id="modal-search"
                     aria-label="Search tools"
                     autoFocus={open}
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") onSubmit(value);
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
