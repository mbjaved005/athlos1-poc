"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import StartTourModal from "@/components/StartTourModal";
import React, { useState } from "react";
import { ProfileDropdown } from "./ProfileDropdown";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const router = useRouter();
  const [showTourModal, setShowTourModal] = React.useState(false);
  const [tourModalChecked, setTourModalChecked] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-Neutral-100 dark:bg-neutral-900">
        <div className="text-lg text-gray-700 dark:text-neutral-100">Loading...</div>
      </div>
    );
  }
  if (status === "unauthenticated") {
    return null;
  }

  React.useEffect(() => {
    if (!session?.user?.email) return;
    setLoading(true);
    setError(null);
    fetch("/api/user/profile")
      .then(res => res.json())
      .then(data => {
        setDashboardData({
          user: {
            name: data.user.firstName
              ? `${data.user.firstName} ${data.user.lastName}`.trim()
              : data.user.email,
          },
          stats: {
            totalAthletes: 5,
            activeTeams: 2,
            injuredPlayers: 1,
            avgTeamPerformance: 78,
            openPositions: 3,
            totalApplicants: 12,
            shortlistedApplicants: 4,
            invitedForTryout: 2,
          },
        });
        // Check hasSeenTourModal flag
        if (data.user && data.user.hasSeenTourModal === false) {
          setShowTourModal(true);
        }
        setTourModalChecked(true);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user profile.");
        setLoading(false);
      });
  }, [session]);

  const navTabs = [
    { name: "Home", href: "/dashboard" },
    { name: "Recruiting", href: "/dashboard/recruiting" },
    { name: "Find Talent", href: "/dashboard/find-talent" },
    { name: "Manage Talent", href: "/dashboard/manage-talent" },
    { name: "Teams", href: "/dashboard/teams" },
    { name: "Integrations", href: "/dashboard/integrations" },
  ];
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-Neutral-100 dark:bg-neutral-900 relative overflow-x-auto">
      {/* Start Tour Modal overlay - only show after profile loaded and if not seen */}
      {tourModalChecked && showTourModal && (
        <StartTourModal
          open={showTourModal}
          userName={dashboardData?.user?.name || "User"}
          onClose={async () => {
            setShowTourModal(false);
            await fetch("/api/user/tour", { method: "PATCH" });
          }}
          onGetStarted={async () => {
            setShowTourModal(false);
            await fetch("/api/user/tour", { method: "PATCH" });
            // Optionally, trigger tour logic here
          }}
          onTakeTour={async () => {
            setShowTourModal(false);
            await fetch("/api/user/tour", { method: "PATCH" });
            // Optionally, trigger tour logic here
          }}
        />
      )}

      {/* Top Navigation Bar */}
      <nav className="w-full h-16 px-12 fixed top-0 left-0 bg-black dark:bg-Neutral-100 flex items-center z-20">
        <div className="flex items-center gap-x-10 w-full h-full">
          {/* Logo */}
          <img className="w-28 h-9 block dark:hidden object-contain" src="/top-nav/ahtlos-logo-light.svg" alt="AthlosOne Logo Light" />
          <img className="w-28 h-9 hidden dark:block object-contain" src="/top-nav/ahtlos-logo-dark.svg" alt="AthlosOne Logo Dark" />
          {/* Nav Links */}
          <div className="flex items-center gap-x-8 h-full">
            {navTabs.map(tab => {
              const isActive = pathname === tab.href || (tab.href === "/dashboard" && pathname === "/dashboard");
              return (
                <Link key={tab.name} href={tab.href} legacyBehavior>
                  <a
                    className={
                      isActive
                        ? "text-Neutral-100 dark:text-neutral-900 text-sm font-bold font-['Roboto'] leading-none bg-Navy-600 bg-opacity-40 px-4 py-2 rounded-lg"
                        : "opacity-80 text-Neutral-100 dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none hover:opacity-100 transition-opacity px-4 py-2 rounded-lg"
                    }
                  >
                    {tab.name}
                  </a>
                </Link>
              );
            })}
          </div>
          {/* Spacer */}
          <div className="flex-1" />
          {/* Icons */}
          <div className="flex items-center gap-x-6">
            <img className="w-7 h-7 text-white dark:text-neutral-900" src="/top-nav/search.svg" alt="Search Icon" />
            <img className="w-7 h-7 text-white dark:text-neutral-900" src="/top-nav/chat-icon.svg" alt="Chat Icon" />
            <img className="w-7 h-7 text-white dark:text-neutral-900" src="/top-nav/calendar-icon.svg" alt="Calendar Icon" />
            <img className="w-7 h-7 text-white dark:text-neutral-900" src="/top-nav/notification-icon.svg" alt="Notification Icon" />
            <img className="w-7 h-7 text-white dark:text-neutral-900" src="/top-nav/help-icon.svg" alt="Help Icon" />
          </div>
           {/* User Avatar with Profile Dropdown */}
           <div className="relative ml-8">
             <button
               className="w-9 h-9 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-700"
               aria-haspopup="menu"
               aria-expanded={dropdownOpen}
               aria-label="Open profile menu"
               onClick={() => setDropdownOpen((open) => !open)}
               tabIndex={0}
             >
               <span className="text-neutral-900 dark:text-white text-base font-semibold font-['Inter']">
                 {dashboardData?.user?.name ? dashboardData.user.name[0].toUpperCase() : "?"}
               </span>
             </button>
             {dropdownOpen && (
               <ProfileDropdown open={dropdownOpen} onClose={() => setDropdownOpen(false)} />
             )}
           </div>
         </div>
       </nav>
      {/* Main Content */}
      <main className="pt-24 px-16 max-w-[1440px] mx-auto flex flex-col gap-4">
        {/* Header Section */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-Content-Default dark:text-neutral-100 text-2xl font-semibold font-['Roboto']">
                {loading ? "Loading..." : error ? "Error loading dashboard" : `Hello, ${dashboardData?.user?.name || "User"}!`}
              </div>
              <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">
                {loading ? " " : error ? error : "Get a complete overview of your key insights and platform activity at a glance."}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-Navy-400 dark:bg-blue-700 rounded flex items-center justify-center" />
                <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Last Refreshed 1 min ago</div>
              </div>
              <div className="w-2.5 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.5px] outline-Border-Divider dark:outline-neutral-700" />
              <div className="h-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-Border-Default dark:outline-neutral-700 flex items-center overflow-hidden">
                <div className="h-8 pl-2 pr-3 py-1.5 flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-500 dark:bg-blue-900 rounded flex items-center justify-center" />
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-semibold font-['Roboto'] leading-none">This month</div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats Row */}
          <div className="w-full flex gap-4">
            {/* Athlete Stats */}
            <div className="flex-1 p-6 bg-Neutral-50 dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-Neutral-200 dark:outline-neutral-700 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-start gap-1">
                  <div className="text-Content-Default dark:text-neutral-100 text-3xl font-semibold font-['Roboto']">{dashboardData?.stats?.totalAthletes ?? 0}</div>
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Total Athletes</div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-Content-Default dark:text-neutral-100 text-3xl font-semibold font-['Roboto']">{dashboardData?.stats?.activeTeams ?? 0}</div>
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Active Teams</div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-Content-Default dark:text-neutral-100 text-3xl font-semibold font-['Roboto']">{dashboardData?.stats?.injuredPlayers ?? 0}</div>
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Injured Players</div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-Content-Default dark:text-neutral-100 text-3xl font-semibold font-['Roboto']">{dashboardData?.stats?.avgTeamPerformance ?? 0}</div>
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Avg Team Performance</div>
                </div>
              </div>
            </div>
            {/* Recruiting Overview */}
            <div className="flex-1 p-6 bg-Neutral-50 dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-Neutral-200 dark:outline-neutral-700 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Recruiting Overview</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-start gap-1">
                  <div className="text-Content-Default dark:text-neutral-100 text-3xl font-semibold font-['Roboto']">{dashboardData?.stats?.openPositions ?? 0}</div>
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Open Positions</div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-Content-Default dark:text-neutral-100 text-3xl font-semibold font-['Roboto']">{dashboardData?.stats?.totalApplicants ?? 0}</div>
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Total Applicants</div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-Content-Default dark:text-neutral-100 text-3xl font-semibold font-['Roboto']">{dashboardData?.stats?.shortlistedApplicants ?? 0}</div>
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Shortlisted Applicants</div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-Content-Default dark:text-neutral-100 text-3xl font-semibold font-['Roboto']">{dashboardData?.stats?.invitedForTryout ?? 0}</div>
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Invited for Tryout</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Main Dashboard Rows */}
        <section className="w-full flex gap-4 mt-4">
          {/* Recruiting Pipeline */}
          <div className="w-[946px] p-5 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Recruiting Pipeline</div>
                </div>
              </div>
              <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">No position postings yet. Start hiring top talent today!</div>
            </div>
          </div>
          {/* Recruiting Updates */}
          <div className="flex-1 p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Recruiting Updates</div>
              </div>
              <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">No new update yet.</div>
            </div>
          </div>
        </section>
        <section className="w-full flex gap-4 mt-4">
          {/* Top Performing Athletes */}
          <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3 overflow-hidden">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Top Performing Athletes</div>
              </div>
              <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">Add teams and athletes to track performances.</div>
            </div>
          </div>
          {/* Top Regressing Athlete */}
          <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3 overflow-hidden">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Top Regressing Athlete</div>
              </div>
              <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">Add teams and athletes to track performances.</div>
            </div>
          </div>
        </section>
        <section className="w-full flex gap-4 mt-4 mb-8">
          {/* Avg. Team Performance */}
          <div className="flex-1 h-96 p-6 bg-Neutral-50 dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-Neutral-200 dark:outline-neutral-700 flex flex-col gap-3">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Avg. Team Performance</div>
              </div>
              <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">Add teams and athletes to track performances.</div>
            </div>
          </div>
          {/* Recent Activity */}
          <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Recent Activity</div>
              </div>
              <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">No activity yet. Once you or your team take actions, updates will appear here.</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
