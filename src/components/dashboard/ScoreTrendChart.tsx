"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

/**
 * Properties expected by the ScoreTrendChart component.
 */
interface ScoreTrendProps {
  /** Array of historical resume analysis records containing scores and timestamps. */
  analyses: {
    atsScore: number;
    createdAt: string;
  }[];
}

/**
 * ScoreTrendChart renders a visual progression line chart showing the history of ATS scores over time.
 * It uses the recharts package to deliver a responsive, styled SVG chart visualization.
 */
export default function ScoreTrendChart({ analyses }: ScoreTrendProps) {
  // Render placeholder if there is no trend data to display
  if (analyses.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No analyses yet
      </div>
    );
  }

  // Prepares chart dataset by reversing the array so that oldest analyses appear first
  const data = analyses
    .slice()
    .reverse() // oldest first
    .map((a, i) => ({
      name: `Analysis ${i + 1}`,
      score: a.atsScore,
      date: format(new Date(a.createdAt), "MMM dd"),
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        {/* Subtle grid layout for the chart backdrop */}
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        
        {/* X-Axis displaying analysis dates */}
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
        
        {/* Y-Axis bound to score scale [0 - 100] */}
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
        
        {/* Interactive tooltip shown when hovering over chart points */}
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-sm">
                  <p className="text-gray-500 mb-1">{label}</p>
                  <p className="font-semibold text-sky-blue-600">
                    {payload[0].value}/100
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        
        {/* Line drawing specifying score progress mapping */}
        <Line
          type="monotone"
          dataKey="score"
          stroke="#007acc"
          strokeWidth={2.5}
          dot={{ fill: "#007acc", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
