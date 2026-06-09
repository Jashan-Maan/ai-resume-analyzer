import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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
