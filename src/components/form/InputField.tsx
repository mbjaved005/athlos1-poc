"use client";
import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, error, id, className = "", ...props }) => (
  <div className="relative w-full">
    <label htmlFor={id} className="absolute left-4 -top-[5px] text-[13px] font-normal text-Content-Secondary bg-Color-Modes-White px-1 z-10 leading-none">
      {label}
    </label>
    <input
      id={id}
      className={`w-full h-14 pt-4.5 px-4 text-base font-normal text-Content-Default bg-Color-Modes-White rounded-lg border border-gray-300 focus:border-cyan-700 focus:ring-0 placeholder-Content-Tertiary ${error ? 'border-red-500' : ''} ${className ?? ''}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-1 absolute left-4 bottom-[-20px]">{error}</span>}
  </div>
);

export default InputField;
