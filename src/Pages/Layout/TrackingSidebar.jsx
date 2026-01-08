/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { sidebarLinks } from "./SidebarRoutes";
import useCustomer from "../../hooks/useCustomer";

export default function TrackingSidebar({ isOpen, setIsOpen }) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState({});
  const { data } = useCustomer();
  const navRef = useRef(null);

  useEffect(() => {
    sidebarLinks.forEach((link) => {
      if (link.subroutes) {
        if (
          link.subroutes.some((sub) => pathname.startsWith(sub.to)) ||
          pathname === link.to
        ) {
          setExpanded({ [link.to]: true });
        }
      }
    });
  }, [pathname]);

  const handleExpand = (to) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setExpanded((prev) => {
      if (prev[to]) return {};
      return { [to]: true };
    });
  };

  const handleRouteClick = (label) => {
    if (label === "Analytics & Summary") {
      if (!isOpen) setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      sidebarLinks.forEach((link) => {
        if (link.subroutes) {
          if (
            link.subroutes.some((sub) => pathname.startsWith(sub.to)) ||
            pathname === link.to
          ) {
            setExpanded({ [link.to]: true });
          }
        }
      });
    } else {
      setExpanded({});
    }
  };

  return (
    <aside
      className={`fixed lg:left-4 top-0 bottom-0 h-auto bg-white rounded-2xl flex flex-col items-center py-8 pl-2 mr-2 mt-4 mb-4 z-30 font-['Inter','Arial','Helvetica',sans-serif'] transition-all duration-300 ${
        isOpen ? "w-68 2xl:w-72" : "w-20"
      }`}
      style={{
        minWidth: isOpen ? 240 : 80,
        maxWidth: isOpen ? 340 : 80,
      }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10 cursor-pointer"
        aria-label="Toggle Sidebar"
        type="button"
      >
        <Menu size={24} className="text-gray-600" />
      </button>
      <div
        className={`flex flex-col items-center mb-6 w-full transition-all duration-300 ${
          !isOpen && "mt-8"
        }`}
      >
        <img
          src="/logo.png"
          alt="Katsana Logo"
          className={`object-contain mb-4 transition-all duration-300 ${
            isOpen ? "w-28 h-10" : "w-10 h-10"
          }`}
        />
        {isOpen && (
          <div className="text-primary-green font-semibold text-base text-center w-full">
            {data?.company || ""}
          </div>
        )}
      </div>
      <nav
        className="flex flex-col gap-2 w-full overflow-y-auto scrollbar-thin pr-1"
        style={{ maxHeight: "calc(100vh - 220px)", scrollbarGutter: "stable" }}
        ref={navRef}
      >
        {sidebarLinks.map(({ to, label, icon: Icon, subroutes }) => {
          const isActive =
            pathname === to || (to === "/dashboard" && pathname === "/");

          if (subroutes) {
            const isExpanded = expanded[to] && isOpen;
            const isSubActive = subroutes.some((sub) =>
              pathname.startsWith(sub.to)
            );

            return (
              <div key={to} className="w-full">
                <button
                  type="button"
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium text-[15px] w-full cursor-pointer ${
                    isSubActive || isExpanded
                      ? "bg-[#fff7e6] text-[#222] shadow-sm"
                      : "text-primary-green hover:bg-[#f5f6fa]"
                  } ${!isOpen && "justify-center px-2"}`}
                  style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
                  onClick={() => handleExpand(to)}
                  aria-expanded={isExpanded}
                  title={!isOpen ? label : ""}
                >
                  <Icon
                    size={20}
                    className={
                      isSubActive ? "text-[#fe8e1c]" : "text-[#fe8e1c]"
                    }
                  />
                  {isOpen && (
                    <>
                      <span className="truncate font-semibold">{label}</span>
                      <span className="ml-auto">
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </span>
                    </>
                  )}
                </button>

                {isOpen && (
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: isExpanded ? subroutes.length * 38 + 16 : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <ul className="pl-10 py-2 flex flex-col gap-1">
                      {subroutes.map((sub) => {
                        const isSubRouteActive = pathname.startsWith(sub.to);
                        return (
                          <li key={sub.to} className="flex items-center">
                            <span
                              className="text-[#fe8e1c] text-lg mr-2"
                              style={{ lineHeight: "1" }}
                            >
                              &#8226;
                            </span>
                            <Link
                              to={sub.to}
                              onClick={() => handleRouteClick(label)}
                              className={`block px-0 py-1.5 rounded-md text-[15px] transition font-medium cursor-pointer ${
                                isSubRouteActive
                                  ? "text-[#fe8e1c] font-bold bg-transparent"
                                  : "text-gray-700 hover:text-[#fe8e1c]"
                              }`}
                              style={{ minWidth: 0 }}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={to}
              to={to}
              onClick={() => handleRouteClick(label)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium text-[15px] cursor-pointer ${
                isActive
                  ? "bg-[#fe8e1c] text-white shadow-sm"
                  : "text-primary-green hover:bg-[#f5f6fa]"
              } ${!isOpen && "justify-center px-2"}`}
              style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
              title={!isOpen ? label : ""}
            >
              <Icon
                size={20}
                className={isActive ? "text-white" : "text-[#fe8e1c]"}
              />
              {isOpen && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
      <LogoutButton />
    </aside>
  );
}
