"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, Sun, Moon, X, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MobileDrawer from "@/components/layout/MobileDrawer";

export const navItems = [
   { label: "Dashboard", href: "/" },
   { label: "Tools", href: "/tools" },
   { label: "Analytics", href: "/analytics" },
   { label: "Settings", href: "", disabled: true },
];

const THEME_STORAGE_KEY = "it-dashboard-theme"; // "dark" | "light"

function cx(...classes: Array<string | false | undefined>) {
   return classes.filter(Boolean).join(" ");
}

function Portal({ children }: { children: React.ReactNode }) {
   if (typeof window === "undefined") return null;
   return createPortal(children, document.body);
}

export default function Header() {
   const pathname = usePathname();

   const [dark, setDark] = useState(false);
   const [hydrated, setHydrated] = useState(false);

   const [mobileOpen, setMobileOpen] = useState(false);
   const [searchOpen, setSearchOpen] = useState(false);

   // Load persisted theme (do not write before hydration)
   useEffect(() => {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      setDark(saved === "dark");
      setHydrated(true);
   }, []);

   // Apply + persist theme
   useEffect(() => {
      if (!hydrated) return;
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
   }, [dark, hydrated]);

   // Close overlays on route change
   useEffect(() => {
      setMobileOpen(false);
      setSearchOpen(false);
   }, [pathname]);

   // Shared ESC + body scroll lock for any overlay
   useEffect(() => {
      if (!mobileOpen && !searchOpen) return;

      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            setMobileOpen(false);
            setSearchOpen(false);
         }
      };
      document.addEventListener("keydown", onKeyDown);

      const body = document.body;
      const prevOverflow = body.style.overflow;
      const prevPaddingRight = body.style.paddingRight;

      const scrollbarWidth =
         window.innerWidth - document.documentElement.clientWidth;

      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
         document.removeEventListener("keydown", onKeyDown);
         body.style.overflow = prevOverflow;
         body.style.paddingRight = prevPaddingRight;
      };
   }, [mobileOpen, searchOpen]);

   return (
      <header className="sticky top-0 z-[50] border-b border-border backdrop-blur bg-surface">
         <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-3 md:gap-3 md:px-4">
            {/* Mobile */}
            <button
               onClick={() => setMobileOpen(true)}
               aria-expanded={mobileOpen}
               aria-controls="mobile-nav"
               type="button"
               className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border md:hidden"
               aria-label="Open menu"
            >
               <Menu className="h-5 w-5" />
            </button>

            {/* Brand */}
            <Link href="/" className="flex items-center gap-2">
               <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500" />
               <div className="hidden leading-tight xs:block">
                  <div className="text-md font-semibold">TechCorp</div>
               </div>
            </Link>

            {/* Nav desktop */}
            <nav className="ml-6 hidden items-center gap-1 md:flex">
               {navItems.map((item) => {
                  const active = pathname === item.href;

                  if (item.disabled) {
                     return (
                        <div
                           key={item.label}
                           className="rounded-lg px-3 py-2 text-sm opacity-40 cursor-default"
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
                        className={cx(
                           "rounded-lg px-3 py-2 text-sm transition",
                           active
                              ? "font-semibold"
                              : "opacity-80 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/5"
                        )}
                     >
                        {item.label}
                     </Link>
                  );
               })}
            </nav>

            <div className="flex-1" />

            {/* Search desktop */}
            <div className="relative hidden w-90 max-w-[40vw] lg:block">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />

               <label htmlFor="header-search" className="sr-only">
                  Search tools
               </label>
               <input
                  id="header-search"
                  aria-label="Search tools"
                  className="h-10 w-full rounded-xl border bg-transparent pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="Search Tools..."
               />
            </div>

            {/* Search icon under lg */}
            <button
               type="button"
               className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border lg:hidden"
               aria-label="Search"
               onClick={() => setSearchOpen(true)}
               aria-expanded={searchOpen}
               aria-controls="search-modal"
            >
               <Search className="h-5 w-5" />
            </button>

            {/* Theme */}
            <button
               type="button"
               onClick={() => setDark((v) => !v)}
               className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
               aria-label="Toggle theme"
            >
               {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button
               type="button"
               className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
               aria-label="Notifications"
            >
               <Bell className="h-5 w-5" />
               <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-xs font-semibold text-white">
                  3
               </span>
            </button>

            {/* Settings (hidden under 480px) */}
            <button
               type="button"
               className="hidden xs:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border opacity-80 hover:opacity-100"
               aria-label="Settings"
               disabled
            >
               <Settings className="h-5 w-5" />
            </button>

            {/* Avatar */}
            <button
               type="button"
               className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-linear-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white"
               aria-label="User menu"
            >
               A
            </button>
         </div>

         {/* Mobile nav (drawer) */}
         <MobileDrawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            pathname={pathname}
            navItems={navItems}
         />

         {/* Search modal */}
         {searchOpen && (
            <Portal>
               <div className="lg:hidden">
                  {/* Backdrop */}
                  <button
                     type="button"
                     className="fixed inset-0 z-[100] bg-black/50"
                     aria-label="Close search"
                     onClick={() => setSearchOpen(false)}
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
                           onClick={() => setSearchOpen(false)}
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
                           autoFocus
                           className="h-10 w-full rounded-xl border border-border bg-transparent pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/40"
                           placeholder="Search Tools..."
                        />
                     </div>
                  </div>
               </div>
            </Portal>
         )}
      </header>
   );
}
