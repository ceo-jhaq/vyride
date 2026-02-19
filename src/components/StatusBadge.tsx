import { VerificationStatus } from "@/types/vyride";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
}

const config: Record<VerificationStatus, { label: string; icon: typeof ShieldCheck; className: string; bgClass: string }> = {
  safe: {
    label: "Verified Safe",
    icon: ShieldCheck,
    className: "text-safe-foreground",
    bgClass: "bg-safe-gradient",
  },
  warning: {
    label: "Warning",
    icon: ShieldAlert,
    className: "text-warning-foreground",
    bgClass: "bg-warning-gradient",
  },
  unsafe: {
    label: "Unsafe",
    icon: ShieldX,
    className: "text-unsafe-foreground",
    bgClass: "bg-unsafe-gradient",
  },
};

const sizeClasses = {
  sm: "px-2.5 py-1 text-xs gap-1",
  md: "px-3.5 py-1.5 text-sm gap-1.5",
  lg: "px-5 py-2.5 text-base gap-2",
};

const iconSizes = { sm: 12, md: 16, lg: 20 };

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { label, icon: Icon, className, bgClass } = config[status];
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${bgClass} ${className} ${sizeClasses[size]} ${status === "safe" ? "animate-pulse-safe" : ""}`}
    >
      <Icon size={iconSizes[size]} />
      {label}
    </span>
  );
}
