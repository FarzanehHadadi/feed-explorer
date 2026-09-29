import { cn } from "@/utils/cn";

type AppIconProps = {
  className?: string;
  title?: string;
};

export function AppIcon({ className, title = "Feed Explorer" }: AppIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="8" className="fill-icon-bg" />
      <rect
        x="7"
        y="8"
        width="11"
        height="2.5"
        rx="1.25"
        className="fill-icon-line opacity-90"
      />
      <rect
        x="7"
        y="14"
        width="17"
        height="2.5"
        rx="1.25"
        className="fill-icon-line opacity-70"
      />
      <rect
        x="7"
        y="20"
        width="14"
        height="2.5"
        rx="1.25"
        className="fill-icon-line opacity-50"
      />
      <circle cx="24" cy="10" r="3" className="fill-accent" />
    </svg>
  );
}
