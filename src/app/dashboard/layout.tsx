"use client";
export const dynamic = "force-dynamic";

import React from "react";
import TopNav from "./TopNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-Neutral-100 dark:bg-neutral-900 relative overflow-x-auto">
      <TopNav />
      <main className="pt-24 px-16 max-w-[1440px] mx-auto flex flex-col gap-4">
        {children}
      </main>
    </div>
  );
}
