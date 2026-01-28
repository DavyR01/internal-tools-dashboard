"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ErrorStateProps = {
   title?: string;
   description?: string;
   onRetry?: () => void;
   className?: string;
};

export function ErrorState({
   title = "Something went wrong",
   description = "Please try again.",
   onRetry,
   className,
}: ErrorStateProps) {
   return (
      <div
         className={cn(
            "rounded-2xl border border-border bg-surface p-4 shadow-sm",
            className
         )}
         role="alert"
         aria-live="polite"
      >
         <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-elevated">
               <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
               <div className="font-semibold">{title}</div>
               <div className="mt-1 text-sm text-muted">{description}</div>

               {onRetry && (
                  <button
                     type="button"
                     onClick={onRetry}
                     className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-transparent px-3 py-2 text-sm font-medium hover:bg-elevated"
                  >
                     <RefreshCcw className="h-4 w-4" />
                     Retry
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}
