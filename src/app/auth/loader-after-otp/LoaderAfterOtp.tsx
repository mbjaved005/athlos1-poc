"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoaderAfterOtp({ redirectTo = "/dashboard", delay = 4000 }: { redirectTo?: string; delay?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectTo);
    }, delay);
    return () => clearTimeout(timer);
  }, [redirectTo, delay, router]);

  return (
    <div className="fixed inset-0 bg-neutral-50 overflow-hidden z-50">
      {/* Language Selector (top right, pixel-perfect) */}
      <div className="absolute right-16 top-10 flex items-center gap-1 z-50">
        <div className="w-6 h-6 rounded bg-zinc-300 opacity-60" />
        <div className="w-5 h-5 rounded bg-zinc-400 opacity-30" />
        <span className="ml-2 text-xs font-normal text-zinc-400 font-['Roboto'] leading-none select-none">US - English</span>
        <svg className="w-5 h-5 ml-1 rotate-90 opacity-40" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      {/* Overlay: blur/fade background */}
      <div className="absolute inset-0 bg-white opacity-90 backdrop-blur-[2px] z-40 pointer-events-none" />
      {/* Card (centered) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl flex flex-col items-center gap-12 shadow-xl px-36 py-16 z-50">
        {/* Logo placeholder (replace with logo if available) */}
        <div className="w-32 h-10 flex items-center justify-center rounded mb-2">
          <img src="/athlos-logo.svg" alt="ATHLOS ONE" className="w-32 h-10 object-contain" />
        </div>
        {/* Spinner only */}
        <div className="w-12 h-12 flex items-center justify-center">
          <span className="w-12 h-12 rounded-full border-4 border-cyan-700 border-t-transparent animate-spin block"></span>
        </div>
      </div>
    </div>
  );
}

