"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";

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
}: MobileDrawerProps) {
   if (!open) return null;

   return (
      <Portal>
         <div className="md:hidden">
            {/* Backdrop */}
            <button
               type="button"
               className="fixed inset-0 z-[100] bg-black/50"
               aria-label="Close menu"
               onClick={onClose}
            />

            {/* Panel */}
            <div
               id="mobile-nav"
               role="dialog"
               aria-modal="true"
               className="fixed left-0 top-0 z-[110] h-dvh w-[85vw] max-w-sm border-r border-border bg-surface p-4 shadow-lg"
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
