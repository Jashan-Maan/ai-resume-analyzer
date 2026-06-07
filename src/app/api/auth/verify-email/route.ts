import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and code are required." },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is already verified. Please log in.",
        },
        { status: 400 },
      );
    }

    if (user.verifyCode !== code) {
      return NextResponse.json(
        { success: false, message: "Incorrect verification code." },
        { status: 400 },
      );
    }

    if (!user.verifyCodeExpiry || new Date() > user.verifyCodeExpiry) {
      return NextResponse.json(
        { success: false, message: "Code expired. Please sign up again." },
        { status: 400 },
      );
    }

    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Account verified successfully! You can now log in.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
