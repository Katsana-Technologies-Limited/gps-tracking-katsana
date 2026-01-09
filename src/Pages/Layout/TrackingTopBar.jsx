/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Archive, CarFront, Headset, Menu } from "lucide-react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

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

const TrackingTopBar = ({ onMenuClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (
        showProfile &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showProfile]);
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
    <div className="bg-white rounded-xl px-2 sm:px-4 shadow-[0_2px_8px_0_rgba(16,30,54,0.08)] py-1.5 mb-4 w-full lg:w-2/3 ml-auto flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="lg:hidden mr-2 p-2 rounded-md hover:bg-orange-50 text-orange-500 focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <Menu size={26} />
        </button>
        <div className="hidden md:flex items-center gap-2">
          <button className="flex cursor-pointer items-center gap-2 text-gray-600 border border-gray-200 py-1.5 px-3 rounded-lg bg-white transition text-sm font-medium mr-2">
            <CarFront size={19} className="text-orange-500" />
            Assign Vehicle
          </button>
          <button className="flex cursor-pointer items-center gap-2 text-gray-600 border border-gray-200 py-1.5 px-3 rounded-lg bg-white transition text-sm font-medium">
            <Archive size={19} className="text-orange-500" />
            My Favorites
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center mx-2">
        <div className="relative w-full max-w-xs hidden sm:block">
          <input
            type="search"
            placeholder="Search Here"
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-orange-400 text-sm"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <IconSearch />
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button className="rounded-full cursor-pointer hover:bg-orange-50 text-orange-500 p-1.5 transition">
          <IconBell />
        </button>
        <button className="rounded-full cursor-pointer hover:bg-orange-50 text-orange-500 p-1.5 transition">
          <Headset />
        </button>
        <div className="ml-1 relative" ref={profileRef}>
          <img
            src="/sddefault.jpg"
            alt="User Avatar"
            className="w-8 h-8 cursor-pointer rounded-full border border-slate-200 shadow-sm"
            onClick={() => setShowProfile((v) => !v)}
          />
          {showProfile && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <Link
                to="/dashboard/profile"
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-orange-50 text-gray-700 font-medium"
                onClick={() => setShowProfile(false)}
              >
                <User size={18} className="text-orange-500" />
                Profile
              </Link>
              <div className="border-t border-gray-200">
                <LogoutButton collapsed={false} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingTopBar;
