import { Badge } from "@/components/ui/badge";

/**
 * Props for the StatusBadge component.
 * @property status - The job application status, which determines the badge's visual styling.
 */
interface StatusBadgeProps {
  status: "applied" | "interview" | "offer" | "rejected";
}

/**
 * Configuration mapping for each status type, defining the display label
 * and Tailwind CSS classes for badges (background, text, border, and hover state).
 */
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

/**
 * A responsive status badge component that displays the application status
 * with themed color styling according to the current status.
 */
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

