// src/app/dashboard/profile/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Job from "@/models/Job";
import Analysis from "@/models/Analysis";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Mail,
  Calendar,
  FileText,
  BarChart2,
  Briefcase,
  Trophy,
  TrendingUp,
  Star,
} from "lucide-react";
import SignOutButton from "@/components/dashboard/SignOutButton";

// ProfilePage Component
export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();

  // Get DB user
  const dbUser = await User.findOne({
    email: session.user.email,
  }).lean();

  if (!dbUser) redirect("/login");

  const userId = dbUser._id.toString();

  // Fetch stats
  const [jobs, analyses] = await Promise.all([
    Job.find({ userId }).lean(),
    Analysis.find({ userId }).lean(),
  ]);

  const avgScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + a.atsScore, 0) / analyses.length,
        )
      : 0;

  const bestScore =
    analyses.length > 0 ? Math.max(...analyses.map((a) => a.atsScore)) : 0;

  const stats = [
    {
      label: "Total Analyses",
      value: analyses.length,
      icon: BarChart2,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Jobs Applied",
      value: jobs.length,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg ATS Score",
      value: avgScore,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Best ATS Score",
      value: bestScore,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Interviews",
      value: jobs.filter((j) => j.status === "interview").length,
      icon: UserIcon,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Offers",
      value: jobs.filter((j) => j.status === "offer").length,
      icon: Trophy,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
// Header section with page title and sign out button
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-violet-50 p-2 rounded-lg">
          <UserIcon size={20} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 text-sm">
            Your account information and career stats
          </p>
        </div>
      </div>

// Profile Card displaying avatar, name, and contact info
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            {dbUser.image ? (
              <Image
                src={dbUser.image}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full ring-4 ring-violet-100 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-violet-600">
                  {dbUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">
                  {dbUser.name}
                </h2>
                <Badge
                  variant="outline"
                  className="text-violet-600 border-violet-200 bg-violet-50 capitalize"
                >
                  {dbUser.role}
                </Badge>
              </div>

              <div className="space-y-1.5 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={14} className="text-gray-400" />
                  {dbUser.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} className="text-gray-400" />
                  Member since {format(new Date(dbUser.createdAt), "MMMM yyyy")}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText size={14} className="text-gray-400" />
                  {analyses.length} resume{" "}
                  {analyses.length !== 1 ? "analyses" : "analysis"} completed
                </div>
              </div>
            </div>

            {/* Sign out */}
            <SignOutButton />
          </div>
        </CardContent>
      </Card>

// Stats Grid showing career statistics
      {/* Stats Grid */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Career Statistics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-sm transition">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500 font-medium">
                    {stat.label}
                  </p>
                  <div className={`${stat.bg} p-1.5 rounded-lg`}>
                    <stat.icon size={14} className={stat.color} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                  {stat.label.includes("Score") && stat.value > 0 && (
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      /100
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

// Job Application Breakdown section
      {/* Job Application Breakdown */}
      {jobs.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-800">
              Application Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Applied",
                  count: jobs.filter((j) => j.status === "applied").length,
                  color: "bg-blue-500",
                  text: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Interview",
                  count: jobs.filter((j) => j.status === "interview").length,
                  color: "bg-yellow-500",
                  text: "text-yellow-600",
                  bg: "bg-yellow-50",
                },
                {
                  label: "Offer",
                  count: jobs.filter((j) => j.status === "offer").length,
                  color: "bg-green-500",
                  text: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  label: "Rejected",
                  count: jobs.filter((j) => j.status === "rejected").length,
                  color: "bg-red-500",
                  text: "text-red-600",
                  bg: "bg-red-50",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`${item.bg} rounded-xl p-4 text-center`}
                >
                  <p className={`text-2xl font-bold ${item.text}`}>
                    {item.count}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                  {jobs.length > 0 && (
                    <p className={`text-xs ${item.text} mt-1 font-medium`}>
                      {Math.round((item.count / jobs.length) * 100)}%
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex rounded-full overflow-hidden h-2">
                {[
                  {
                    count: jobs.filter((j) => j.status === "applied").length,
                    color: "bg-blue-500",
                  },
                  {
                    count: jobs.filter((j) => j.status === "interview").length,
                    color: "bg-yellow-500",
                  },
                  {
                    count: jobs.filter((j) => j.status === "offer").length,
                    color: "bg-green-500",
                  },
                  {
                    count: jobs.filter((j) => j.status === "rejected").length,
                    color: "bg-red-500",
                  },
                ]
                  .filter((s) => s.count > 0)
                  .map((s, i) => (
                    <div
                      key={i}
                      className={`${s.color} h-full transition-all`}
                      style={{
                        width: `${Math.round((s.count / jobs.length) * 100)}%`,
                      }}
                    />
                  ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Applied</span>
                <span>Offer</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

// ATS Score Summary section
      {/* ATS Score Summary */}
      {analyses.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-800">
              ATS Score Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{avgScore}</p>
                <p className="text-xs text-gray-500 mt-1">Average Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{bestScore}</p>
                <p className="text-xs text-gray-500 mt-1">Best Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600">
                  {analyses.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Analyses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
