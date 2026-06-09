import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendVerificationEmail } from "@/services/email";
import { generateOTP, generateOTPExpiry } from "@/helper/verifyCode";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email" },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Email already verified. Please sign in." },
        { status: 400 },
      );
    }

    // ✅ Generate new code
    const newCode = generateOTP();
    const newExpiry = generateOTPExpiry();

    user.verifyCode = newCode;
    user.verifyCodeExpiry = newExpiry;
    await user.save();

    // Send email
    const emailResult = await sendVerificationEmail(email, user.name, newCode);

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "New verification code sent! Check your inbox.",
    });
  } catch (error) {
    console.error("Resend code error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
