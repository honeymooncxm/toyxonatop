import clsx from "clsx";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("font-display text-xl font-semibold tracking-tight text-charcoal-900", className)}>
      To&apos;yxona<span className="gold-text-gradient">Top</span>
    </span>
  );
}
