// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Job from "@/models/Job";
import Analysis from "@/models/Analysis";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user from DB
    const dbUser = await User.findOne({
      email: session.user.email
    }).lean();

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userId = dbUser._id.toString();

    // Fetch stats in parallel
    const [jobs, analyses] = await Promise.all([
      Job.find({ userId }).lean(),
      Analysis.find({ userId }).lean(),
    ]);

    // Calculate stats
    const avgAtsScore = analyses.length > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + a.atsScore, 0) / analyses.length
        )
      : 0;

    const bestScore = analyses.length > 0
      ? Math.max(...analyses.map((a) => a.atsScore))
      : 0;

    const stats = {
      totalJobs: jobs.length,
      totalAnalyses: analyses.length,
      avgAtsScore,
      bestScore,
      interviews: jobs.filter((j) => j.status === "interview").length,
      offers: jobs.filter((j) => j.status === "offer").length,
      applied: jobs.filter((j) => j.status === "applied").length,
      rejected: jobs.filter((j) => j.status === "rejected").length,
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image,
          role: dbUser.role,
          createdAt: dbUser.createdAt.toISOString(),
        },
        stats,
      },
    });

  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}