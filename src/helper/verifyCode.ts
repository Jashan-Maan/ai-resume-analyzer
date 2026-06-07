import crypto from "crypto";

export const generateOTP = (): string => {
  const otp = crypto.randomInt(0, 1000000);
  return otp.toString().padStart(6, "0");
};

export const generateOTPExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10); // 10 minutes
  return expiry;
};
