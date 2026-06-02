"use client";
import { StringExpression } from "mongoose";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StatusChartProps {
  data: {
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
  };
}

const COLORS = {
  applied: "#6366f1", // violet
  interview: "#f59e0b", // amber
  offer: "#22c55e", // green
  rejected: "#ef4444", // red
};

export default function StatusChart({ data }: StatusChartProps) {
  const chartData = [
    { name: "Applied", value: data.applied, color: COLORS.applied },
    { name: "Interview", value: data.interview, color: COLORS.interview },
    { name: "Offer", value: data.offer, color: COLORS.offer },
    { name: "Rejected", value: data.rejected, color: COLORS.rejected },
  ].filter((item) => item.value > 0); // only show non-zero

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No applications yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          cursor={{ stroke: "transparent" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const item = payload[0];
              return (
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-sm">
                  <p className="font-medium text-gray-700">{item.name}</p>
                  <p className="text-gray-500">
                    {item.value} (
                    {Math.round(((item.value as number) / total) * 100)}%)
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
