/* eslint-disable no-unused-vars */
import { Archive, CarFront, Headphones } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

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

const IconBell = () => (
  <svg
    className="h-7 w-7 text-orange-500"
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
    <div className="bg-white rounded-xl p-2.5 shadow-sm mb-4 sticky top-2 lg:top-4 w-2/3 ml-auto">
      <div className="flex items-center gap-2 px-4">
        <button className="flex items-center gap-2 text-gray-500 border py-1 border-gray-200 rounded-md px-3 text-sm font-medium hover:bg-orange-100">
          <CarFront size={18} className="text-orange-500" />
          Assign Vehicle
        </button>
        <button className="flex items-center gap-2 text-gray-500 border py-1 border-gray-200 rounded-md px-3 text-sm font-medium hover:bg-orange-100">
          <Archive size={18} className="text-orange-500" />
          My Favorites
        </button>
        <div className="flex-1 flex items-center mx-2">
          <div className="relative w-full max-w-xs">
            <input
              type="search"
              placeholder="Search Here"
              className="w-full pl-9 pr-3 py-1 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-orange-400 text-sm"
            />
            <span className="absolute left-2 top-1.5 text-slate-400">
              <IconSearch />
            </span>
          </div>
        </div>
        <button className="rounded-full hover:bg-orange-50 text-orange-500">
          <IconBell size={20} />
        </button>
        <button className="rounded-full hover:bg-orange-50 text-orange-500">
          <Headphones size={22} className="text-orange-500" />
        </button>
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
