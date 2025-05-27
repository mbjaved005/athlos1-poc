"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AffiliationAutocomplete from "./AffiliationAutocomplete";
import SelectField from "@/components/form/SelectField";

const regionOptions = [
  { label: "North America", value: "north-america" },
  { label: "Europe", value: "europe" },
  { label: "Asia", value: "asia" },
  { label: "Africa", value: "africa" },
  { label: "South America", value: "south-america" },
  { label: "Oceania", value: "oceania" },
  { label: "Other", value: "other" },
];

const numAthletesOptions = [
  { label: "1-10", value: "1-10" },
  { label: "11-50", value: "11-50" },
  { label: "51-200", value: "51-200" },
  { label: "201-500", value: "201-500" },
  { label: "500+", value: "500+" },
];

const affiliationSuggestions = [
  "University of Example",
  "Example Corp",
  "Athlos Club",
  "Freelancer",
  "Other"
];

export default function BasicInfoOnboarding() {
  const router = useRouter();
  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    region: string;
    affiliation: string;
    numAthletes: string;
    profileImage: string;
    activities: string[];
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    region: "",
    affiliation: "",
    numAthletes: "",
    profileImage: "",
    activities: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const regionRef = React.useRef<HTMLSelectElement>(null);

  // Cloudinary config
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dvtfrlyz2";
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned-profile-upload"; // You may need to set this in your env

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "profile-pictures");
    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm(f => ({ ...f, profileImage: data.secure_url }));
        setErrors(errs => ({ ...errs, profileImage: "" }));
      } else {
        setErrors(errs => ({ ...errs, profileImage: "Upload failed. Try again." }));
      }
    } catch (err) {
      setErrors(errs => ({ ...errs, profileImage: "Upload failed. Try again." }));
    } finally {
      setUploading(false);
    }
  }

  function validate() {
    const errs: { [key: string]: string } = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.region) errs.region = "Required";
    if (!form.affiliation.trim()) errs.affiliation = "Required";
    // Only require numAthletes if affiliation is selected
    if (form.affiliation.trim() && !form.numAthletes.trim()) errs.numAthletes = "Required";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, activities: form.activities }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          setErrors({ form: "Session expired. Please log in again.", login: true });
          setLoading(false);
          return;
        }
        setErrors({ form: "Failed to save info. Please try again." });
        setLoading(false);
        return;
      }
      // Refresh session so new profile image is picked up
      if (typeof window !== 'undefined') {
        const { getSession } = await import('next-auth/react');
        await getSession({ force: true });
      }
      setLoading(false);
      router.push("/auth/onboarding/invite-team");
    } catch (err) {
      setErrors({ form: "Network error. Please try again." });
      setLoading(false);
    }
  }

  const handleActivitiesChange = React.useCallback(
    (activities: string[]) => setForm(f => ({ ...f, activities })),
    []
  );

  return (
    <React.Fragment>
      <div className="w-full min-h-screen bg-neutral-50 flex items-center justify-center relative overflow-x-hidden">
        {/* Language Selector */}
        <div className="absolute right-16 top-10 flex items-center gap-2 text-xs text-gray-400 z-10 select-none">
          <img src="/language-icon.svg" alt="Language" className="w-5 h-5" />
          <span className="text-sm font-normal font-['Roboto'] leading-none">US - English</span>
          <span className="w-5 h-5 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
        {/* Centered Card Container */}
        <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-xl flex flex-col items-center gap-8 px-8 py-12">
          {/* Logo, title, avatar */}
          <div className="flex flex-col items-center gap-6 w-full">
            <img src="/athlos-logo.svg" alt="Athlos One Logo" className="w-32 h-10 object-contain" />
            <div className="text-center text-[#01171E] text-2xl font-semibold font-['Roboto']">Set up your account</div>
            {/* Profile Image Upload */}
            <div className="w-28 h-28 bg-[#F0F1F2] rounded-full border-[0.82px] border-[#CFD6DE] flex items-center justify-center relative overflow-visible">
              {/* Avatar image or icon, absolutely centered and filling container */}
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="absolute inset-0 w-full h-full object-cover rounded-full border-2 border-white"
                  style={{ zIndex: 1 }}
                />
              ) : (
                <img
                  src="/person-icon.svg"
                  alt="person"
                  className="absolute inset-0 w-16 h-16 m-auto object-contain opacity-50"
                  style={{ zIndex: 1 }}
                />
              )}
              {/* Plus button overlay */}
              <label
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#067394] rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-cyan-700 transition shadow-lg"
                style={{ zIndex: 10 }}
                aria-label="Upload profile image"
                title="Upload profile image"
              >
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
                {uploading ? (
                  <svg className="animate-spin" width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 5V15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5 10H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </label>
            </div>
            {errors.profileImage && <div className="text-xs text-red-500 mt-1">{errors.profileImage}</div>}
          </div>
          {/* Form Section */}
          <form className="flex flex-col gap-6 w-full mt-4" onSubmit={handleSubmit} autoComplete="off">
            {/* Name Fields */}
            <div className="w-full inline-flex justify-start items-center gap-4">
              {/* First Name */}
              <div className="flex-1 h-14 bg-[#FFFFFF] rounded-tl rounded-tr inline-flex flex-col justify-start items-start">
                <div className="self-stretch flex-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#CFD6DE] flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch flex-1 pl-4 py-1 rounded-tl rounded-tr inline-flex justify-start items-start gap-1">
                    <div className="flex-1 h-12 py-1 relative inline-flex flex-col justify-center items-start cursor-text" onClick={() => firstNameRef.current?.focus()} tabIndex={0} role="button" aria-label="First Name">
                      <input
                        type="text"
                        ref={firstNameRef}
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        className="flex-1 justify-center text-[#272F3A] text-base font-normal font-['Roboto'] leading-tight bg-white border-none focus:ring-0 p-0 m-0 outline-none"
                        placeholder="John"
                        id="firstName"
                      />
                      <div className="px-1 left-[-4px] top-[-10px] absolute bg-[#FFF] inline-flex justify-start items-center">
                        <label htmlFor="firstName" className="justify-start text-[#272F3A] text-xs font-normal font-['Roboto'] leading-none">First Name</label>
                      </div>
                      {errors.firstName && <div className="text-xs text-red-500 mt-1">{errors.firstName}</div>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Last Name */}
              <div className="flex-1 h-14 bg-[#FFFFFF] rounded-tl rounded-tr inline-flex flex-col justify-start items-start">
                <div className="self-stretch flex-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#CFD6DE] flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch flex-1 pl-4 py-1 rounded-tl rounded-tr inline-flex justify-start items-start gap-1">
                    <div className="flex-1 h-12 py-1 relative inline-flex flex-col justify-center items-start cursor-text" onClick={() => lastNameRef.current?.focus()} tabIndex={0} role="button" aria-label="Last Name">
                      <input
                        type="text"
                        ref={lastNameRef}
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        className="flex-1 justify-center text-[#272F3A] text-base font-normal font-['Roboto'] leading-tight bg-white border-none focus:ring-0 p-0 m-0 outline-none"
                        placeholder="Doe"
                        id="lastName"
                      />
                      <div className="px-1 left-[-4px] top-[-10px] absolute bg-[#FFF] inline-flex justify-start items-center">
                        <label htmlFor="lastName" className="justify-start text-[#272F3A] text-xs font-normal font-['Roboto'] leading-none">Last Name</label>
                      </div>
                      {errors.lastName && <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Phone Field */}
            <div className="w-full inline-flex justify-start items-start gap-6">
              <div className="flex-1 h-14 bg-[#FFFFFF] rounded-tl rounded-tr inline-flex flex-col justify-start items-start">
                <div className="self-stretch flex-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#CFD6DE] flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch flex-1 pl-4 py-1 rounded-tl rounded-tr inline-flex justify-start items-start gap-1">
                    <div className="flex-1 h-12 py-1 relative inline-flex flex-col justify-center items-start cursor-text" onClick={() => phoneRef.current?.focus()} tabIndex={0} role="button" aria-label="Phone Number">
                      <input
                        type="tel"
                        ref={phoneRef}
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="flex-1 justify-center text-[#272F3A] text-base font-normal font-['Roboto'] leading-tight bg-white border-none focus:ring-0 p-0 m-0 outline-none"
                        placeholder="(000)-000-0000"
                        id="phone"
                      />
                      <div className="px-1 left-[-4px] top-[-10px] absolute bg-[#FFF] inline-flex justify-start items-center">
                        <label htmlFor="phone" className="justify-start text-[#272F3A] text-xs font-normal font-['Roboto'] leading-none">Phone</label>
                      </div>
                      {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Region Dropdown */}
            <div className="w-full">
              <SelectField
                label="Region"
                options={regionOptions}
                value={form.region}
                onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                error={errors.region}
                id="region"
                name="region"
                required
              />
            </div>
            {/* Divider */}
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.5px] outline-[#F0F1F2]"></div>
            {/* Affiliation Field: Autocomplete */}
            <AffiliationAutocomplete
              value={form.affiliation}
              onChange={(val: string) => setForm(f => ({ ...f, affiliation: val, numAthletes: "" }))}
              onActivitiesChange={handleActivitiesChange}
              error={errors.affiliation}
              label="Your Affiliation"
              disabled={loading}
            />
            {/* Number of Athletes Field (show only if affiliation is selected) */}
            {form.affiliation.trim() && (
              <div className="w-full">
                <SelectField
                  label="Number of Athletes"
                  options={numAthletesOptions}
                  value={form.numAthletes}
                  onChange={e => setForm(f => ({ ...f, numAthletes: e.target.value }))}
                  error={errors.numAthletes}
                  id="numAthletes"
                  name="numAthletes"
                  required
                />
              </div>
            )}
            {/* Invite your team Button: Only show if all required fields are filled */}
            {form.firstName.trim() && form.lastName.trim() && form.phone.trim() && form.region && form.affiliation.trim() && form.numAthletes.trim() && (
              <button
                type="submit"
                className="w-full h-12 bg-cyan-700 text-white rounded-lg font-semibold text-lg hover:bg-cyan-800 transition disabled:opacity-60 mt-2"
                disabled={loading || Object.keys(validate()).length > 0}
                aria-disabled={loading || Object.keys(validate()).length > 0}
              >
                {loading ? "Saving..." : "Invite your team"}
              </button>
            )}
            {errors.form && (
              <div className="text-xs text-red-500 mt-1">
                {errors.form} {errors.login && (
                  <a href="/auth/login" className="underline text-cyan-700 ml-1">Login</a>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
