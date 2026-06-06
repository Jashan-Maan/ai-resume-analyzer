import crypto from "crypto";

export const generateOTP = (): string => {
  const otp = crypto.randomInt(0, 1000000);
  return otp.toString().padStart(6, "0");
};

export const generateOTPExpiry = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 min
};
