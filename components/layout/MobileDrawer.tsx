"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type NavItem = {
   label: string;
   href: string;
   disabled?: boolean;
};

type MobileDrawerProps = {
   open: boolean;
   onClose: () => void;
   pathname: string;
   navItems: NavItem[];
   onSearch: (q: string) => void;
};

function Portal({ children }: { children: React.ReactNode }) {
   if (typeof window === "undefined") return null;
   return createPortal(children, document.body);
}

export default function MobileDrawer({
   open,
   onClose,
   pathname,
   navItems,
   onSearch,
}: MobileDrawerProps) {
   const [query, setQuery] = useState("");

   return (
      <Portal>
         <div
            className={cn(
               "md:hidden",
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

            {/* Panel */}
            <div
               id="mobile-nav"
               role="dialog"
               aria-modal="true"
               className={cn(
                  "fixed left-0 top-0 z-[110] h-dvh w-[85vw] max-w-sm border-r border-border bg-surface p-4 shadow-lg",
                  "transition-transform duration-200 ease-out will-change-transform",
                  open ? "translate-x-0" : "-translate-x-4 -translate-x-full"
               )}
               onClick={(e) => e.stopPropagation()}
            >
               <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500" />
                  <div className="text-md font-semibold">TechCorp</div>

                  <div className="flex-1" />
                  <button
                     type="button"
                     className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
                     aria-label="Close menu"
                     onClick={onClose}
                  >
                     <X className="h-5 w-5" />
                  </button>
               </div>

               {/* Search (mobile) */}
               <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />

                  <label htmlFor="drawer-search" className="sr-only">
                     Search tools
                  </label>
                  <input
                     id="drawer-search"
                     aria-label="Search tools"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        onSearch(query);
                        onClose();
                     }}
                     className="h-10 w-full rounded-xl border border-border bg-transparent pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/40"
                     placeholder="Search Tools..."
                  />
               </div>

               <nav className="mt-4 grid gap-1">
                  {navItems.map((item) => {
                     const active = pathname === item.href;

                     if (item.disabled) {
                        return (
                           <div
                              key={item.label}
                              className="flex items-center rounded-xl px-3 py-2 text-sm opacity-40 cursor-default"
                              aria-disabled="true"
                           >
                              {item.label}
                           </div>
                        );
                     }

                     return (
                        <Link
                           key={item.href}
                           href={item.href}
                           onClick={onClose}
                           className={[
                              "flex items-center rounded-xl px-3 py-2 text-sm transition",
                              active
                                 ? "font-semibold"
                                 : "opacity-80 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/5",
                           ].join(" ")}
                        >
                           {item.label}
                        </Link>
                     );
                  })}
               </nav>
            </div>
         </div>
      </Portal>
   );
}
