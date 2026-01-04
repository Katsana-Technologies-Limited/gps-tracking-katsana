import React, { useState, useEffect } from "react";
import TrackingSidebar from "./TrackingSidebar";
import TrackingTopBar from "./TrackingTopBar";
import { Outlet } from "react-router-dom";

export default function TrackingLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <div className="min-h-screen flex px-2 lg:px-5 bg-primary-gray mb-8">
      <div className="hidden lg:block w-68 2xl:w-80" aria-hidden />
      <div className="hidden lg:block">
        <TrackingSidebar onClose={() => {}} />
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
          <div
            className={`fixed top-0 left-0 h-full w-68 bg-white z-50 lg:hidden shadow-xl transform transition-transform duration-300 ease-in-out ${
              isAnimating ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <TrackingSidebar onClose={handleClose} />
          </div>
        </>
      )}
      <main className="flex-1 min-w-0 px-0 lg:px-3">
        <div className="sticky top-0 h-2 lg:h-3 w-full z-20 bg-primary-gray" />
        <TrackingTopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="2xl:px-3 py-1 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
