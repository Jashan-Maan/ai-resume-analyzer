import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import { updateJobSchema } from "@/schemas/JobSchema";

// PUT — update job
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const result = updateJobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Find job AND verify it belongs to this user
    const job = await Job.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      result.data,
      { new: true },
    );

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("PUT /api/jobs error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// DELETE — delete job
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    // Find AND verify ownership before deleting
    const job = await Job.findOneAndDelete({
      _id: id,
      userId: session.user.id, // security check
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error("DELETE /api/jobs error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
