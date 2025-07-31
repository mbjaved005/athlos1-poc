import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

import { dbConnect } from "../../lib/mongodb";
import { User } from "../../models/User";

// Constant-time string comparison to prevent timing attacks
function safeCompareStrings(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  const bufferA = Buffer.from(a, 'utf8');
  const bufferB = Buffer.from(b, 'utf8');
  
  return timingSafeEqual(bufferA, bufferB);
}

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
  
  // Check if OTP exists and is not expired first
  if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }
  
  // Use constant-time comparison to prevent timing attacks
  if (!safeCompareStrings(user.otp, otp)) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }
  
  user.verified = true;
  user.verifiedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  return NextResponse.json({ success: true });
}
