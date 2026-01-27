import { cn } from "@/lib/utils/cn";

type Status = "active" | "expiring" | "unused";

const styles: Record<Status, string> = {
   active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
   expiring: "bg-orange-500/15 text-orange-400 border-orange-500/30",
   unused: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export function StatusBadge({
   status,
   className,
   children,
}: {
   status: Status;
   className?: string;
   children?: React.ReactNode;
}) {
   return (
      <span
         className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
            styles[status],
            className
         )}
      >
         {children ?? status}
      </span>
   );
}
