import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Analysis from "@/models/Analysis";
import AnalysisCard from "@/components/dashboard/AnalysisCard";
import { BarChart2 } from "lucide-react";
import Link from "next/link";

export default async function AnalysesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();

  const rawAnalyses = await Analysis.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // ✅ Serialize everything to plain objects
  const analyses = rawAnalyses.map((a) => ({
    _id: a._id.toString(),
    userId: a.userId,
    atsScore: a.atsScore,
    summary: a.summary,
    strengths: a.strengths,
    weaknesses: a.weaknesses,
    missingKeywords: a.missingKeywords,
    suggestions: a.suggestions.map(
      (s: { priority: string; suggestion: string }) => ({
        priority: s.priority,
        suggestion: s.suggestion,
      }),
    ),
    sectionsFound: {
      experience: a.sectionsFound.experience,
      education: a.sectionsFound.education,
      skills: a.sectionsFound.skills,
      projects: a.sectionsFound.projects,
      summary: a.sectionsFound.summary,
    },
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-violet-50 p-2 rounded-lg">
            <BarChart2 size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Analyses</h1>
            <p className="text-gray-500 text-sm">
              {analyses.length} total
              {analyses.length !== 1 ? " analyses" : " analysis"}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/analyze"
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          ✦ New Analysis
        </Link>
      </div>

      {/* Stats Summary */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-violet-600">
              {analyses.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Analyses</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(
                analyses.reduce((sum, a) => sum + a.atsScore, 0) /
                  analyses.length,
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">Average ATS Score</p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {Math.max(...analyses.map((a) => a.atsScore))}
            </p>
            <p className="text-sm text-gray-500 mt-1">Best Score</p>
          </div>
        </div>
      )}

      {/* Analyses List */}
      {analyses.length === 0 ? (
        <div className="bg-white rounded-xl border p-16 text-center">
          <p className="text-5xl mb-4">📊</p>
          <h3 className="font-semibold text-gray-800 mb-2 text-lg">
            No analyses yet
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Analyze your resume to see your ATS score and improvement
            suggestions
          </p>
          <Link
            href="/dashboard/analyze"
            className="bg-violet-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-violet-700 transition inline-block"
          >
            Analyze Your Resume
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis, index) => (
            <AnalysisCard
              key={analysis._id}
              analysis={analysis}
              index={analyses.length - index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
