"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
   title?: string;
   description?: string;
   className?: string;
};

export function EmptyState({
   title = "No data available",
   description = "There is no data to display at the moment.",
   className,
}: EmptyStateProps) {
   return (
      <div
         className={cn(
            "rounded-2xl border border-dashed border-border bg-surface p-6 text-center text-muted",
            className
         )}
         role="status"
         aria-live="polite"
      >
         <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-elevated">
            <Inbox className="h-5 w-5" />
         </div>

         <div className="font-medium text-text">{title}</div>
         <div className="mt-1 text-sm">{description}</div>
      </div>
   );
}
