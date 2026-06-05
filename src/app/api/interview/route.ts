import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { generateInterviewQuestions } from "@/lib/ai";

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

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDescription = (formData.get("jobDescription") as string) || "";

    // 3. Validate
    if (!file) {
      return NextResponse.json(
        { success: false, message: "Resume PDF is required" },
        { status: 400 },
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { success: false, message: "Only PDF files are supported" },
        { status: 400 },
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size must be under 4MB" },
        { status: 400 },
      );
    }

    // 4. Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractTextFromPDF(buffer);

    // 5. Generate questions with Gemini 2.5 Pro
    const questions = await generateInterviewQuestions(
      resumeText,
      jobDescription || undefined,
    );

    return NextResponse.json(
      { success: true, data: questions },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    console.error("POST /api/interview error:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
