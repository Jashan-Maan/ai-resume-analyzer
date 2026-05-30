import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "applied" | "interview" | "offer" | "rejected";
}

const statusConfig = {
  applied: {
    label: "Applied",
    className: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50",
  },
  interview: {
    label: "Interview",
    className:
      "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-50",
  },
  offer: {
    label: "Offer",
    className: "bg-green-50 text-green-600 border-green-200 hover:bg-green-50",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-600 border-red-200 hover:bg-red-50",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
