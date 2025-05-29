import React from "react";

interface StartTourModalProps {
  open: boolean;
  onClose: () => void;
  onGetStarted: () => void;
  onTakeTour: () => void;
  userName: string;
}

// Exact structure, text, and color classes as per reference JSX and palette
const StartTourModal: React.FC<StartTourModalProps> = ({ open, onClose, onGetStarted, onTakeTour, userName }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-700 opacity-70 mix-blend-multiply" onClick={onClose} aria-label="Close tour modal overlay" tabIndex={-1} />
      {/* Modal Card */}
      <div className="relative w-[676px] bg-white rounded-xl flex flex-col items-center gap-8 overflow-hidden shadow-lg z-10">
        {/* Close button (top right) */}
        <button onClick={onClose} aria-label="Close tour modal" className="absolute right-6 top-6 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-700">
          <span className="sr-only">Close</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="self-stretch p-5 bg-white rounded-xl flex flex-col justify-start items-center gap-12">
          <div className="self-stretch flex flex-col justify-center items-center gap-5">
            <div className="flex flex-col justify-start items-center gap-3">
              <div className="text-center text-neutral-800 text-2xl font-semibold font-['Roboto']">Welcome to AthlosOne, {userName}!</div>
              <div className="w-[482px] text-center text-zinc-500 text-base font-normal font-['Roboto'] leading-tight">Thanks for joining! Take a quick tour to discover all our features.</div>
            </div>
            <div className="inline-flex justify-center items-center gap-3">
              <button onClick={onGetStarted} className="px-7 py-3 bg-cyan-700 hover:bg-cyan-800 rounded-lg flex justify-center items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-700">
                <span className="text-center text-white text-base font-semibold font-['Roboto'] leading-none">Get Started</span>
              </button>
              <button onClick={onTakeTour} className="h-10 rounded-[100px] flex items-center gap-2 pl-3 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-700">
                <img src="/tour-play.svg" alt="Take a Tour" className="w-5 h-5" />
                <span className="text-center text-cyan-700 text-base font-semibold font-['Roboto'] leading-tight">Take a Tour</span>
              </button>
            </div>
          </div>
          <div className="self-stretch p-5 bg-neutral-50 rounded-lg flex justify-between items-center">
            <div className="inline-flex flex-col justify-center items-start gap-1">
              <span className="text-left text-Color-Text-Colors-Primary-Text text-base font-semibold font-['Roboto'] leading-tight">Need help getting started?</span>
            </div>
            <div className="flex justify-start items-center gap-3">
              <a href="mailto:support@athlosone.com" className="h-10 rounded-[100px] flex items-center gap-2 pl-3 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-700">
                <img src="/contact-us.svg" alt="Contact AthlosOne Team" className="w-4 h-4" />
                <span className="text-center text-cyan-700 text-sm font-semibold font-['Roboto'] leading-none whitespace-nowrap">Contact AthlosOne Team</span>
              </a>
              <a href="/help" className="h-10 rounded-[100px] flex items-center gap-2 pl-3 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-700">
                <img src="/help-center.svg" alt="Help Center" className="w-4 h-4" />
                <span className="text-center text-cyan-700 text-sm font-semibold font-['Roboto'] leading-none whitespace-nowrap">Help Center</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartTourModal;
