"use client";
import React, { useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
}

import Link from "next/link";

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} legacyBehavior>
      <a
        className="w-full text-left px-3 py-2 text-zinc-800 text-sm font-normal font-['Roboto'] leading-none hover:bg-[#F6F8FA] focus:bg-[#F6F8FA] focus:outline-none rounded-lg block"
        role="menuitem"
        tabIndex={0}
      >
        {children}
      </a>
    </Link>
  );
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ open, onClose }) => {
  const { data: session } = useSession();
  const [profile, setProfile] = React.useState<{ firstName?: string; lastName?: string; email?: string } | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      setProfileLoading(true);
      setProfile(null);
      fetch("/api/user/profile")
        .then(res => res.json())
        .then(data => setProfile(data.user))
        .catch(() => setProfile(null))
        .finally(() => setProfileLoading(false));
    }
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  // Only compute userName/userInitial when not loading
  let userName = "";
  let userInitial = "";
  if (!profileLoading) {
    userName = profile?.firstName
      ? `${profile.firstName} ${profile.lastName || ''}`.trim()
      : profile?.email || session?.user?.email || "User";
    userInitial = userName[0]?.toUpperCase() || "U";
  }

  return (
    <div
      ref={dropdownRef}
      className="min-w-[192px] absolute right-0 top-12 z-50 rounded-lg shadow-[0px_6px_20px_0px_rgba(184,196,221,0.40)] bg-white"
      role="menu"
      aria-label="Profile menu"
      tabIndex={-1}
    >
      <div className="flex flex-col gap-0.5 py-2">
        {/* User row */}
        {profileLoading ? (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="inline-block w-6 h-6 border-2 border-cyan-700 border-t-transparent rounded-full animate-spin" aria-label="Loading spinner"></span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 bg-cyan-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium font-['Inter']" aria-label="User initial">{userInitial}</span>
            </div>
            <span className="text-zinc-800 text-sm font-semibold font-['Roboto'] leading-none truncate" title={userName}>{userName}</span>
          </div>
        )}

        {/* Divider */}
        <div className="mx-3 my-1 h-px bg-[#B8C4DD33]" />
        {/* Menu links */}
        <MenuLink href="/dashboard/edit-profile">Edit Profile</MenuLink>
        <MenuLink href="/dashboard/billing">Billing</MenuLink>
        <MenuLink href="/dashboard/invite-teammates">Invite Teammates</MenuLink>
        <MenuLink href="/dashboard/settings">Settings</MenuLink>
        {/* Divider */}
        <div className="mx-3 my-1 h-px bg-[#B8C4DD33]" />
        {/* Logout */}
        <button
          className="w-full text-left px-3 py-2 text-zinc-800 text-sm font-normal font-['Roboto'] leading-none hover:bg-[#F6F8FA] focus:bg-[#F6F8FA] focus:outline-none rounded-lg"
          role="menuitem"
          tabIndex={0}
          onClick={() => signOut({ redirect: false })}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
