import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
   className,
   variant = "secondary",
   ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
   return (
      <button
         className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium",
            "transition focus:outline-none focus:ring-2 focus:ring-ring/40",
            "disabled:cursor-not-allowed disabled:opacity-60",
            variant === "primary" &&
            "bg-linear-to-br from-purple-500 to-pink-500 text-white hover:opacity-95",
            variant === "secondary" &&
            "border border-border bg-elevated hover:bg-elevated/70",
            variant === "ghost" && "hover:bg-elevated/60",
            className
         )}
         {...props}
      />
   );
}
