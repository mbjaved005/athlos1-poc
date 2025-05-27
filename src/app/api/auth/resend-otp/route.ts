import { NextRequest, NextResponse } from "next/server";

import { dbConnect } from "../../lib/mongodb";
import { User } from "../../models/User";
import { sendOtpEmail } from "../../utils/sendEmail";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  // Send OTP via email
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
