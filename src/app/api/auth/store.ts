// Shared in-memory store for users and OTPs (for development only)
export const users: { email: string; password: string; verified: boolean }[] = [];
export const otpStore: Record<string, string> = {};
