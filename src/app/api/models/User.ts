import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  verified: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  verifiedUntil?: Date;
  onboardingComplete?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  region?: string;
  affiliation?: string;
  numAthletes?: string;
  profileImage?: string;
  activities?: string[];
  hasSeenTourModal?: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  verified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  verifiedUntil: { type: Date },
  onboardingComplete: { type: Boolean, default: false },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  region: { type: String },
  affiliation: { type: String },
  numAthletes: { type: String },
  profileImage: { type: String },
  activities: { type: [String], default: [] },
  hasSeenTourModal: { type: Boolean, default: false },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
