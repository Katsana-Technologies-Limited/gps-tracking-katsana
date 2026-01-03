/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Car, BookMarked } from "lucide-react";

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
    className="h-5 w-5 text-orange-500"
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

const TrackingTopBar = () => {
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
    <div className="bg-white rounded-xl p-2 shadow-sm mb-4 sticky top-2 lg:top-4 w-2/3 ml-auto">
      <div className="flex items-center gap-2 px-4 py-1">
        <button className="flex items-center gap-1 text-orange-500 border border-orange-200 rounded-md px-3 text-sm font-medium hover:bg-orange-100">
          <Car size={18} className="text-orange-500" />
          Assign Vehicle
        </button>
        <button className="flex items-center gap-1 text-orange-500 border border-orange-200 rounded-md px-3 text-sm font-medium hover:bg-orange-100">
          <BookMarked size={18} className="text-orange-500" />
          My Favorites
        </button>
        {/* Search Input */}
        <div className="flex-1 flex items-center mx-2">
          <div className="relative w-full max-w-xs">
            <input
              type="search"
              placeholder="Search Here"
              className="w-full pl-9 pr-3 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-orange-400 text-sm"
            />
            <span className="absolute left-2 top-1.5 text-slate-400">
              <IconSearch />
            </span>
          </div>
        </div>
        {/* Bell Icon */}
        <button className="rounded-full hover:bg-orange-50 text-orange-500">
          <IconBell />
        </button>
        {/* Mic Icon */}
        <button className="rounded-full hover:bg-orange-50 text-orange-500">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18v2m0 0a4 4 0 01-4-4h8a4 4 0 01-4 4zm0-2V6a4 4 0 018 0v6a4 4 0 01-8 0z"
            />
          </svg>
        </button>
        {/* Avatar */}
        <div className="ml-2">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-slate-200 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default TrackingTopBar;
