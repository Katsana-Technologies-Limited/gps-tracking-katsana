import React, { useState, useRef, useEffect } from "react";
import { CiClock2 } from "react-icons/ci";
import { HiMenu } from "react-icons/hi";

const IconSearch = () => (
  <svg
    className="h-5 w-5 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
    />
  </svg>
);

const IconUpload = () => (
  <svg
    className="h-5 w-5 text-slate-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 5v12"
    />
  </svg>
);

const IconMail = () => (
  <svg
    className="h-5 w-5 text-slate-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const IconBell = () => (
  <svg
    className="h-5 w-5 text-slate-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const TrackingTopBar = ({ onMenuClick }) => {
  const [showActions, setShowActions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const actionsRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      const t = e.target;
      if (
        showActions &&
        actionsRef.current &&
        !actionsRef.current.contains(t)
      ) {
        setShowActions(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [showActions]);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  return (
    <div className="bg-white rounded-xl p-2 shadow-sm mb-4 sticky top-2 lg:top-4 z-30">
      <div className="flex items-center gap-2 lg:gap-4 px-2 lg:px-3 2xl:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 cursor-pointer rounded-md hover:bg-slate-100"
          aria-label="Open menu"
        >
          <HiMenu className="h-6 w-6 text-slate-700" />
        </button>

        <div className="flex-1">
          <div className="relative max-w-sm">
            <div className="hidden sm:flex absolute inset-y-0 left-0 pl-3 items-center pointer-events-none">
              <IconSearch />
            </div>
            <input
              type="search"
              placeholder="Search"
              className="hidden sm:block w-full pl-10 pr-4 py-0.75 border border-slate-100 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-yellow-500"
            />
            <div
              className={`sm:hidden flex items-center transition-all duration-500 ease-out ${
                showSearch ? "w-full" : "w-10"
              }`}
            >
              {!showSearch ? (
                <button
                  aria-label="Open search"
                  className="p-2 rounded-md hover:bg-slate-100"
                  onClick={() => {
                    setShowActions(false);
                    setShowSearch(true);
                  }}
                >
                  <IconSearch />
                </button>
              ) : (
                <div className="w-full">
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="Search"
                    className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {/* Desktop icons */}
          <button
            className="hidden sm:block p-2 cursor-pointer rounded-md hover:bg-slate-100"
            aria-label="Upload"
          >
            <IconUpload />
          </button>
          <button
            className="hidden sm:block p-2 cursor-pointer rounded-md hover:bg-slate-100"
            aria-label="Mail"
          >
            <IconMail />
          </button>
          <button
            className="hidden md:block p-2 cursor-pointer rounded-md hover:bg-slate-100"
            aria-label="Clock"
          >
            <CiClock2 className="h-5 w-5" />
          </button>

          {/* Mobile actions: expand icons inline inside topbar and animate */}
          <div className="sm:hidden flex items-center gap-2" ref={actionsRef}>
            {!showActions ? (
              <button
                aria-label="More"
                onClick={() => {
                  setShowSearch(false);
                  setShowActions(true);
                }}
                className="p-2 rounded-md hover:bg-slate-100"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2 transition-all duration-500">
                <button
                  className="p-2 rounded-md hover:bg-slate-100"
                  onClick={() => {
                    // open upload modal (placeholder)
                  }}
                  aria-label="Open upload modal"
                >
                  <IconUpload />
                </button>
                <button
                  className="p-2 rounded-md hover:bg-slate-100"
                  onClick={() => {
                    // open mail modal (placeholder)
                  }}
                  aria-label="Open mail modal"
                >
                  <IconMail />
                </button>
                <button
                  className="p-2 rounded-md hover:bg-slate-100"
                  onClick={() => {
                    // open clock modal (placeholder)
                  }}
                  aria-label="Open clock modal"
                >
                  <CiClock2 className="h-5 w-5" />
                </button>
                <button
                  className="p-2 rounded-md hover:bg-slate-100"
                  onClick={() => {
                    // open notifications modal (placeholder)
                  }}
                  aria-label="Open notifications modal"
                >
                  <IconBell />
                </button>
              </div>
            )}
          </div>

          {/* Bell always visible on sm+ */}
          <button
            className="hidden sm:block p-2 cursor-pointer rounded-md hover:bg-slate-100"
            aria-label="Notifications"
          >
            <IconBell />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingTopBar;
