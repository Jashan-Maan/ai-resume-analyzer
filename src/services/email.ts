import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

async function createTransporter() {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID!,
    process.env.GMAIL_CLIENT_SECRET!,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
  });

  const accessToken = await oauth2Client.getAccessToken();

  if (!accessToken.token) {
    throw new Error("Failed to get Gmail access token");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER!,
      clientId: process.env.GMAIL_CLIENT_ID!,
      clientSecret: process.env.GMAIL_CLIENT_SECRET!,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
      accessToken: accessToken.token!,
    },
  });

  return transporter;
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
) {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"Kira AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Kira verification code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          
          <h2 style="color: #0099ff; margin-bottom: 8px;">
            Welcome to Kira, ${username}! 
          </h2>
          
          <p style="color: #4b5563; margin-bottom: 24px;">
            Use this code to verify your email address. 
            It expires in <strong>10 minutes</strong>.
          </p>

          <div style="
            background: #e5f5ff;
            border: 2px solid #0099ff;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
          ">
            <p style="color: #0099ff; font-size: 13px; margin: 0 0 8px;">
              Verification Code
            </p>
            <p style="
              color: #0099ff;
              font-size: 40px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 0;
            ">
              ${verifyCode}
            </p>
          </div>

          <p style="color: #9ca3af; font-size: 12px;">
            If you didn't create a Kira account, 
            you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          
          <p style="color: #9ca3af; font-size: 11px; text-align: center;">
            Kira AI Resume Analyzer
          </p>

        </div>
      `,
    });

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
