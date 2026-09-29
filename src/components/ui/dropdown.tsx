"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

type DropdownProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  panelId: string;
  ariaLabel: string;
  className?: string;
  panelClassName?: string;
};

export function Dropdown({
  open,
  onOpenChange,
  trigger,
  children,
  panelId,
  ariaLabel,
  className,
  panelClassName,
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  const handlePanelTransitionEnd = () => {
    if (!open) setMounted(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {trigger}

      {mounted && (
        <div
          id={panelId}
          role="dialog"
          aria-label={ariaLabel}
          aria-hidden={!visible}
          onTransitionEnd={handlePanelTransitionEnd}
          className={cn(
            "dropdown-panel-shadow absolute top-full right-0 left-0 z-30 mt-2 origin-top overflow-hidden rounded-xl border border-border bg-surface transition-[opacity,transform] duration-200 ease-out",
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-1 scale-[0.98] opacity-0",
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
