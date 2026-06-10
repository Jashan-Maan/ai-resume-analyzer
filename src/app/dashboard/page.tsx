import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import Analysis from "@/models/Analysis";
import StatsCard from "@/components/dashboard/StatsCard";
import StatusChart from "@/components/dashboard/StatusChart";
import ScoreTrendChart from "@/components/dashboard/ScoreTrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, XCircle, Trophy } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();

  // Fetch real data
  const [jobs, analyses] = await Promise.all([
    Job.find({ userId: session.user.id }).lean(),
    Analysis.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  // Calculate stats
  const stats = {
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  const firstName = session.user?.name?.split(" ")[0];

  const bestScore =
    analyses.length > 0 ? Math.max(...analyses.map((a) => a.atsScore)) : 0;

  const interviewRate =
    jobs.length > 0 ? Math.round((stats.interview / jobs.length) * 100) : 0;

  return (
    <div className="relative space-y-8">
      {/* Background Glow */}
      <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="absolute inset-0 bg-linear-to-r from-sky-500/10 via-blue-500/5 to-purple-500/10" />

        <div className="relative flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">Career Dashboard</p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Welcome back, {firstName}
            </h1>

            <p className="mt-2 text-slate-500">
              Track applications, monitor ATS scores, and accelerate your job
              search journey.
            </p>
          </div>

          <Link
            href="/dashboard/analyze"
            className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-sky-600 to-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-sky-500/20 transition hover:scale-105"
          >
            Analyze Resume
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Applications Applied",
            value: jobs.length,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: `${stats.applied} active`,
          },
          {
            label: "Interviews",
            value: stats.interview,
            icon: Users,
            color: "text-green-600",
            bg: "bg-green-50",
            trend:
              jobs.length > 0
                ? `${Math.round(
                    (stats.interview / jobs.length) * 100,
                  )}% response rate`
                : "No data yet",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "text-orange-600",
            bg: "bg-orange-50",
            trend: "Keep applying!",
          },
          {
            label: "Offers",
            value: stats.offer,
            icon: Trophy,
            color: "text-sky-600",
            bg: "bg-sky-50",
            trend: stats.offer > 0 ? "🎉 Congratulations!" : "Keep going!",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="transition-transform duration-300 hover:-translate-y-1"
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-0 bg-linear-to-br from-sky-600 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm opacity-80">Interview Rate</p>
            <h3 className="mt-2 text-3xl font-bold">{interviewRate}%</h3>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Best ATS Score</p>
            <h3 className="mt-2 text-3xl font-bold">{bestScore}</h3>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Resume Analyses</p>
            <h3 className="mt-2 text-3xl font-bold">{analyses.length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">
              📊 Application Status Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <StatusChart data={stats} />
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">📈 ATS Score Trend</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <ScoreTrendChart
              analyses={analyses.map((a) => ({
                atsScore: a.atsScore,
                createdAt: a.createdAt.toString(),
              }))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {analyses.length > 0 && (
        <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle>Recent Resume Analyses</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {analyses.slice(0, 5).map((analysis: any, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      Resume Analysis
                    </p>

                    <p className="text-sm text-slate-500">ATS Evaluation</p>
                  </div>

                  <div className="rounded-lg bg-sky-100 px-3 py-1 font-semibold text-sky-700">
                    {analysis.atsScore}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {jobs.length === 0 && analyses.length === 0 && (
        <div className="rounded-3xl border bg-white p-16 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900">
            Start Your Job Hunt Journey
          </h3>

          <p className="mx-auto mt-3 max-w-md text-slate-500">
            Analyze your resume and track job applications to unlock
            personalized career insights.
          </p>

          <Link
            href="/dashboard/analyze"
            className="mt-8 inline-flex rounded-xl bg-sky-600 px-6 py-3 text-white transition hover:bg-sky-700"
          >
            Analyze Resume
          </Link>
        </div>
      )}
    </div>
  );
}
