import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TrackingSidebar from "./TrackingSidebar";
import TrackingTopBar from "./TrackingTopBar";

const TrackingLayout = () => {
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
    <div className="flex px-1 bg-[#f1f4f8] min-h-screen">
      <div className="hidden lg:block w-64 2xl:w-68" aria-hidden />
      <div className="hidden lg:block">
        <TrackingSidebar onClose={() => {}} />
      </div>
      {isMobileMenuOpen && (
        <>
          <div
            className={`fixed inset-0 lg:hidden transition-opacity duration-300 ease-in-out z-40 ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          >
            <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" />
          </div>
          <div
            className={`fixed top-0 left-0 h-full w-10/12 md:w-68 bg-white z-50 lg:hidden shadow-xl transform transition-transform duration-300 ease-in-out ${
              isAnimating ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <TrackingSidebar onClose={handleClose} />
          </div>
        </>
      )}
      <main className="flex-1 min-w-0 px-0 lg:px-3">
        <div className="sticky top-0 h-3 lg:h-4 w-full z-20 bg-primary-gray" />
        <TrackingTopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="md:p-1.5 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TrackingLayout;
