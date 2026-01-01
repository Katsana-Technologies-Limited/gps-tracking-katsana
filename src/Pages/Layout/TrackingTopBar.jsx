import { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa6";
import { HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";
import { RiArrowDownSLine } from "react-icons/ri";

const TrackingTopBar = ({ onMenuClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  return (
    <div className="rounded-t-sm md:rounded-t-xl rounded-b-xl p-1.5 mb-2 sticky top-3 lg:top-4 z-30 transform-gpu bg-linear-to-b from-[#0B2B4C]/90 to-[#081C34]/95  backdrop-blur-xl border border-white/10 shadow-[0_2px_19px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-3 md:gap-6 px-2 md:px-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1 cursor-pointer rounded-md hover:bg-white/6 transition"
          aria-label="Open menu"
        >
          <HiMenu className="h-4 w-4 text-white/90" />
        </button>
        <div className="flex-1 flex items-center h-full">
          <div className="relative max-w-lg w-full">
            <div className={`hidden sm:block`}>
              <div className="relative flex items-center h-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-white/60"
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
                </div>
                <input
                  type="search"
                  placeholder="Search"
                  className={`w-full pl-10 pr-4 py-1.5 rounded-lg bg-white/6 text-white/95 placeholder-white/60 border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400/40`}
                  style={{ backdropFilter: "blur(2px)" }}
                />
              </div>
            </div>

            {/* Mobile search toggle */}
            <div
              className={`sm:hidden flex items-center transition-all duration-300 ease-out ${
                showSearch ? "w-full" : "w-10"
              }`}
            >
              {!showSearch ? (
                <button
                  aria-label="Open search"
                  className="p-2 rounded-md hover:bg-white/6 transition"
                  onClick={() => setShowSearch(true)}
                >
                  <svg
                    className="h-5 w-5 text-white/80"
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
                </button>
              ) : (
                <div className="w-full flex items-center h-full">
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="Search"
                    className="w-full pl-3 pr-3 py-1 rounded-lg bg-white/8 text-white placeholder-white/60 border border-white/6 focus:outline-none focus:ring-2 focus:ring-orange-300/30"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <button
            aria-label="Notifications"
            className="p-2 rounded-md cursor-pointer hover:bg-white/6 transition text-orange-400"
          >
            <FaBell className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="flex items-center gap-3 px-3 py-1 rounded-lg md:bg-white/4 hover:bg-white/5 transition cursor-pointer border border-transparent"
              aria-haspopup="true"
              aria-expanded={showProfile}
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white"
                style={{
                  background: "linear-gradient(135deg,#4d9dff,#ff7d3b)",
                  boxShadow: "0 6px 18px rgba(77,157,255,0.12)",
                }}
              >
                {"initials"}
              </span>
              <span className="text-white/95 text-sm font-semibold hidden sm:inline">
                {"dealer?.company"}
              </span>
              <span className="text-white/70 text-xs hidden md:inline">
                <RiArrowDownSLine />
              </span>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-1 md:mt-2  w-72 rounded-2xl overflow-hidden z-50  bg-linear-to-b from-[#0B2B4C]/97 to-[#081C34]/98  backdrop-blur-xl  border border-white/10  shadow-[0_20px_20px_rgba(0,0,0,0.4)]">
                {/* Header */}
                <div className="p-4 border-b border-white/6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg,#4d9dff,#ff7d3b)",
                        boxShadow: "0 6px 18px rgba(77,157,255,0.12)",
                      }}
                    >
                      {"initials"}
                    </div>
                    <div className="min-w-0 max-w-45 sm:max-w-50">
                      <div
                        className="text-white font-bold truncate"
                        title={"dealer?.company"}
                      >
                        {"dealer?.company"}
                      </div>
                      <div
                        className="text-sm text-white/70 truncate"
                        title={"dealer?.email"}
                      >
                        {"dealer?.email"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <Link
                    to="/dashboard/profile"
                    className="text-left px-3 cursor-pointer py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="text-left px-3 cursor-pointer py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition"
                  >
                    Settings
                  </Link>
                  <button className="text-left px-3 py-2 cursor-pointer rounded-lg font-semibold text-orange-400 hover:bg-white/10 transition disabled:opacity-60">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingTopBar;
