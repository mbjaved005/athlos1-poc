"use client";

const roleOptions = [
  { label: 'Coach', value: 'coach' },
  { label: 'Player', value: 'player' },
  { label: 'Admin', value: 'admin' },
];

import React, { useState } from "react";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

interface Invite {
  email: string;
  role: string;
}

export default function InviteTeamOnboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const [invites, setInvites] = useState<Invite[]>([{ email: "", role: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(idx: number, value: string) {
  setInvites(invites => invites.map((i, j) => j === idx ? { ...i, email: value } : i));
}

function handleRoleChange(idx: number, value: string) {
  setInvites(invites => invites.map((i, j) => j === idx ? { ...i, role: value } : i));
}

  function handleAdd() {
  setInvites(invites => [...invites, { email: "", role: "" }]);
}

  function handleRemove(idx: number) {
    setInvites(invites => invites.length === 1 ? invites : invites.filter((_, j) => j !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Validate emails
    const validInvites = invites.filter(i => i.email.trim());
    // TODO: Send invites to backend (implement endpoint as needed)
    // await fetch("/api/user/invite-team", { ... })
    setLoading(false);
    router.push("/dashboard");
  }

  async function handleSkip() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skip: true }),
      });
      if (!res.ok) {
        setError("Failed to complete onboarding. Please try again.");
        setLoading(false);
        return;
      }
      // Force session refresh so onboardingComplete is up-to-date
      if (session?.user?.email) {
        await signIn("credentials", { email: session.user.email, password: "", redirect: false });
      }
      setLoading(false);
      window.location.href = "/dashboard";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const isFormValid = invites.every(i => i.email.trim() && i.role.trim());

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="relative w-[540px] mx-auto px-24 py-12 rounded-lg shadow-lg bg-white flex flex-col items-center">
        <button
          type="button"
          className="absolute top-4 left-4 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center z-10"
          onClick={() => router.back()}
          aria-label="Back"
        >
          <img src="/back-button.svg" alt="Back" className="w-4 h-4" />
        </button>
        <img src="/athlos-logo.svg" alt="Athlos One Logo" style={{ width: '135.81px', height: '40px' }} className="mb-2 mx-auto" />
        <h1 className="text-xl font-semibold text-center font-['Roboto'] mb-6">Invite Team Members</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          {invites.map((invite, idx) => (
            <div key={idx} className="flex flex-row gap-3 items-center">
              <InputField
                label="Email"
                id={`email-${idx}`}
                type="email"
                value={invite.email}
                onChange={e => handleChange(idx, e.target.value)}
                error={error}
                required
                className="flex-1 h-12 border border-gray-300 text-sm font-normal px-3"
              />
              <SelectField
                label="Role"
                id={`role-${idx}`}
                value={invite.role || ''}
                onChange={e => handleRoleChange(idx, e.target.value)}
                options={roleOptions}
                error={error}
                required
                className="w-40 h-12 border border-gray-300 text-sm font-normal px-3"
              />
              {invites.length > 1 && (
                <button
                  type="button"
                  className="ml-2 text-red-500 text-lg font-bold"
                  onClick={() => handleRemove(idx)}
                  aria-label="Remove member"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <div className="flex flex-row gap-1 items-center mt-1">
            <img src="/plus-button.svg" alt="Add member icon" className="w-4 h-4 align-middle" />
            <button
              type="button"
              className="text-xs text-cyan-700 font-normal font-['Roboto'] leading-none cursor-pointer bg-transparent p-0 m-0 border-none shadow-none hover:underline focus:underline whitespace-nowrap"
              onClick={handleAdd}
              aria-label="Add another member"
            >
              Add Another Member
            </button>
          </div>
        </form>
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        <button
          type="submit"
          className={`w-full text-white text-sm font-normal rounded-md h-10 mt-4 ${loading || !isFormValid ? 'opacity-50 cursor-not-allowed bg-[#99c3d1]' : 'bg-[#067394] hover:bg-[#055a73] transition-colors'}`}
          disabled={loading || !isFormValid}
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
        <button
          type="button"
          className="w-full text-xs text-center mt-2 cursor-pointer bg-white text-[#067394] border-none shadow-none hover:underline focus:underline transition-colors"
          onClick={handleSkip}
          disabled={loading}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
