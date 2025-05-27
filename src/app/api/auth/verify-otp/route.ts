import { NextRequest, NextResponse } from "next/server";

import { dbConnect } from "../../lib/mongodb";
import { User } from "../../models/User";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json({ error: "Missing email or OTP" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (
    !user.otp ||
    user.otp !== otp ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }
  user.verified = true;
  user.verifiedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  return NextResponse.json({ success: true });
}
