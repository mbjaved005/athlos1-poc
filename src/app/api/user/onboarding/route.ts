import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { dbConnect } from "../../lib/mongodb";
import { User } from "../../models/User";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  console.log('Onboarding API received body:', body);
  // Debug: Log profileImage specifically
  console.log('profileImage in body:', body.profileImage);
  // Build update object
  const update: Record<string, any> = {};
  const { firstName, lastName, phone, region, affiliation, numAthletes, profileImage, activities } = body;
  if (firstName !== undefined) update.firstName = firstName;
  if (lastName !== undefined) update.lastName = lastName;
  if (phone !== undefined) update.phone = phone;
  if (region !== undefined) update.region = region;
  if (affiliation !== undefined) update.affiliation = affiliation;
  if (numAthletes !== undefined) update.numAthletes = numAthletes;
  if (profileImage !== undefined) update.profileImage = profileImage;
  if (activities !== undefined) update.activities = activities;

  // If skip or invites, set onboardingComplete
  if (body.skip || Array.isArray(body.invites)) {
    update.onboardingComplete = true;
  }

  // Debug: Log what will be updated in DB
  console.log('User update object:', update);
  // Only update if there is something to update
  if (Object.keys(update).length > 0) {
    await User.updateOne(
      { email: session.user.email },
      { $set: update }
    );
  }

  return NextResponse.json({ success: true });
}
