"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Heart, FolderGit2, ChevronDown, ChevronUp } from "lucide-react";

interface TechnicalQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

interface BehavioralQuestion {
  question: string;
  tip: string;
}

interface ProjectQuestion {
  question: string;
  project: string;
}

interface InterviewData {
  technical: TechnicalQuestion[];
  behavioral: BehavioralQuestion[];
  projectBased: ProjectQuestion[];
}

interface InterviewResultProps {
  data: InterviewData;
}

function getDifficultyConfig(difficulty: string) {
  if (difficulty === "easy")
    return {
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    };
  if (difficulty === "medium")
    return {
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    };
  return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
}

// Single expandable question card
function QuestionCard({
  number,
  question,
  children,
}: {
  number: number;
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition"
      >
        <span className="bg-violet-100 text-violet-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          {number}
        </span>
        <span className="text-sm font-medium text-gray-800 flex-1">
          {question}
        </span>
        {open ? (
          <ChevronUp size={16} className="text-gray-400 shrink-0 mt-0.5" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 shrink-0 mt-0.5" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 bg-gray-50 border-t">{children}</div>
      )}
    </div>
  );
}

export default function InterviewResult({ data }: InterviewResultProps) {
  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {data.technical.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Technical</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {data.behavioral.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Behavioral</p>
        </div>
        <div className="bg-violet-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-violet-600">
            {data.projectBased.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Project Based</p>
        </div>
      </div>

      {/* Technical Questions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-blue-600">
            <Code size={16} />
            Technical Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.technical.map((q, i) => {
            const diff = getDifficultyConfig(q.difficulty);
            return (
              <QuestionCard key={i} number={i + 1} question={q.question}>
                <div className="flex items-center gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className={`text-xs ${diff.color} ${diff.border} ${diff.bg}`}
                  >
                    {q.difficulty}
                  </Badge>
                  <span className="text-xs text-gray-500 bg-white border rounded-full px-2 py-0.5">
                    {q.topic}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Focus on explaining your thought process step by step
                </p>
              </QuestionCard>
            );
          })}
        </CardContent>
      </Card>

      {/* Behavioral Questions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-green-600">
            <Heart size={16} />
            Behavioral Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.behavioral.map((q, i) => (
            <QuestionCard key={i} number={i + 1} question={q.question}>
              <div className="mt-3 bg-white border rounded-lg p-3">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  💡 What interviewer wants to see:
                </p>
                <p className="text-xs text-gray-500">{q.tip}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Use the STAR method: Situation → Task → Action → Result
              </p>
            </QuestionCard>
          ))}
        </CardContent>
      </Card>

      {/* Project Based Questions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-violet-600">
            <FolderGit2 size={16} />
            Project Based Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.projectBased.map((q, i) => (
            <QuestionCard key={i} number={i + 1} question={q.question}>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5">
                  📁 {q.project}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                💡 Be specific about your role, tech choices, and challenges
                overcome
              </p>
            </QuestionCard>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
