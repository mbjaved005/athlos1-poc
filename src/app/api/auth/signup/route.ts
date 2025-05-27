import { NextRequest, NextResponse } from "next/server";

import { dbConnect } from "../../lib/mongodb";
import { User } from "../../models/User";
import { sendOtpEmail } from "../../utils/sendEmail";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  // Basic validation
  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Check for existing user
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate OTP and expiry (10 min)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Create user
  const user = new User({
    email,
    password: hashedPassword,
    verified: false,
    otp,
    otpExpiresAt
  });
  await user.save();

  // Send OTP email
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    // Clean up user if email fails
    await User.deleteOne({ email });
    return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
  }

  return NextResponse.json({ success: true, email });
}
