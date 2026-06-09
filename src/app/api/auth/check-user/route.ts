import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { generateOTP, generateOTPExpiry } from "@/helper/verifyCode";
import { sendVerificationEmail } from "@/services/email";
import { success } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });

    // No user found
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email" },
        { status: 404 },
      );
    }

    // OAuth user trying to use credentials
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account uses Google/GitHub login. Please sign in with that.",
        },
        { status: 400 },
      );
    }

    // Wrong password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 400 },
      );
    }

    // Email not verified
    if (!user.isVerified) {
      const now = new Date();
      const isExpired = !user.verifyCodeExpiry || now > user.verifyCodeExpiry;

      if (isExpired) {
        const newCode = generateOTP();
        const newExpiry = generateOTPExpiry();

        user.verifyCode = newCode;
        user.verifyCodeExpiry = newExpiry;
        await user.save();

        const emailResult = await sendVerificationEmail(
          email,
          user.name,
          newCode,
        );

        if (!emailResult.success) {
          return NextResponse.json(
            {
              success: false,
              message: "Failed to send Verification email. Please try again",
            },
            {
              status: 500,
            },
          );
        }
        return NextResponse.json(
          {
            success: false,
            message:
              "Your verification code expired. We sent a new code to your email.",
            needsVerification: true,
            email,
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your email first. Check your inbox for the code.",
        },
        { status: 400 },
      );
    }

    // All good — let NextAuth handle the actual session
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
