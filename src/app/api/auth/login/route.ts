import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../lib/mongodb";
import { User } from "../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  if (!user.verified) {
    return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  // TODO: Issue session or JWT here for real app
  return NextResponse.json({ success: true });
}
