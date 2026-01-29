"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, Menu, Search, Sun, Moon, Settings } from "lucide-react";
import {
   useCallback,
   useEffect,
   useRef,
   useState,
   useSyncExternalStore,
} from "react";
import MobileDrawer from "@/components/layout/MobileDrawer";
import SearchModal from "@/components/layout/SearchModal";

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

// This avoids hydration warnings and keeps strict lint happy.
function useIsClient(): boolean {
   return useSyncExternalStore(
      () => () => {
      },
      () => true,
      () => false
   );
}

type HeaderInnerProps = {
   pathname: string;
   initialQuery: string;
};

function HeaderInner({ pathname, initialQuery }: HeaderInnerProps) {
   // Infra
   const router = useRouter();
   const isClient = useIsClient();

   // State
   const [dark, setDark] = useState<boolean>(() => {
      if (typeof window === "undefined") return false;
      return document.documentElement.classList.contains("dark");
   });

   const [mobileOpen, setMobileOpen] = useState(false);
   const [searchOpen, setSearchOpen] = useState(false);
   const [query, setQuery] = useState(initialQuery);

   // Refs
   const searchInputRef = useRef<HTMLInputElement | null>(null);

   // Memoized callbacks
   const closeOverlays = useCallback(() => {
      setMobileOpen(false);
      setSearchOpen(false);
   }, []);

   // Handlers
   function toggleTheme() {
      setDark((prev) => {
         const next = !prev;

         const root = document.documentElement;
         root.classList.toggle("dark", next);
         localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");

         return next;
      });
   }

   function submitSearch(raw?: string) {
      const q = (raw ?? query).trim();
      const href = q ? `/tools?q=${encodeURIComponent(q)}` : "/tools";

      // Ask the next Header instance to restore focus
      sessionStorage.setItem("headerSearchFocus", "1");

      router.push(href);
      setSearchOpen(false);
   }

   // Effects (side effects / subscriptions only)

   // Apply + persist theme (external side-effects only)
   useEffect(() => {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
   }, [dark]);

   // Shared ESC + body scroll lock for any overlay
   useEffect(() => {
      if (!mobileOpen && !searchOpen) return;

      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") closeOverlays();
      };

      document.addEventListener("keydown", onKeyDown);

      const body = document.body;
      const prevOverflow = body.style.overflow;
      const prevPaddingRight = body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
         document.removeEventListener("keydown", onKeyDown);
         body.style.overflow = prevOverflow;
         body.style.paddingRight = prevPaddingRight;
      };
   }, [mobileOpen, searchOpen, closeOverlays]);

   // Restore focus after navigation across remount
   useEffect(() => {
      const shouldFocus = sessionStorage.getItem("headerSearchFocus") === "1";
      if (!shouldFocus) return;

      sessionStorage.removeItem("headerSearchFocus");

      // Wait for DOM paint to ensure input exists
      requestAnimationFrame(() => {
         searchInputRef.current?.focus();
      });
   }, []);


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
                  ref={searchInputRef}
                  id="header-search"
                  aria-label="Search tools"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter") submitSearch();
                  }}
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
            {isClient ? (
               <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
                  aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
               >
                  {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
               </button>
            ) : (
               <div
                  className="h-9 w-9 rounded-xl border border-border bg-surface"
                  aria-hidden
               />
            )}

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
            onClose={closeOverlays}
            pathname={pathname}
            navItems={navItems}
            onSearch={(q) => submitSearch(q)}
         />

         {/* Search modal */}
         <SearchModal
            open={searchOpen}
            onClose={closeOverlays}
            initialValue={query}
            onSubmit={(q) => submitSearch(q)}
         />
      </header>
   );
}

export default function Header() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const initialQuery =
      pathname === "/tools" ? searchParams.get("q") ?? "" : "";

   // Remount header on navigation and querystring updates to avoid setState in effects.
   const qParam = pathname === "/tools" ? searchParams.get("q") ?? "" : "";
   const headerKey = `${pathname}?q=${qParam}`;

   return (
      <HeaderInner
         key={headerKey}
         pathname={pathname}
         initialQuery={initialQuery}
      />
   );
}
