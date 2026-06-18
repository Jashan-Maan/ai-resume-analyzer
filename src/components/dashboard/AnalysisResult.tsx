"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb,
  Target,
} from "lucide-react";

/** Suggestion represents a recommendation with a priority level. */
interface Suggestion {
  priority: "high" | "medium" | "low";
  suggestion: string;
}

/** SectionsFound indicates which resume sections were detected in the analysis. */
interface SectionsFound {
  experience: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  summary: boolean;
}

/** AnalysisData aggregates all analysis results for a resume. */
interface AnalysisData {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  sectionsFound: SectionsFound;
}

/** Props for the AnalysisResult component. */
interface AnalysisResultProps {
  data: AnalysisData;
}

/** Returns color and label config based on ATS score. */
function getScoreColor(score: number) {
  if (score >= 80)
    return { text: "text-green-600", bg: "bg-green-50", label: "Excellent" };
  if (score >= 60)
    return { text: "text-blue-600", bg: "bg-blue-50", label: "Good" };
  if (score >= 40)
    return { text: "text-yellow-600", bg: "bg-yellow-50", label: "Average" };
  return { text: "text-red-600", bg: "bg-red-50", label: "Poor" };
}

/** Returns CSS classes for suggestion priority badges. */
function getPriorityColor(priority: string) {
  if (priority === "high") return "bg-red-50 text-red-600 border-red-200";
  if (priority === "medium")
    return "bg-yellow-50 text-yellow-600 border-yellow-200";
  return "bg-green-50 text-green-600 border-green-200";
}

/** Renders detailed analysis result including score, strengths, weaknesses, and suggestions. */
export default function AnalysisResult({ data }: AnalysisResultProps) {
  const scoreConfig = getScoreColor(data.atsScore);

  return (
    <div className="space-y-6">
      {/* ATS Score + Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Circle */}
        <Card className="text-center">
          <CardContent className="pt-6 pb-6">
            <div
              className={`w-28 h-28 rounded-full ${scoreConfig.bg} flex flex-col items-center justify-center mx-auto mb-3 border-4 ${scoreConfig.text} border-current`}
            >
              <span className={`text-4xl font-bold ${scoreConfig.text}`}>
                {data.atsScore}
              </span>
              <span className={`text-xs font-medium ${scoreConfig.text}`}>
                / 100
              </span>
            </div>
            <p className="font-semibold text-gray-800">ATS Score</p>
            <Badge
              variant="outline"
              className={`mt-1 ${scoreConfig.text} border-current`}
            >
              {" "}
              {scoreConfig.label}
            </Badge>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target size={16} className="text-sky-blue-600" />
              Overall Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm leading-relaxed">
              {data.summary}
            </p>

            {/* Sections Found */}
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Sections Detected
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.sectionsFound)
                  .filter(([key]) => key !== "_id")
                  .map(([key, found]) => (
                    <span
                      key={key}
                      className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        found
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {found ? (
                        <CheckCircle size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-green-600">
              <CheckCircle size={16} />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.strengths.map((strength, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-red-500">
              <XCircle size={16} />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.weaknesses.map((weakness, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      {/* Missing Keywords */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-orange-500">
            <AlertCircle size={16} />
            Missing Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.missingKeywords.length === 0 ? (
            <p className="text-sm text-gray-500">No missing keywords found!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((keyword, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-orange-50 text-orange-600 border-orange-200"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-sky-blue-600">
            <Lightbulb size={16} />
            Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.suggestions.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
              >
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs ${getPriorityColor(item.priority)}`}
                >
                  {item.priority}
                </Badge>
                <p className="text-sm text-gray-600">{item.suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
