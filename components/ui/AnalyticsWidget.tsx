"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

type AnalyticsWidgetProps = {
   title: string;
   description?: string;

   isLoading?: boolean;
   isError?: boolean;
   onRetry?: () => void;

   isEmpty?: boolean;
   emptyTitle?: string;
   emptyDescription?: string;

   children: ReactNode;
};

export function AnalyticsWidget({
   title,
   description,
   isLoading,
   isError,
   onRetry,
   isEmpty,
   emptyTitle,
   emptyDescription,
   children,
}: AnalyticsWidgetProps) {
   return (
      <Card>
         <div className="flex items-start justify-between gap-4 px-5 pt-5">
            <div>
               <h3 className="text-sm font-medium">{title}</h3>
               {description ? (
                  <p className="mt-1 text-xs text-muted">{description}</p>
               ) : null}
            </div>
         </div>

         <div className="px-5 pb-5 pt-4">
            {isLoading ? (
               <div className="h-64 animate-pulse rounded-2xl bg-elevated" />
            ) : isError ? (
               <ErrorState
                  title={`Unable to load ${title.toLowerCase()}`}
                  description="Please check your connection and try again."
                  onRetry={onRetry}
               />
            ) : isEmpty ? (
               <EmptyState
                  title={emptyTitle ?? "No data available"}
                  description={
                     emptyDescription ?? "There is no data to display at the moment."
                  }
               />
            ) : (
               children
            )}
         </div>
      </Card>
   );
}
