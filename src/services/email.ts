import VerificationEmail from "@/components/email/VerificationEmail";
import { resend } from "@/lib/resend";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Hello world",
    react: VerificationEmail({ verificationCode: "123456" }),
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};
