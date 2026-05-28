// src/components/dashboard/StatsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: string;
}

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
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <div className={`${bg} p-2.5 rounded-lg`}>
            <Icon size={18} className={color} />
          </div>
        </div>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {trend && <p className="text-xs text-gray-400 mt-2">{trend}</p>}
      </CardContent>
    </Card>
  );
}
