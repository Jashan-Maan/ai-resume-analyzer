import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendVerificationEmail } from "@/services/email";
import { generateOTP, generateOTPExpiry } from "@/helper/verifyCode";
import { signupSchema } from "@/schemas/AuthSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.message },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        if (!existingUser.password) {
          return NextResponse.json(
            {
              success: false,
              message:
                "This email is linked to Google/GitHub. Please sign in with that.",
            },
            { status: 400 },
          );
        }
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        const verifyCode = generateOTP();
        const verifyCodeExpiry = generateOTPExpiry();

        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = verifyCodeExpiry;

        await existingUser.save();
        await sendVerificationEmail(email, name, verifyCode);

        return NextResponse.json(
          {
            success: true,
            message:
              "Verification code sent! Please check your email to verify your account.",
          },
          { status: 200 },
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyCode = generateOTP();
    const verifyCodeExpiry = generateOTPExpiry();

    await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyCode,
      verifyCodeExpiry,
    });

    await sendVerificationEmail(email, name, verifyCode);

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created! Please check your email to verify your account.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
