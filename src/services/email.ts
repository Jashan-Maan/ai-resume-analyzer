import VerificationEmail from "@/components/email/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Kira <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email address - Kira",
      react: VerificationEmail({ verificationCode: verifyCode, username }),
    });
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
