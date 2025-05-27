"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { signIn, useSession } from "next-auth/react";

function LanguageSelector() {
  return (
    <div className="absolute right-8 top-8 flex items-center gap-2">
      <span className="text-gray-500 text-sm">US - English</span>
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path d="M6 8l4 4 4-4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function AthlosLogo() {
  return (
    <Image
      src="/athlos-logo.svg"
      alt="Athlos One Logo"
      width={135.81}
      height={40}
      priority
      style={{ width: '135.81px', height: '40px' }}
      className="object-contain"
    />
  );
}

// Custom password input that displays asterisks (*) instead of dots
function PasswordAsteriskInput({
  className = '',
  onChange,
  value = '',
  name,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [realValue, setRealValue] = React.useState(value as string);

  React.useEffect(() => {
    setRealValue(value as string);
  }, [value]);

  // Handler for input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRealValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="relative w-full">
      {/* Visible input for asterisks only, no name so it's not submitted */}
      <input
        {...props}
        type="text"
        name={undefined}
        value={'*'.repeat(realValue.length)}
        onChange={handleChange}
        className={className + ' text-Content-Default'}
        autoComplete="current-password"
        inputMode="text"
        spellCheck={false}
      />
      {/* Hidden real password for form submission, with the actual name and value */}
      <input type="password" name={name} value={realValue} style={{ display: 'none' }} readOnly />
    </div>
  );
}

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  // Call signIn directly
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  setLoading(false);
  if (result?.error) {
    // If OTP required, redirect to OTP page
    if (result.error.includes("Verification expired") || result.error.includes("OTP required") || result.error.includes("verify your email")) {
      // TODO: Pass password securely (not in URL), this is for demo only
      router.push(`/auth/login-otp?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    } else if (result.error === "CredentialsSignin") {
      setError("Invalid email or password.");
    } else {
      setError(result.error);
    }
  } else if (result?.ok) {
    router.push("/dashboard");
  }
};

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9fb]">
      <div className="flex flex-col items-center justify-center flex-1">
        <LanguageSelector />
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-md px-10 py-12 flex flex-col items-center gap-8 relative z-10">
          <AthlosLogo />
          <div className="text-center text-Content-Secondary text-base font-normal leading-tight">
            Don’t have an account already?{' '}
            <Link href="/signup" className="text-cyan-700 hover:underline">Sign up</Link>
          </div>
          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handleLogin}
            autoComplete="off"
          >
            <div className="flex flex-col gap-4">
              <div className="relative">
                <label htmlFor="email" className="absolute left-4 -top-[5px] text-[13px] font-normal text-Content-Secondary bg-Color-Modes-White px-1 z-10 leading-none">Business Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="mail@website.com"
                  className="w-full h-14 pt-4.5 px-4 text-base font-normal text-Content-Default bg-Color-Modes-White rounded-lg border border-Border-Default focus:border-cyan-700 focus:ring-0 placeholder-Content-Tertiary"
                  required
                  aria-label="Business Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="absolute left-4 -top-[5px] text-[13px] font-normal text-Content-Secondary bg-Color-Modes-White px-1 z-10 leading-none">Password</label>
                <PasswordAsteriskInput
                  id="password"
                  placeholder="Enter password"
                  className="w-full h-14 pt-4.5 px-4 text-base font-normal text-Content-Default bg-Color-Modes-White rounded-lg border border-Border-Default focus:border-cyan-700 focus:ring-0 placeholder-Content-Tertiary"
                  minLength={8}
                  required
                  aria-label="Password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="self-stretch text-right text-Content-Secondary text-base font-normal underline leading-tight cursor-pointer">
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </div>
            <button
              type="submit"
              className={`w-full h-10 rounded-lg font-normal text-base transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-700 ${loading ? 'bg-A6C9D7 text-white cursor-not-allowed' : 'bg-cyan-700 hover:bg-cyan-800 text-white cursor-pointer'}`}
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          {error && (
            <div className="w-full bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-2 mb-2 text-sm" role="alert">
              {error}
            </div>
          )}
          <div className="w-full flex flex-col gap-3 mt-2">
            <div className="text-center text-Content-Tertiary text-base font-normal">OR</div>
            <button
              className="w-full h-10 flex items-center justify-center gap-2 border border-Border-Default rounded-lg bg-white hover:bg-gray-50 transition-colors"
              aria-label="Login with Google"
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><g><path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.45c-.23 1.21-.93 2.23-1.98 2.9" fill="#4285F4"/><path d="M10 20c2.7 0 4.96-.9 6.62-2.45l-3.17-2.6c-.88.6-2.01.95-3.45.95-2.65 0-4.9-1.79-5.71-4.19H1.99v2.63A9.99 9.99 0 0010 20z" fill="#34A853"/><path d="M4.29 11.71A5.98 5.98 0 014 10c0-.59.1-1.16.28-1.71V5.66H1.99A9.99 9.99 0 000 10c0 1.64.39 3.18 1.09 4.54l3.2-2.83z" fill="#FBBC05"/><path d="M10 4c1.47 0 2.8.51 3.85 1.5l2.88-2.88C14.96 1.36 12.7.36 10 .36A9.99 9.99 0 001.09 5.46l3.2 2.83C5.1 5.79 7.35 4 10 4z" fill="#EA4335"/></g></svg>
              <span className="text-gray-700 font-normal">Login with Google</span>
            </button>
            <button className="w-full h-10 flex items-center justify-center gap-2 border border-Border-Default rounded-lg bg-white hover:bg-gray-50 transition-colors mt-2" aria-label="Login with Apple" type="button" tabIndex={-1} disabled>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.7 10.87c-.01-2.13 1.75-3.14 1.83-3.19-1-1.46-2.54-1.66-3.09-1.68-1.32-.13-2.58.77-3.24.77-.66 0-1.69-.75-2.78-.73-1.43.02-2.76.83-3.5 2.1-1.5 2.6-.38 6.44 1.07 8.55.71 1.03 1.56 2.19 2.68 2.15 1.08-.04 1.49-.69 2.8-.69 1.31 0 1.67.69 2.8.67 1.16-.02 1.89-1.05 2.59-2.09.82-1.2 1.16-2.36 1.17-2.42-.03-.01-2.25-.86-2.27-3.41zm-2.13-6.25c.6-.73 1-1.75.89-2.76-.86.03-1.89.57-2.5 1.3-.55.65-1.03 1.7-.85 2.7.96.07 1.96-.49 2.46-1.24z" fill="#111"/></svg>
              <span className="text-gray-700 font-normal">Login with Apple</span>
            </button>
            <button className="w-full h-10 flex items-center justify-center gap-2 border border-Border-Default rounded-lg bg-white hover:bg-gray-50 transition-colors mt-2" aria-label="Login with Microsoft" type="button" tabIndex={-1} disabled>
              <span className="w-5 h-5 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16"><rect width="7" height="7" x="0" y="0" fill="#F25022"/><rect width="7" height="7" x="9" y="0" fill="#7FBA00"/><rect width="7" height="7" x="0" y="9" fill="#00A4EF"/><rect width="7" height="7" x="9" y="9" fill="#FFB900"/></svg>
              </span>
              <span className="text-gray-700 font-normal">Login with Microsoft</span>
            </button>

          </div>
        </div>
     </div>
     <div className="w-full flex justify-center mt-6 mb-2">
  <footer className="w-full flex flex-col items-center pb-8">
  <div className="text-center text-Content-Secondary text-sm font-normal">
    Read AthlosOne <Link href="/terms-and-conditions" className="text-cyan-700 underline">Terms & Conditions</Link> & <Link href="/privacy-policy" className="text-cyan-700 underline">Privacy Policy</Link>.
  </div>
</footer>
</div>
   </div>
  );
}
