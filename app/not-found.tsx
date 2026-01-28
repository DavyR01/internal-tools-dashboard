"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
   return (
      <div className="flex min-h-dvh items-center justify-center bg-bg px-4">
         <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-elevated">
               <AlertTriangle className="h-6 w-6" />
            </div>

            <h1 className="text-lg font-semibold">Page not found</h1>

            <p className="mt-2 text-sm text-muted">
               The page you are looking for doesn’t exist or has been moved.
            </p>

            <div className="mt-6 flex justify-center gap-2">
               <Link
                  href="/"
                  className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-elevated"
               >
                  Go to dashboard
               </Link>

               <Link
                  href="/tools"
                  className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-elevated"
               >
                  View tools
               </Link>
            </div>
         </div>
      </div>
   );
}
