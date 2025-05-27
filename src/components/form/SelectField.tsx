"use client";
import React from "react";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, error, value, id, ...props }) => (
  <div className="relative w-full flex flex-col">
    <div className={`self-stretch flex-1 rounded-lg outline outline-1 outline-offset-[-1px] ${error ? 'outline-red-500' : 'outline-[#CFD6DE]'} flex flex-col justify-start items-start gap-2.5 bg-white`}>
      <div className="self-stretch flex-1 pl-4 py-1 rounded-tl rounded-tr inline-flex justify-start items-start gap-1">
        <div className="flex-1 h-12 py-1 relative inline-flex flex-col justify-center items-start">
          <select
            id={id}
            value={value}
            {...props}
            className="flex-1 h-full w-full pl-0 bg-transparent border-none text-[#272F3A] text-base font-normal font-['Roboto'] leading-tight focus:ring-0 p-0 m-0 outline-none cursor-pointer appearance-none"
          >
            <option value="" disabled className="text-gray-400">Select {label}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Custom arrow icon */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#272F3A]">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="px-1 left-[-4px] top-[-10px] absolute bg-[#FFF] inline-flex justify-start items-center">
            <label htmlFor={id} className="justify-start text-[#272F3A] text-xs font-normal font-['Roboto'] leading-none">{label}</label>
          </div>
        </div>
      </div>
    </div>
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

export default SelectField;
