import clsx from "clsx";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "gold" | "charcoal" | "outline";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" && "bg-charcoal-100 text-charcoal-700",
        variant === "gold" && "gold-gradient text-white",
        variant === "charcoal" && "bg-charcoal-800 text-white",
        variant === "outline" && "border border-charcoal-200 text-charcoal-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
