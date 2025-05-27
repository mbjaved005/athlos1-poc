"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

import Image from "next/image";
import dynamic from "next/dynamic";

const LoaderAfterOtp = dynamic(() => import("../loader-after-otp/LoaderAfterOtp"), { ssr: false });

function LanguageSelector() {
  return (
    <div className="absolute right-8 top-8 flex items-center gap-2">
      <span className="text-Content-Tertiary text-sm">US - English</span>
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path d="M6 8l4 4 4-4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

import { useRouter, useSearchParams } from "next/navigation";

export default function EmailOtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
    }
  }, []);
  const router = typeof window !== 'undefined' ? { push: (url: string) => { window.location.href = url; } } : null;

  // Handle OTP input change
  const handleChange = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only digits, max 1 char
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (!value && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // Handle resend
  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setResendCooldown(30); // 30s cooldown
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  React.useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const isOtpComplete = otp.every((d) => d.length === 1);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50">
      <div className="flex flex-col items-center justify-center flex-1">
        <LanguageSelector />
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-md px-10 py-12 flex flex-col items-center gap-8 relative z-10 mt-10">
          <Image
            src="/athlos-logo.svg"
            alt="Athlos One Logo"
            width={128}
            height={40}
            priority
            className="w-32 h-10 object-contain mb-2"
          />
          <div className="flex flex-col gap-3 w-full items-center">
            <div className="text-center text-Content-Default text-2xl font-semibold font-['Roboto']">Check your Email</div>
            <div className="text-center text-Content-Secondary text-base font-normal font-['Roboto'] leading-tight">
              Confirm your email address by entering the six-digit code sent to <span className="font-medium">{email || "your@email.com"}</span>
            </div>
          </div>
          {error && (
  <div
    role="alert"
    className="w-full flex items-center gap-2 px-4 py-2 mb-2 rounded-lg shadow border-l-4 border-red-500 bg-white text-Content-Default text-sm animate-fade-in"
    style={{ minHeight: 44 }}
  >
    <svg className="text-red-500 w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
    <span>{error}</span>
  </div>
)}
{success && (
  <div
    role="status"
    className="w-full flex items-center gap-2 px-4 py-2 mb-2 rounded-lg shadow border-l-4 border-cyan-700 bg-white text-Content-Default text-sm animate-fade-in"
    style={{ minHeight: 44 }}
  >
    <svg className="text-cyan-700 w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    <span>Email verified! Redirecting...</span>
  </div>
)}
          <form className="flex flex-col gap-6 w-full items-center" autoComplete="off"
            onSubmit={async e => {
              e.preventDefault();
              setError(null);
              if (!email) {
                setError("Missing email");
                return;
              }
              if (!isOtpComplete || loading) return;
              setLoading(true);
              try {
                const res = await fetch("/api/auth/verify-otp", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, otp: otp.join("") })
                });
                const data = await res.json();
                if (!res.ok) {
                  setError(data.error || "Invalid OTP");
                  setLoading(false);
                  return;
                }
                setSuccess(true);
                // Automatically sign in the user after successful OTP verification
                const signInRes = await import("next-auth/react").then(mod => mod.signIn("credentials", {
                  redirect: false,
                  email,
                  password: "" // Use empty string for OTP-verified users
                }));
                if (signInRes?.error) {
                  setError("Sign-in failed after verification. Please log in manually.");
                  setLoading(false);
                  return;
                }
                // Redirect to onboarding after sign-in
                setTimeout(() => {
                  window.location.href = "/auth/onboarding/basic-info";
                }, 1200);
              } catch {
                setError("Network error. Please try again.");
                setLoading(false);
              }
            }}
          >
            <div className="flex justify-center items-center gap-3 w-full">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className="w-14 h-14 text-center text-base font-normal text-Content-Default bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-Border-Default focus:outline-cyan-700 focus:ring-2 focus:ring-cyan-700 transition-colors font-['Roboto']"
                  aria-label={`OTP digit ${idx + 1}`}
                  autoComplete="off"
                  tabIndex={idx + 1}
                />
              ))}
            </div>
            <button
              type="submit"
              className={`w-full h-10 rounded-lg font-normal text-base transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-700 ${isOtpComplete && !loading ? 'bg-cyan-700 hover:bg-cyan-800 text-white cursor-pointer' : 'bg-A6C9D7 text-white cursor-not-allowed'}`}
              disabled={!isOtpComplete || loading}
              aria-disabled={!isOtpComplete || loading}
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                'Verify'
              )}
            </button>
          </form>
          <div className="text-center text-base font-normal font-['Roboto'] mt-2">
            <span className="text-Content-Secondary">Didn’t receive the code? </span>
            <button
              onClick={handleResend}
              className={`text-cyan-700 font-medium hover:underline focus:underline disabled:text-Content-Tertiary disabled:cursor-not-allowed`}
              disabled={resendCooldown > 0}
              aria-disabled={resendCooldown > 0}
            >
              Resend it{resendCooldown > 0 ? ` (${resendCooldown}s)` : ''}
            </button>
            <span className="text-Content-Secondary">.</span>
          </div>
        </div>
      </div>
      {success && <LoaderAfterOtp redirectTo="/auth/onboarding/basic-info" delay={1200} />}
    </div>
  );
}
