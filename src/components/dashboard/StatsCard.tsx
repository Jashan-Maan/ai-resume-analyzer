"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

/**
 * Props for the StatsCard component.
 */
interface StatsCardProps {
  /** The descriptive text for the metric (e.g. "Total Resumes") */
  label: string;
  /** The numeric value of the metric to display */
  value: number;
  /** Lucide icon component to visually represent the metric */
  icon: LucideIcon;
  /** CSS class(es) for the text color of the icon and value */
  color: string;
  /** CSS class(es) for the background color of the icon wrapper */
  bg: string;
  /** Optional trend or metadata text to display at the bottom (e.g. "+12% this month") */
  trend?: string;
}

/**
 * StatsCard component.
 * Displays a single metric with a title label, big numeric value, decorative icon, and an optional trend label.
 */
export default function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  trend,
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Top bar with Label and Icon wrapper */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <div className={`${bg} p-2.5 rounded-lg`}>
            <Icon size={18} className={color} />
          </div>
        </div>

        {/* Main numeric display */}
        <p className={`text-3xl font-bold ${color}`}>{value}</p>

        {/* Optional trend description line */}
        {trend && <p className="text-xs text-gray-400 mt-2">{trend}</p>}
      </CardContent>
    </Card>
  );
}
