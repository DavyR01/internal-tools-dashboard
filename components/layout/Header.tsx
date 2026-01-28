"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, Sun, Moon, X, Settings } from "lucide-react";
import { useEffect, useState } from "react";


const navItems = [
   { label: "Dashboard", href: "/" },
   { label: "Tools", href: "/tools" },
   { label: "Analytics", href: "/analytics" },
   { label: "Settings", href: "", disabled: true },
];

function cx(...classes: Array<string | false | undefined>) {
   return classes.filter(Boolean).join(" ");
}

export default function Header() {
   const pathname = usePathname();
   const [dark, setDark] = useState(false);
   const [mobileOpen, setMobileOpen] = useState(false);

   useEffect(() => {
      document.documentElement.classList.toggle("dark", dark);
   }, [dark]);

   useEffect(() => {
      setMobileOpen(false);
   }, [pathname]);

   useEffect(() => {
      if (!mobileOpen) return;

      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") setMobileOpen(false);
      };
      document.addEventListener("keydown", onKeyDown);

      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
         document.removeEventListener("keydown", onKeyDown);
         document.body.style.overflow = prevOverflow;
      };
   }, [mobileOpen]);

   return (
      <header className="sticky top-0 z-50 border-b border-border backdrop-blur bg-surface">
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

            {/* Search */}
            <div className="relative hidden w-90 max-w-[40vw] md:block">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
               <input
                  className="h-10 w-full rounded-xl border bg-transparent pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="Search Tools..."
               />
            </div>

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

            {/* Settings */}
            <button
               type="button"
               className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border opacity-80 hover:opacity-100"
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
         {mobileOpen && (
            <div className="md:hidden">
               {/* Backdrop */}
               <button
                  type="button"
                  className="fixed inset-0 z-40 bg-black/30"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
               />

               {/* Panel */}
               <div
                  id="mobile-nav"
                  role="dialog"
                  aria-modal="true"
                  className="fixed left-0 top-0 z-50 h-dvh w-[85vw] max-w-sm border-r border-border bg-surface p-4 shadow-lg"
               >
                  <div className="flex items-center gap-2">
                     <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500" />
                     <div className="text-md font-semibold">TechCorp</div>

                     <div className="flex-1" />
                     <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
                        aria-label="Close menu"
                        onClick={() => setMobileOpen(false)}
                     >
                        <X className="h-5 w-5" />
                     </button>
                  </div>

                  {/* Search (mobile) */}
                  <div className="relative mt-4">
                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                     <input
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
                                 className="flex items-center rounded-xl px-3 py-2 text-sm opacity-40 cursor-not-allowed"
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
                              onClick={() => setMobileOpen(false)}
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
         )}

      </header>
   );
}
