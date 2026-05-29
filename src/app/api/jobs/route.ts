import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import { createJobSchema } from "@/schemas/JobSchema";

// GET — fetch all jobs for logged in user
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

    const jobs = await Job.find({ userId: session.user.id }).sort({
      createdAt: -1,
    }); // newest first

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// POST — create new job
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // Validate with Zod
    const result = createJobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data",
          errors: result.error,
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const job = await Job.create({
      ...result.data,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
