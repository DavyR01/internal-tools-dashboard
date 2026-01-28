import { cn } from "@/lib/utils/cn";

export function Input({
   className,
   ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
   return (
      <input
         className={cn(
            "h-10 w-full rounded-xl border border-border bg-elevated px-3 text-sm outline-none",
            "focus:ring-1 focus:ring-ring/40",
            className
         )}
         {...props}
      />
   );
}
