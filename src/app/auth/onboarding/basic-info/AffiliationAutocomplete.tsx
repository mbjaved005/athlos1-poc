"use client";
import React, { useState, useRef, useEffect } from "react";

// Dummy affiliations for autocomplete
const DUMMY_AFFILIATIONS = [
  {
    name: "University of Example",
    address: "123 College Rd, City, Country",
    initials: "UE",
    color: "bg-cyan-700",
  },
  {
    name: "Example Corp",
    address: "456 Business Ave, City, Country",
    initials: "EC",
    color: "bg-rose-600",
  },
  {
    name: "Athlos Club",
    address: "789 Sports St, City, Country",
    initials: "AC",
    color: "bg-teal-400",
  },
  {
    name: "Freelancer",
    address: "Remote",
    initials: "FR",
    color: "bg-gray-400",
  },
];

interface AffiliationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onActivitiesChange?: (activities: string[]) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
}

const AffiliationAutocomplete: React.FC<AffiliationAutocompleteProps> = ({ value, onChange, onActivitiesChange, error, label = "Your Affiliation", disabled }) => {
  const [inputValue, setInputValue] = useState(value);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputValue(value); }, [value]);

  // Filtered suggestions
  const filtered = DUMMY_AFFILIATIONS.filter(a =>
    a.name.toLowerCase().includes(inputValue.trim().toLowerCase())
  );
  const showCreateOption = inputValue.trim() && !filtered.some(a => a.name.toLowerCase() === inputValue.trim().toLowerCase());

  // Handle click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
        setHighlighted(-1);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!dropdownOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, filtered.length + (showCreateOption ? 1 : 0) - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0) {
        if (highlighted < filtered.length) {
          select(filtered[highlighted].name);
        } else if (showCreateOption) {
          select(inputValue.trim());
        }
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      setHighlighted(-1);
    }
  }

  function select(name: string) {
    onChange(name);
    setInputValue(name);
    setDropdownOpen(false);
    setHighlighted(-1);
  }

  // If a valid affiliation is selected, show it as a card
  const selectedAffiliation = DUMMY_AFFILIATIONS.find(a => a.name === value);
  // Activities state (local only)
  const [activities, setActivities] = useState<string[]>([]);
  const [activitiesDropdownOpen, setActivitiesDropdownOpen] = useState(false);

  // Notify parent when activities change
  useEffect(() => {
    if (onActivitiesChange) {
      onActivitiesChange(activities);
    }
  }, [activities, onActivitiesChange]);
  const activitiesDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activitiesDropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (activitiesDropdownRef.current && !activitiesDropdownRef.current.contains(event.target as Node)) {
        setActivitiesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activitiesDropdownOpen]);

  const ACTIVITY_OPTIONS = [
    { name: "Football", icon: "/football-icon.svg" },
    { name: "Basketball", icon: "/basketball-icon.svg" },
    { name: "Kickball", icon: "/kickball-icon.svg" },
  ];
  const addActivity = (activity: string) => {
    if (!activities.includes(activity)) setActivities([...activities, activity]);
  };
  const removeActivity = (activity: string) => {
    setActivities(activities.filter(a => a !== activity));
  };
  const availableToAdd = ACTIVITY_OPTIONS.filter(a => !activities.includes(a.name));

  if (value && selectedAffiliation) {
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="justify-start text-[#272F3A] text-sm font-semibold font-['Roboto'] leading-none mb-1">Your Affiliation</div>
        <div className="self-stretch p-3.5 bg-[#F7F8FA] rounded-lg flex flex-col justify-center items-start gap-3 border border-[#DFE3E9]">
          <div className="self-stretch inline-flex justify-start items-start gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center text-white font-semibold text-base" style={{ background: selectedAffiliation.color ? undefined : '#ccc' }}>
              <div className={selectedAffiliation.color + " w-10 h-10 rounded flex items-center justify-center"}>{selectedAffiliation.initials}</div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
              <div className="text-base font-normal text-[#272F3A] leading-tight">{selectedAffiliation.name}</div>
              <div className="self-stretch text-sm text-[#617692] font-normal leading-none">{selectedAffiliation.address}</div>
            </div>
            <button
              type="button"
              aria-label="Clear affiliation"
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
              onClick={() => { onChange(""); setInputValue(""); setDropdownOpen(false); setHighlighted(-1); setActivities([]); }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 6l8 8M14 6l-8 8" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          {/* Activities Row */}
          <div className="self-stretch flex flex-wrap gap-2 pt-3 border-t border-[#E2E8F0] mt-2">
            {activities.map(activity => {
              const icon = ACTIVITY_OPTIONS.find(a => a.name === activity)?.icon;
              return (
                <span key={activity} className="px-3 py-2 bg-[#F7F8FA] rounded-full outline outline-1 outline-offset-[-1px] outline-[#DFE3E9] flex items-center gap-1 text-[#272F3A] text-sm font-normal">
                  {icon && <img src={icon} alt={activity} className="w-4 h-4 mr-1" />}
                  {activity}
                  <button type="button" className="ml-1 text-[#A0AEC0] hover:text-[#272F3A]" aria-label={`Remove ${activity}`} onClick={() => removeActivity(activity)}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M6 6l8 8M14 6l-8 8" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </span>
              );
            })}
            {/* Activities Dropdown Logic */}
            <div className="relative" ref={activitiesDropdownRef}>
              <button
                type="button"
                className="px-3 py-2 bg-[#F7F8FA] rounded-full outline outline-1 outline-offset-[-1px] outline-[#DFE3E9] flex items-center gap-1 text-[#617692] text-sm font-normal hover:bg-[#e6f2fa]"
                onClick={e => {
                  if (availableToAdd.length === 1) {
                    addActivity(availableToAdd[0].name);
                  } else if (availableToAdd.length > 1) {
                    setActivitiesDropdownOpen(v => !v);
                  }
                }}
                tabIndex={0}
              >
                {activities.length === 0 ? (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mr-1"><path d="M10 5v10M5 10h10" stroke="#617692" strokeWidth="2" strokeLinecap="round"/></svg>
                    Add Activity
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mr-1"><path d="M10 5v10M5 10h10" stroke="#617692" strokeWidth="2" strokeLinecap="round"/></svg>
                    Add More
                  </>
                )}
              </button>
              {/* Dropdown for activities to add */}
              {activitiesDropdownOpen && availableToAdd.length > 1 && (
                <div className="absolute mt-2 bg-white border border-[#DFE3E9] rounded-lg shadow-lg z-10 p-2 min-w-[160px]">
                  {availableToAdd.map(opt => (
                    <button
                      key={opt.name}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-cyan-50 flex items-center gap-2 rounded min-w-[140px]"
                      onClick={() => { addActivity(opt.name); setActivitiesDropdownOpen(false); }}
                    >
                      <img src={opt.icon} alt={opt.name} className="w-4 h-4" /> <span className="truncate">{opt.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div className={`self-stretch flex-1 rounded-lg outline outline-1 outline-offset-[-1px] ${error ? "outline-red-500" : "outline-[#CFD6DE]"} flex flex-col justify-start items-start gap-2.5 bg-white focus-within:outline-2 focus-within:outline-cyan-700 cursor-text`} onClick={() => inputRef.current?.focus()}>
        <div className="self-stretch flex-1 pr-4 py-1 rounded-tl rounded-tr inline-flex justify-start items-start gap-1">
          <div className="w-12 h-12 inline-flex flex-col justify-center items-center gap-2.5">
            <div className="rounded-[100px] inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <div className="p-2 flex justify-center items-center gap-2.5">
                <img src="/search-icon.svg" alt="search" className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="flex-1 h-12 py-1 relative inline-flex flex-col justify-center items-start">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); onChange(""); setDropdownOpen(true); setHighlighted(-1); }}
              onFocus={() => setDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              className="flex-1 justify-center text-[#272F3A] text-base font-normal font-['Roboto'] leading-tight bg-transparent border-none focus:ring-0 p-0 m-0 outline-none"
              placeholder="Search affiliation name"
              id="affiliation"
              autoComplete="off"
              disabled={disabled}
              aria-autocomplete="list"
              aria-controls="affiliation-listbox"
              aria-activedescendant={highlighted >= 0 ? `affiliation-option-${highlighted}` : undefined}
            />
            <div className="px-1 left-[-36px] top-[-10px] absolute bg-[#FFF] inline-flex justify-start items-center pointer-events-none select-none">
              <label htmlFor="affiliation" className="justify-start text-[#272F3A] text-xs font-normal font-['Roboto'] leading-none">{label}</label>
            </div>
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
          </div>
        </div>
      </div>
      {dropdownOpen && (filtered.length > 0 || showCreateOption) && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-xl border border-[#DFE3E9] max-h-64 overflow-y-auto" id="affiliation-listbox" role="listbox">
          {filtered.map((a, i) => (
            <div
              key={a.name}
              id={`affiliation-option-${i}`}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-cyan-50 ${highlighted === i ? "bg-cyan-100" : ""}`}
              onMouseDown={() => select(a.name)}
              onMouseEnter={() => setHighlighted(i)}
              role="option"
              aria-selected={highlighted === i}
            >
              <div className={`w-10 h-10 ${a.color} rounded flex items-center justify-center text-white font-semibold text-base`}>{a.initials}</div>
              <div className="flex-1 flex flex-col">
                <span className="text-base font-normal text-[#272F3A]">{a.name}</span>
                <span className="text-sm text-[#617692]">{a.address}</span>
              </div>
            </div>
          ))}
          {showCreateOption && (
            <div
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-cyan-50 ${highlighted === filtered.length ? "bg-cyan-100" : ""}`}
              onMouseDown={() => select(inputValue.trim())}
              onMouseEnter={() => setHighlighted(filtered.length)}
              role="option"
              aria-selected={highlighted === filtered.length}
            >
              <div className="w-10 h-10 bg-zinc-300 rounded flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 5v10M5 10h10" stroke="#272F3A" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-base font-normal text-[#272F3A]">Create New Affiliation</span>
                <span className="text-sm text-[#617692]">“{inputValue.trim()}”</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliationAutocomplete;
