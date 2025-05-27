"use client";
import React, { useState } from "react";

interface AffiliationSearchFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  error?: string;
}

const AffiliationSearchField: React.FC<AffiliationSearchFieldProps> = ({ label, value, onChange, suggestions = [], error }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = value ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())) : suggestions;

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <label className="text-xs text-Content-Secondary font-['Roboto'] leading-none mb-1">{label}</label>
      <input
        className={`h-12 px-4 rounded-lg border outline-none border-Border-Default text-base font-normal font-['Roboto'] leading-tight bg-Color-Modes-White focus:border-cyan-700 ${error ? 'border-red-400' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        placeholder={`Search ${label.toLowerCase()}`}
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute top-14 left-0 w-full bg-white border border-Border-Default rounded-lg shadow z-10 max-h-40 overflow-y-auto">
          {filtered.map((s, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:bg-cyan-50 cursor-pointer"
              onMouseDown={() => onChange(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default AffiliationSearchField;
