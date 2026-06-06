import VerificationEmail from "@/components/email/VerificationEmail";
import { generateOTP } from "@/helper/verifyCode";
import { resend } from "@/lib/resend";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const verifyCode = generateOTP();

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Hello world",
    react: VerificationEmail({ verificationCode: verifyCode }),
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};
