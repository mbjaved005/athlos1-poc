"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function LoaderTransition() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShow(true);
    const timeout = setTimeout(() => setShow(false), 250); // 0.25s delay
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="absolute inset-0 bg-white opacity-90 backdrop-blur-[2px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl flex flex-col items-center gap-12 shadow-xl px-36 py-16">
        <div className="w-32 h-10 flex items-center justify-center rounded mb-2">
          <img src="/athlos-logo.svg" alt="ATHLOS ONE" className="w-32 h-10 object-contain" />
        </div>
        <div className="w-12 h-12 flex items-center justify-center">
          <span className="w-12 h-12 rounded-full border-4 border-cyan-700 border-t-transparent animate-spin block"></span>
        </div>
      </div>
    </div>
  );
}
