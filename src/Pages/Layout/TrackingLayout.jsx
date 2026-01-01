import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
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
    <div className="flex px-2 lg:px-5 bg-primary-gray">
      <div className="hidden lg:block w-52 2xl:w-60" aria-hidden />
      <div className="hidden lg:block">
        <AdminSidebar onClose={() => {}} />
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
            className={`fixed top-0 left-0 h-full w-60 bg-white z-50 lg:hidden shadow-xl transform transition-transform duration-300 ease-in-out ${
              isAnimating ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <AdminSidebar onClose={handleClose} />
          </div>
        </>
      )}
      <main className="flex-1 min-w-0 px-0 lg:px-3">
        <div className="sticky top-0 h-3 lg:h-5 w-full z-20 bg-primary-gray" />
        <AdminTopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="px-2 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
