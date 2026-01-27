import { cn } from "@/lib/utils/cn";

type Status = "active" | "expiring" | "unused";

const styles: Record<Status, string> = {
   active: "bg-emerald-500 text-white border-emerald-500/30",
   expiring: "bg-gradient-to-br from-orange-300 to-orange-500 text-white border-orange-500/30",
   unused: "bg-gradient-to-br from-red-400 to-red-700 text-white border-red-500/30",
};

export const formatStatus = (status: Status) =>
   status.charAt(0).toUpperCase() + status.slice(1);


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
         {children ?? formatStatus(status)}
      </span>
   );
}
