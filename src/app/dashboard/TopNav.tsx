"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { ProfileDropdown } from "./ProfileDropdown";

export default function TopNav() {
  const navTabs = [
    { name: "Home", href: "/dashboard" },
    { name: "Recruiting", href: "/dashboard/recruiting" },
    { name: "Find Talent", href: "/dashboard/find-talent" },
    { name: "Manage Talent", href: "/dashboard/manage-talent" },
    { name: "Teams", href: "/dashboard/teams" },
    { name: "Integrations", href: "/dashboard/integrations" },
  ];
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Always call all hooks at the top level
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown on route change
  React.useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  if (!isClient || status === "loading") {
    // Prevent hydration mismatch by rendering nothing or a loader until client-side
    return null;
  }

  const userName = session?.user?.name || session?.user?.email || "?";
  const userInitial = userName[0]?.toUpperCase() || "?";

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-black z-30 shadow-none">
      <div className="max-w-[1336px] mx-auto px-[52px] w-full flex items-center justify-between h-14">
        {/* Left: Logo and Nav */}
        <div className="flex justify-start items-center gap-6">
          <img className="w-24 h-7" src="/top-nav/ahtlos-logo-light.svg" alt="AthlosOne Logo" />
          <div className="flex justify-start items-center gap-2">
            {navTabs.map((tab) => (
              <Link key={tab.name} href={tab.href} legacyBehavior>
                <a
                  className={
                    pathname === tab.href
                      ? "px-4 py-2 rounded-lg bg-Navy-600 bg-opacity-40 text-white text-sm font-bold font-['Roboto'] leading-none"
                      : "px-4 py-2 rounded-lg text-white text-sm font-normal font-['Roboto'] leading-none hover:bg-Navy-700 hover:bg-opacity-30 hover:text-white transition"
                  }
                >
                  {tab.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
        {/* Right: Icons and Avatar */}
        <div className="flex items-center gap-4">
          <img src="/top-nav/search.svg" alt="Search Icon" className="w-5 h-5 text-white" />
          <img src="/top-nav/chat-icon.svg" alt="Chat Icon" className="w-5 h-5 text-white" />
          <img src="/top-nav/calendar-icon.svg" alt="Calendar Icon" className="w-5 h-5 text-white" />
          <img src="/top-nav/notification-icon.svg" alt="Notification Icon" className="w-5 h-5 text-white" />
          <img src="/top-nav/help-icon.svg" alt="Help Icon" className="w-5 h-5 text-white" />
          {/* Avatar/Profile Dropdown */}
          <div className="relative ml-2">
            <button
              className="w-9 h-9 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-700"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              aria-label="Open profile menu"
              onClick={() => setDropdownOpen((open) => !open)}
              tabIndex={0}
            >
              <span className="text-Navy-900 dark:text-white text-base font-semibold font-['Inter']">
                {userInitial}
              </span>
            </button>
            {dropdownOpen && (
              <ProfileDropdown open={dropdownOpen} onClose={() => setDropdownOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
