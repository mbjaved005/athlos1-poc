"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
// LoaderAfterOtp removed, not needed anymore.

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

export default function LoginOtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setEmail(searchParams.get("email") || "");
    setPassword(searchParams.get("password") || "");
  }, [searchParams]);

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

  // Handle OTP form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: code }),
    });
    const data = await res.json();
    if (data.success) {
      // Now sign in with credentials
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      if (result?.ok) {
        router.push("/dashboard");
      } else {
        setError("Session could not be established. Please login again.");
      }
    } else if (data.error && data.error.toLowerCase().includes("expired")) {
      setLoading(false);
      // If verification expired, redirect to login with a message
      router.push(`/auth/login?error=verification_expired`);
    } else {
      setLoading(false);
      setError(data.error || "Invalid or expired code.");
    }
  };


  // Handle resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setResendCooldown(30);
    await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    // Optionally show a toast/notification
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // UI per reference JSX
  // No LoaderAfterOtp, show loading state on button instead
  

  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50">
      <div className="flex flex-col items-center justify-center flex-1">
        <LanguageSelector />
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-md px-10 py-12 flex flex-col items-center gap-8 relative z-10">
          <div className="w-32 h-10 flex items-center justify-center mb-2">
            <Image src="/athlos-logo.svg" alt="Athlos One Logo" width={128} height={40} className="w-32 h-10 object-contain" />
          </div>
          <div className="flex flex-col justify-center items-center gap-3 w-full">
            <div className="text-center text-Content-Default text-2xl font-semibold font-['Roboto']">Enter Verification Code</div>
            <div className="text-center text-Content-Secondary text-base font-normal font-['Roboto'] leading-tight">
              Enter the code we’ve sent to your registered phone and email
            </div>
          </div>
          <form className="w-full flex flex-col items-center gap-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="flex justify-center gap-3 w-full">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className="w-14 h-14 text-center text-base font-normal text-Content-Default bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-Border-Default focus:outline-cyan-700 focus:ring-2 focus:ring-cyan-700 transition-colors font-['Roboto']"
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>
            {error && <div className="text-red-600 text-sm mt-2" role="alert">{error}</div>}
            <button
              type="submit"
              className="w-full h-12 bg-cyan-700 text-white rounded-lg font-semibold text-base mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 hover:bg-cyan-800 transition"
              disabled={success}
              aria-disabled={success}
            >
              Verify
            </button>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-Content-Secondary">Didn’t receive the code?</span>
              <button
                type="button"
                className="text-cyan-700 text-sm font-semibold hover:underline disabled:opacity-50"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                aria-disabled={resendCooldown > 0}
              >
                Resend {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
