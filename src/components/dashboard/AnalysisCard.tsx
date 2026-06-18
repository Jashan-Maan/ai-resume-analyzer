// Mark as Client Component — uses useState for expand/collapse interactivity
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import AnalysisResult from "./AnalysisResult";

/**
 * Represents a single actionable suggestion returned by the AI analysis,
 * tagged with a priority level to help users focus on what matters most.
 */
interface Suggestion {
  priority: "high" | "medium" | "low";
  suggestion: string;
}

/**
 * Shape of an AI resume analysis result as returned by the API.
 * Contains the ATS compatibility score, textual feedback, and a
 * breakdown of which standard resume sections were detected.
 */
interface Analysis {
  _id: string;
  atsScore: number;        // 0–100 ATS compatibility score
  summary: string;         // Brief overall assessment
  strengths: string[];     // What the resume does well
  weaknesses: string[];    // Areas that need improvement
  missingKeywords: string[]; // Job-description keywords absent from the resume
  suggestions: Suggestion[];
  sectionsFound: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    summary: boolean;
  };
  createdAt: string;       // ISO timestamp of when the analysis was generated
}

/**
 * Props for AnalysisCard.
 *
 * @prop analysis - The full analysis object to render.
 * @prop index    - 1-based display index shown in the card header (e.g. "Analysis #3").
 */
interface AnalysisCardProps {
  analysis: Analysis;
  index: number;
}

/**
 * Returns a theme configuration (colors, border, label) based on the ATS score.
 * Used to visually differentiate scores at a glance:
 *   80+  → green  ("Excellent")
 *   60+  → blue   ("Good")
 *   40+  → yellow ("Average")
 *   <40  → red    ("Poor")
 */
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

/**
 * AnalysisCard — Collapsible card displaying a single resume analysis.
 *
 * In its collapsed state the card shows a colour-coded score circle, a one-line
 * summary, the analysis date, and quick stat pills (strengths / weaknesses /
 * missing keywords). Clicking the expand button reveals the full
 * `<AnalysisResult>` breakdown beneath a divider.
 */
export default function AnalysisCard({ analysis, index }: AnalysisCardProps) {
  // Controls whether the detailed AnalysisResult section is visible
  const [expanded, setExpanded] = useState(false);

  // Derive colour/label config from the ATS score
  const config = getScoreConfig(analysis.atsScore);

  return (
    <Card className="overflow-hidden">
      {/* Card Header — always visible, contains score circle + meta + quick stats */}
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left section — Score circle and textual info */}
          <div className="flex items-center gap-4">
            {/* Colour-coded score circle */}
            <div
              className={`w-14 h-14 rounded-full ${config.bg} border-2 ${config.border} flex flex-col items-center justify-center shrink-0`}
            >
              <span className={`text-lg font-bold ${config.color}`}>
                {analysis.atsScore}
              </span>
            </div>

            {/* Info block — title, summary preview, and timestamp */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800 text-sm">
                  Analysis #{index}
                </span>
                {/* Score quality badge (e.g. "Excellent", "Good") */}
                <Badge
                  variant="outline"
                  className={`text-xs ${config.color} ${config.border}`}
                >
                  {config.label}
                </Badge>
              </div>
              {/* One-line summary — truncated with line-clamp for long text */}
              <p className="text-xs text-gray-500 line-clamp-1 max-w-md">
                {analysis.summary}
              </p>
              {/* Formatted creation date */}
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

          {/* Right section — Quick stat pills and expand/collapse toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Stat pills — hidden on small screens to keep the layout clean */}
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
            {/* Expand / Collapse toggle button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-sky-blue-600"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Expanded Details — renders the full analysis breakdown when toggled open */}
      {expanded && (
        <div className="border-t px-5 pb-5 pt-4 bg-gray-50">
          <AnalysisResult data={analysis} />
        </div>
      )}
    </Card>
  );
}
