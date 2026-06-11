import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Analysis from "@/models/Analysis";
import User from "@/models/User";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { analyzeResume } from "@/lib/ai";
import { analyzeLimiter, checkLimit } from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { allowed, remaining, reset } = await checkLimit(
      analyzeLimiter,
      session.user.id,
    );

    if (!allowed) {
      const resetDate = new Date(reset);
      const minutesLeft = Math.ceil(
        (resetDate.getTime() - Date.now()) / 1000 / 60,
      );
      const hoursLeft = Math.ceil(minutesLeft / 60);
      const minutes = Math.ceil(minutesLeft % 60);

      const msg =
        hoursLeft > 0
          ? `Rate limit exceeded. You can analyze again in ${hoursLeft} hours and ${minutes} minutes.`
          : `Rate limit exceeded. You can analyze again in ${minutes} minutes.`;

      return NextResponse.json(
        {
          success: false,
          message: msg,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    // 2. Parse form data — no multer needed!
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDescription = (formData.get("jobDescription") as string) || "";

    // 3. Validate file
    if (!file) {
      return NextResponse.json(
        { success: false, message: "Resume file is required" },
        { status: 400 },
      );
    }

    if (!file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { success: false, message: "Only PDF files are supported" },
        { status: 400 },
      );
    }

    // 4MB limit
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size must be under 4MB" },
        { status: 400 },
      );
    }

    // 4. Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 5. Extract text from PDF
    const resumeText = await extractTextFromPDF(buffer);

    // 6. Send to Gemini AI
    const analysis = await analyzeResume(resumeText, jobDescription);

    // 7. Save to MongoDB
    await dbConnect();

    const savedAnalysis = await Analysis.create({
      userId: session.user.id,
      ...analysis,
    });

    // 8. Increment user analysis count
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $inc: { analysisCount: 1 } },
    );

    // 9. Return result
    return NextResponse.json(
      { success: true, data: savedAnalysis, remaining },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
        },
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    console.error("POST /api/analyze error:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// Add this to same file below POST
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const analyses = await Analysis.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10); // last 10 analyses

    return NextResponse.json({ success: true, data: analyses });
  } catch (error) {
    console.error("GET /api/analyze error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
