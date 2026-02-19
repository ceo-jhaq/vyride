import { VerificationStatus } from "@/types/vyride";

type Props = {
  status: VerificationStatus;
  size?: "sm" | "md";
};

const CONFIG: Record<VerificationStatus, { label: string; cls: string; dot: string }> = {
  verified: {
    label: "Verified",
    cls: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
  },
  unverified: {
    label: "Unverified",
    cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
};

export const StatusBadge = ({ status, size = "md" }: Props) => {
  const config = CONFIG[status] ?? CONFIG.unverified;
  const textSize = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${textSize} ${config.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
};
