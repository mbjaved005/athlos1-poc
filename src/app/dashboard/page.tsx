"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import StartTourModal from "@/components/StartTourModal";
import React, { useState } from "react";
import { ProfileDropdown } from "./ProfileDropdown";
import { useRouter } from "next/navigation";
import { recruitingPipelineData, RecruitingPipelinePosition } from "./recruitingPipelineData";

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

      {/* Main Dashboard Content */}
      <main className="pt-14 max-w-[1336px] mx-auto px-[52px] flex flex-col gap-4">
        {/* Header Section (single, as in reference) */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-Content-Default dark:text-neutral-100 text-2xl font-semibold font-['Roboto']">
                {loading ? "Loading..." : error ? "Error loading dashboard" : `Hello, ${dashboardData?.user?.name || "User"}!`}
              </div>
              <div className="justify-start text-sm font-normal font-['Roboto'] leading-none">
                {loading ? " " : error ? error : (
                  <>
                    <span className="text-Content-Tertiary dark:text-neutral-400">Get a complete overview of </span>
                    <span className="text-blue-600 font-medium">ZogSports</span>
                    <span className="text-Content-Tertiary dark:text-neutral-400"> key insights and platform activity at a glance.</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/refresh-icon.svg" alt="Last Refreshed" className="w-4 h-4" />
                <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-normal font-['Roboto'] leading-none">Last Refreshed 1 min ago</div>
              </div>
              <div className="w-2.5 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.5px] outline-Border-Divider dark:outline-neutral-700" />
              <div className="h-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-Border-Default dark:outline-neutral-700 flex items-center overflow-hidden">
                <div className="h-8 pl-2 pr-3 py-1.5 flex items-center gap-2">
                  <img src="/calendar-icon.svg" alt="Calendar" className="w-4 h-4" />
                  <div className="text-Content-Tertiary dark:text-neutral-400 text-sm font-semibold font-['Roboto'] leading-none">This month</div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats Row (Athlete Stats + Recruiting Overview) */}
          <div className="w-full flex gap-4">
            {/* Athlete Stats */}
            <div className="flex-1 p-6 bg-white dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-Neutral-200 dark:outline-neutral-700 flex flex-col gap-3 min-h-[156px]">
              <div className="flex flex-col gap-6">
                <div className="flex items-center">
                  <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Athlete Stats</div>
                </div>
                <div className="flex justify-between items-center w-full">
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
            </div>
            {/* Recruiting Overview */}
            <div className="flex-1 p-6 bg-white dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-Neutral-200 dark:outline-neutral-700 flex flex-col gap-6">
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
          {/* Recruiting Pipeline and Updates */}
          <div className="w-full flex gap-4">
            {/* Recruiting Pipeline */}
            <div className="w-[946px] h-[500px] p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col">
  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Recruiting Pipeline</div>
    <div className="flex items-center gap-1 cursor-pointer select-none text-Content-Tertiary text-sm font-normal font-['Roboto'] leading-none hover:underline">
      <span>View All</span>
      <span className="w-5 h-5 flex items-center justify-center">
        <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    </div>
  </div>
  {/* Table Header */}
  <div className="flex px-2 py-1 border-b border-zinc-200/50 text-Content-Secondary text-sm font-normal font-['Roboto']">
    <div className="flex-1">Position</div>
    <div className="w-24 text-center">Applied</div>
    <div className="w-24 text-center">Shortlisted</div>
    <div className="w-24 text-center">Invited</div>
    <div className="w-24 text-center">Hired</div>
  </div>
  {/* Table Rows */}
  <div className="flex-1 overflow-y-auto">
    {recruitingPipelineData.map((row: RecruitingPipelinePosition, idx: number) => (
      <div key={row.position + idx} className="flex px-2 py-3 border-b border-zinc-100 text-Content-Default text-base font-normal font-['Roboto'] items-center">
        <div className="flex-1">{row.position}</div>
        <div className="w-24 text-center">{row.applied}</div>
        <div className="w-24 text-center">{row.shortlisted}</div>
        <div className="w-24 text-center">{row.invited}</div>
        <div className="w-24 text-center">{row.hired}</div>
      </div>
    ))}
  </div>
</div>
            {/* Recruiting Updates */}
            <div className="w-[374px] h-[500px] p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col">
              <div className="flex items-center h-8">
                <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Recruiting Updates</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">
                  No new update yet.
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex gap-4 mt-4">
          {/* Top Performing Athletes */}
          <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3 overflow-hidden">
  <div className="flex flex-col gap-6 h-full">
    <div className="flex justify-between items-center">
      <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Top Performing Athletes</div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">
        Add teams and athletes to track performances.
      </div>
    </div>
  </div>
</div>
          {/* Top Regressing Athlete */}
          <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3 overflow-hidden">
  <div className="flex flex-col gap-6 h-full">
    <div className="flex justify-between items-center">
      <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Top Regressing Athlete</div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">
        Add teams and athletes to track performances.
      </div>
    </div>
  </div>
</div>
        </section>
        <section className="w-full flex gap-4 mt-4 mb-8">
          {/* Avg. Team Performance */}
          <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-Neutral-200 dark:outline-neutral-700 flex flex-col gap-3">
  <div className="flex flex-col gap-6 h-full">
    <div className="flex justify-between items-center">
      <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Avg. Team Performance</div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">
        Add teams and athletes to track performances.
      </div>
    </div>
  </div>
</div>
          {/* Recent Activity */}
          <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3">
  <div className="flex flex-col gap-6 h-full">
    <div className="flex justify-between items-center">
      <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Recent Activity</div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">
        No activity yet. Once you or your team take actions, updates will appear here.
      </div>
    </div>
  </div>
</div>
        </section>
      </main>
    </div>
  );
}
// //         <section className="w-full flex gap-4 mt-4">
// //           {/* Top Performing Athletes */}
// //           <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3 overflow-hidden">
// //             <div className="flex flex-col gap-6">
// //               <div className="flex justify-between items-center">
// //                 <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Top Performing Athletes</div>
// //               </div>
// //               <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">Add teams and athletes to track performances.</div>
// //             </div>
// //           </div>
// //           {/* Top Regressing Athlete */}
// //           <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3 overflow-hidden">
// //             <div className="flex flex-col gap-6">
// //               <div className="flex justify-between items-center">
// //                 <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Top Regressing Athlete</div>
// //               </div>
// //               <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">Add teams and athletes to track performances.</div>
// //             </div>
// //           </div>
// //         </section>
// //         <section className="w-full flex gap-4 mt-4 mb-8" aria-labelledby="dashboard-bottom-section">
// //   <h2 id="dashboard-bottom-section" className="sr-only">Dashboard Bottom Section</h2>
// //           {/* Avg. Team Performance */}
// //           <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-Neutral-200 dark:outline-neutral-700 flex flex-col gap-3">
// //             <div className="flex flex-col gap-6">
// //               <div className="flex justify-between items-center">
// //                 <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Avg. Team Performance</div>
// //               </div>
// //               <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">Add teams and athletes to track performances.</div>
// //             </div>
// //           </div>
// //           {/* Recent Activity */}
// //           <div className="flex-1 h-96 p-6 bg-white dark:bg-neutral-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-100 dark:outline-neutral-700 flex flex-col gap-3">
// //             <div className="flex flex-col gap-6">
// //               <div className="flex justify-between items-center">
// //                 <div className="text-Content-Default dark:text-neutral-100 text-lg font-semibold font-['Roboto'] leading-normal">Recent Activity</div>
// //               </div>
// //               <div className="flex-1 text-center text-Color-Text-Colors-Muted-Text dark:text-neutral-500 text-sm font-normal font-['Roboto'] leading-none">No activity yet. Once you or your team take actions, updates will appear here.</div>
// //             </div>
// //           </div>
// //         </section>
//       {/* Need help getting started? Card */}
// <div className="w-full p-5 bg-white rounded-lg flex justify-between items-center mt-8">
//   <div className="w-80 flex flex-col justify-center items-start gap-1">
//     <div className="text-center justify-start text-Color-Text-Colors-Primary-Text text-base font-semibold font-['Roboto'] leading-tight">Need help getting started?</div>
//   </div>
//   <div className="flex justify-start items-center gap-3">
//     <button className="h-10 rounded-[100px] flex justify-center items-center gap-2 px-3 py-3 bg-white shadow-sm border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 aria-label='Contact AthlosOne Team'">
//       <span className="w-4 h-4 bg-cyan-700 rounded-full inline-block mr-2" aria-hidden="true"></span>
//       <span className="text-center text-cyan-700 text-sm font-semibold font-['Roboto'] leading-none">Contact AthlosOne Team</span>
//     </button>
//     <button className="h-10 rounded-[100px] flex justify-center items-center gap-2 px-3 py-3 bg-white shadow-sm border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 aria-label='Help Center'">
//       <span className="w-4 h-4 bg-cyan-700 rounded-full inline-block mr-2" aria-hidden="true"></span>
//       <span className="text-center text-cyan-700 text-sm font-semibold font-['Roboto'] leading-none">Help Center</span>
//     </button>
//   </div>
// </div>
//     </main>
//     // </div>
// //   );
// // }
