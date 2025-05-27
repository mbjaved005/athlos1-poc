"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";

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

// Language selector placeholder
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

// Custom password input that displays asterisks (*) instead of dots
function PasswordAsteriskInput({
  className = '',
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [realValue, setRealValue] = useState('');

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
        autoComplete="new-password"
        inputMode="text"
        spellCheck={false}
      />
      {/* Hidden real password for form submission, with the actual name and value */}
      <input type="password" name={props.name} value={realValue} style={{ display: 'none' }} readOnly />
    </div>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isFormValid = email.length > 0 && password.length >= 8 && termsChecked;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9fb]">
      <div className="flex flex-col items-center justify-center flex-1">
        <LanguageSelector />
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-md px-10 py-12 flex flex-col items-center gap-8 relative z-10">
          <AthlosLogo />
          <div className="text-center text-Content-Secondary text-base font-normal leading-tight">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-700 hover:underline">Log in</Link>
          </div>
          <form
  className="w-full flex flex-col gap-6"
  onSubmit={async e => {
    e.preventDefault();
    setError(null);
    if (!isFormValid || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      window.location.href = `/auth/email-otp?email=${encodeURIComponent(email)}`;
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }}
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
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="absolute left-4 -top-[5px] text-[13px] font-normal text-Content-Secondary bg-Color-Modes-White px-1 z-10 leading-none">Password</label>
                {/* Custom password input to use asterisks as mask and correct color */}
                <PasswordAsteriskInput
                  id="password"
                  placeholder="min 8 characters"
                  className="w-full h-14 pt-4.5 px-4 text-base font-normal text-Content-Default bg-Color-Modes-White rounded-lg border border-Border-Default focus:border-cyan-700 focus:ring-0 placeholder-Content-Tertiary"
                  minLength={8}
                  required
                  aria-label="Password"
                  name="password"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input id="terms" type="checkbox" className="accent-cyan-700 w-4 h-4 border border-Border-Default rounded focus:ring-2 focus:ring-cyan-700" required aria-label="Agree to terms" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} />
              <label htmlFor="terms" className="text-sm font-normal text-Content-Secondary">By creating an account, you agree to our <Link href="#" className="text-cyan-700 underline">Terms</Link> and have read and acknowledge the <Link href="#" className="text-cyan-700 underline">Privacy Policy</Link>.</label>
            </div>
            <button
              type="submit"
              className={`w-full h-10 rounded-lg font-normal text-base transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-700 ${isFormValid && !loading ? 'bg-cyan-700 hover:bg-cyan-800 cursor-pointer' : 'bg-A6C9D7 cursor-not-allowed'}`}
              disabled={!isFormValid || loading}
              aria-disabled={!isFormValid || loading}
            >
              {loading ? (
                <span>Signing up...</span>
              ) : (
                'Sign up'
              )}
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
              aria-label="Sign up with Google"
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><g><path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.45c-.23 1.21-.93 2.23-1.98 2.9" fill="#4285F4"/><path d="M10 20c2.7 0 4.96-.9 6.62-2.45l-3.17-2.6c-.88.6-2.01.95-3.45.95-2.65 0-4.9-1.79-5.71-4.19H1.99v2.63A9.99 9.99 0 0010 20z" fill="#34A853"/><path d="M4.29 11.71A5.98 5.98 0 014 10c0-.59.1-1.16.28-1.71V5.66H1.99A9.99 9.99 0 000 10c0 1.64.39 3.18 1.09 4.54l3.2-2.83z" fill="#FBBC05"/><path d="M10 4c1.47 0 2.8.51 3.85 1.5l2.88-2.88C14.96 1.36 12.7.36 10 .36A9.99 9.99 0 001.09 5.46l3.2 2.83C5.1 5.79 7.35 4 10 4z" fill="#EA4335"/></g></svg>
              <span className="text-gray-700 font-normal">Sign up with Google</span>
            </button>
            <button className="w-full h-10 flex items-center justify-center gap-2 border border-Border-Default rounded-lg bg-white hover:bg-gray-50 transition-colors">
              {/* Apple Icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.7 10.87c-.01-2.13 1.75-3.14 1.83-3.19-1-1.46-2.54-1.66-3.09-1.68-1.32-.13-2.58.77-3.24.77-.66 0-1.69-.75-2.78-.73-1.43.02-2.76.83-3.5 2.1-1.5 2.6-.38 6.44 1.07 8.55.71 1.03 1.56 2.19 2.68 2.15 1.08-.04 1.49-.69 2.8-.69 1.31 0 1.67.69 2.8.67 1.16-.02 1.89-1.05 2.59-2.09.82-1.2 1.16-2.36 1.17-2.42-.03-.01-2.25-.86-2.27-3.41zm-2.13-6.25c.6-.73 1-1.75.89-2.76-.86.03-1.89.57-2.5 1.3-.55.65-1.03 1.7-.85 2.7.96.07 1.96-.49 2.46-1.24z" fill="#111"/></svg>
              <span className="text-gray-700 font-normal">Sign up with Apple</span>
            </button>
            <button className="w-full h-10 flex items-center justify-center gap-2 border border-Border-Default rounded-lg bg-white hover:bg-gray-50 transition-colors">
              {/* Microsoft Icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><g><rect x="1" y="1" width="8" height="8" fill="#F35325"/><rect x="11" y="1" width="8" height="8" fill="#81BC06"/><rect x="1" y="11" width="8" height="8" fill="#05A6F0"/><rect x="11" y="11" width="8" height="8" fill="#FFBA08"/></g></svg>
              <span className="text-gray-700 font-normal">Sign up with Microsoft</span>
            </button>
          </div>
        </div>
      </div>
      <footer className="w-full flex flex-col items-center pb-8">
        <div className="text-center text-Content-Secondary text-sm font-normal">
          Read AthlosOne <Link href="#" className="text-cyan-700 underline">Terms & Conditions</Link> & <Link href="#" className="text-cyan-700 underline">Privacy Policy</Link>.
        </div>
      </footer>
    </div>
  );
}
