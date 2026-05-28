import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StatsCard from "@/components/dashboard/StatsCard";
import { FileText, Users, XCircle, Trophy } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const firstName = session.user?.name?.split(" ")[0];

  const stats = [
    {
      label: "Applications Applied",
      value: 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+0% from last month",
    },
    {
      label: "Interviews",
      value: 0,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "+0% from last month",
    },
    {
      label: "Rejected",
      value: 0,
      icon: XCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "+0% from last month",
    },
    {
      label: "Offers",
      value: 0,
      icon: Trophy,
      color: "text-violet-600",
      bg: "bg-violet-50",
      trend: "+0% from last month",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {firstName}! Here's what's happening with your career
            journey.
          </p>
        </div>
        <Link
          href="/dashboard/analyze"
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          ✦ Analyze Resume
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border p-12 text-center">
        <p className="text-5xl mb-4">📄</p>
        <h3 className="font-semibold text-gray-800 mb-2 text-lg">
          No analyses yet
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Upload your resume to get an AI-powered ATS score and suggestions
        </p>
        <Link
          href="/dashboard/analyze"
          className="bg-violet-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-violet-700 transition inline-block"
        >
          Analyze Your Resume
        </Link>
      </div>
    </div>
  );
}
