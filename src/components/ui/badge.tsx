import { cn } from "@/utils/cn";

type BadgeVariant = "default" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-badge text-badge-fg",
  info: "bg-badge-info-bg text-badge-info-fg",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
