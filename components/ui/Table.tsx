import { cn } from "@/lib/utils/cn";

export function Table({
   className,
   ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
   return (
      <div className="overflow-hidden rounded-2xl">
         <table
            className={cn("w-full border-collapse text-sm", className)}
            {...props}
         />
      </div>
   );
}

export function THead({
   className,
   ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
   return (
      <thead
         className={cn("bg-elevated/70 text-muted", className)}
         {...props}
      />
   );
}

export function TH({
   className,
   ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
   return (
      <th
         className={cn("px-4 py-3 text-left font-medium", className)}
         {...props}
      />
   );
}

export function TR({
   className,
   ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
   return (
      <tr
         className={cn(
            "border-t border-border transition hover:bg-elevated/60",
            className
         )}
         {...props}
      />
   );
}

export function TD({
   className,
   ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
   return <td className={cn("px-4 py-3", className)} {...props} />;
}
