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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {firstName}! Here's your career journey.
          </p>
        </div>
        <Link
          href="/dashboard/analyze"
          className="bg-sky-blue-600 hover:bg-sky-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          ✦ Analyze Resume
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                ? `${Math.round((stats.interview / jobs.length) * 100)}% response rate`
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
            color: "text-sky-blue-600",
            bg: "bg-sky-blue-50",
            trend: stats.offer > 0 ? "🎉 Congratulations!" : "Keep going!",
          },
        ].map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-800">
              Application Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusChart data={stats} />
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-800">
              ATS Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreTrendChart
              analyses={analyses.map((a) => ({
                atsScore: a.atsScore,
                createdAt: a.createdAt.toString(),
              }))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Empty state if no data */}
      {jobs.length === 0 && analyses.length === 0 && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-4xl mb-4">📄</p>
          <h3 className="font-semibold text-gray-800 mb-2">
            Start your journey
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Analyze your resume or add job applications to see insights
          </p>
          <Link
            href="/dashboard/analyze"
            className="bg-sky-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-sky-blue-700 transition inline-block"
          >
            Analyze Your Resume
          </Link>
        </div>
      )}
    </div>
  );
}
