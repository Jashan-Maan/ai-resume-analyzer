"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import AnalysisResult from "./AnalysisResult";

interface Suggestion {
  priority: "high" | "medium" | "low";
  suggestion: string;
}

interface Analysis {
  _id: string;
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  sectionsFound: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    summary: boolean;
  };
  createdAt: string;
}

interface AnalysisCardProps {
  analysis: Analysis;
  index: number;
}

function getScoreConfig(score: number) {
  if (score >= 80)
    return {
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      label: "Excellent",
    };
  if (score >= 60)
    return {
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      label: "Good",
    };
  if (score >= 40)
    return {
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      label: "Average",
    };
  return {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Poor",
  };
}

export default function AnalysisCard({ analysis, index }: AnalysisCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = getScoreConfig(analysis.atsScore);

  return (
    <Card className="overflow-hidden">
      {/* Card Header — always visible */}
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left — Score + Info */}
          <div className="flex items-center gap-4">
            {/* Score Circle */}
            <div
              className={`w-14 h-14 rounded-full ${config.bg} border-2 ${config.border} flex flex-col items-center justify-center shrink-0`}
            >
              <span className={`text-lg font-bold ${config.color}`}>
                {analysis.atsScore}
              </span>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800 text-sm">
                  Analysis #{index}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${config.color} ${config.border}`}
                >
                  {config.label}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1 max-w-md">
                {analysis.summary}
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                <Calendar size={11} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  {format(
                    new Date(analysis.createdAt),
                    "MMM dd, yyyy · hh:mm a",
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Quick stats + expand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex gap-2">
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                {analysis.strengths.length} strengths
              </span>
              <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">
                {analysis.weaknesses.length} weaknesses
              </span>
              <span className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full">
                {analysis.missingKeywords.length} missing
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-violet-600"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t px-5 pb-5 pt-4 bg-gray-50">
          <AnalysisResult data={analysis} />
        </div>
      )}
    </Card>
  );
}
