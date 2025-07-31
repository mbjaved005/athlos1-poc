import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { User } from "../../models/User";
import { dbConnect } from "../../lib/mongodb";

import type { AuthOptions, Session, User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { SessionStrategy } from "next-auth";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      // Always sync onboardingComplete/profileImage from DB if email is present
      const email = user?.email || token?.email;
      if (email) {
        await dbConnect();
        const dbUser = await User.findOne({ email });
        (token as any).onboardingComplete = dbUser?.onboardingComplete ?? false;
        (token as any).profileImage = dbUser?.profileImage || null;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).onboardingComplete = (token as any).onboardingComplete ?? false;
        // Use profileImage from token (for JWT session)
        (session.user as any).profileImage = (token as any).profileImage || null;
      }
      return session;
    },
    async signIn({ user, account, profile }: { user: any; account: any; profile: any }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Create a new user with Google profile info using correct schema fields
          const nameParts = (user.name || profile?.name || "").split(" ");
          await User.create({
            email: user.email,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            verified: true, // Google users are already verified
            onboardingComplete: false, // Still need to complete onboarding
            profileImage: user.image || profile?.picture || null,
          });
        }
      }
      return true;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        console.log("AUTH: credentials", credentials);

        const user = await User.findOne({ email: credentials?.email });
        console.log("AUTH: user found", !!user);

        if (!user) {
          console.log("AUTH: user not found");
          return null;
        }

        const now = new Date();
        // Allow OTP-verified users to sign in without password
        if (
          (!user.password || !credentials?.password) &&
          user.verified &&
          user.verifiedUntil &&
          user.verifiedUntil > now
        ) {
          console.log("AUTH: OTP-verified user signing in without password");
          return { id: user._id.toString(), email: user.email };
        }
        if (!user.password) {
          console.log("AUTH: user has no password (likely social login)");
          return null;
        }
        const isValid = await compare(credentials!.password, user.password);
        console.log("AUTH: password valid", isValid);

        if (!isValid) {
          console.log("AUTH: invalid password");
          return null;
        }

        // Check verification expiry (1 day window)
        if (!user.verified || !user.verifiedUntil || user.verifiedUntil < now) {
          console.log("AUTH: user verification expired or not verified");

          // Set verified to false if expired
          if (user.verified) {
            user.verified = false;
            await user.save();
          }

          // Generate OTP and expiry (10 min)
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

          user.otp = otp;
          user.otpExpiresAt = otpExpiresAt;
          // Set verification window to 1 day from now
          user.verifiedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
          await user.save();

          // Send OTP email
          try {
            // Import sendOtpEmail at the top if not already
            const { sendOtpEmail } = await import("../../utils/sendEmail");
            await sendOtpEmail(user.email, otp);
          } catch (err) {
            console.error("Failed to send OTP email:", err);
            throw new Error("Failed to send OTP email. Please try again later.");
          }

          throw new Error("Verification expired. Please enter the OTP sent to your email.");
        }

        console.log("AUTH: success", user.email);
        return { id: user._id.toString(), email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add OAuth providers here later
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
