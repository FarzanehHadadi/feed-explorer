import { cn } from "@/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-surface-input px-3 py-2.5 text-sm text-text-primary placeholder:text-placeholder focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        className,
      )}
      {...props}
    />
  );
}

type SearchInputProps = Omit<InputProps, "type"> & {
  icon?: React.ReactNode;
};

export function SearchInput({ className, icon, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-icon">
          {icon}
        </span>
      )}
      <Input
        type="search"
        className={cn(icon ? "pl-9" : undefined, className)}
        {...props}
      />
    </div>
  );
}
