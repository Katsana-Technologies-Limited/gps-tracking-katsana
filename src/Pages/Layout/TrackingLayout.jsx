import React, { useState, useEffect } from "react";
import TrackingSidebar from "./TrackingSidebar";
import TrackingTopBar from "./TrackingTopBar";
import { Outlet, useLocation } from "react-router-dom";
import VehicleStatusDrawer from "../../components/common/VehicleStatusDrawer";

export default function TrackingLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const HIDE_DRAWER_PATHS = [
    "/dashboard/profile",
    "/dashboard/payment",
    "/dashboard/support",
  ];

  useEffect(() => {
    let t;
    if (isMobileMenuOpen) {
      t = setTimeout(() => setIsAnimating(true), 0);
    } else {
      t = setTimeout(() => setIsAnimating(false), 0);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isMobileMenuOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 300);
  };

  const hideDrawer = HIDE_DRAWER_PATHS.some((p) =>
    location.pathname.startsWith(p),
  );

  return (
    <div className="min-h-screen flex px-2 lg:px-5 bg-primary-gray mb-8">
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isSidebarOpen ? "w-68 2xl:w-72" : "w-20"
        }`}
        aria-hidden
        style={{ minWidth: isSidebarOpen ? 272 : 80 }}
      />
      <div className="hidden lg:block">
        <TrackingSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>
      {isMobileMenuOpen && (
        <>
          <div
            className={`fixed inset-0 lg:hidden transition-opacity duration-300 ease-in-out ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xs" />
          </div>
          <div className="fixed inset-0 z-50 lg:hidden pointer-events-auto">
            <div
              className={`transform transition-transform duration-300 ease-in-out ${
                isAnimating ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="mx-[3vw] w-[94vw]">
                <TrackingSidebar
                  mobile
                  isOpen={true}
                  setIsOpen={() => {}}
                  onRouteSelected={handleClose}
                />
              </div>
            </div>
          </div>
        </>
      )}
      <main
        className={`flex-1 min-w-0 px-0 lg:px-3 transition-all duration-300 ${
          !isSidebarOpen ? "" : ""
        }`}
      >
        <div className="sticky top-0 h-2 lg:h-3 w-full z-20 bg-primary-gray" />
        <TrackingTopBar onMenuClick={() => setIsMobileMenuOpen((s) => !s)} />

        <div className="p-1 min-h-screen">
          {!hideDrawer && <VehicleStatusDrawer />}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
