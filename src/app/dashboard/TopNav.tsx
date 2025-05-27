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
            className="w-9 h-9 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-700 overflow-hidden"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            aria-label="Open profile menu"
            onClick={() => setDropdownOpen((open) => !open)}
            tabIndex={0}
          >
            {session?.user && (session.user.profileImage || session.user.image) ? (
              <img
                src={session.user.profileImage || session.user.image || ''}
                alt="Profile"
                className="w-9 h-9 object-cover rounded-full border border-gray-200"
              />
            ) : (
              <span className="text-neutral-900 dark:text-white text-base font-semibold font-['Inter']">
                {userInitial}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <ProfileDropdown open={dropdownOpen} onClose={() => setDropdownOpen(false)} />
          )}
        </div>
      </div>
    </nav>
  );
}
