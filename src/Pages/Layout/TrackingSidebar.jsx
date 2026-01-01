import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  ChevronRight,
  Database,
  FileText,
  Wallet,
  Home,
  Repeat,
  ShoppingCart,
  Smartphone,
  Users,
  Handshake,
} from "lucide-react";
import { MdOutlineSimCard } from "react-icons/md";

const links = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/clients", label: "Customers", icon: Users },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: Repeat },
  { to: "/admin/sales", label: "Sales", icon: ShoppingCart },
  { to: "/admin/packages", label: "Packages", icon: Box },
  { to: "/admin/inventory", label: "Inventory", icon: Database },
  { to: "/admin/dealers", label: "Dealers", icon: Handshake },
];

const inventorySublinks = [
  { to: "/admin/inventory/device", label: "Device", icon: Smartphone },
  {
    to: "/admin/inventory/sim-cards",
    label: "SIM Cards",
    icon: MdOutlineSimCard,
  },
];

const salesSublinks = [
  { to: "/admin/invoices", label: "Invoice", icon: FileText },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
];

const SmoothSubMenu = ({ isOpen, children }) => {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(isOpen ? "fit-content" : "0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{ maxHeight }}
      className="overflow-hidden transition-all duration-300 ease-in-out"
    >
      {children}
    </div>
  );
};

export default function TrackingSidebar({ onClose }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Track user toggles separately from automatic opening
  const [userToggle, setUserToggle] = useState({
    inventory: false,
    sales: false,
  });

  // Calculate derived state without effects
  const isInventorySublink = inventorySublinks.some((s) => s.to === pathname);
  const isSalesSublink = salesSublinks.some((s) => s.to === pathname);
  const isInInventorySection = pathname.startsWith("/admin/inventory");
  const isInSalesSection =
    pathname.startsWith("/admin/sales") ||
    pathname === "/admin/invoices" ||
    pathname === "/admin/payments";

  // Determine if submenus should be open
  const inventoryOpen =
    userToggle.inventory || isInventorySublink || isInInventorySection;
  const salesOpen = userToggle.sales || isSalesSublink || isInSalesSection;

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const handleSubmenuToggle = (menu) => {
    setUserToggle((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const linkClasses =
    "px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition";

  return (
    <aside className="w-full h-full lg:w-52 2xl:w-60 bg-white p-3 rounded-xl lg:shadow-sm flex flex-col lg:fixed lg:top-5 lg:left-5 lg:h-[calc(100vh-2.5rem)]">
      <div className="text-primary font-bold mb-6">
        <Link to="/admin" onClick={handleLinkClick}>
          <div className="relative w-24 2xl:w-31.25 h-8 2xl:h-10">
            <img
              src="/katsana-logo.png"
              alt="logo"
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto flex flex-col gap-2">
        {links.map((link) => {
          const { to, label, icon: Icon } = link;

          if (to === "/admin/inventory") {
            const parentActive = pathname.startsWith("/admin/inventory");

            return (
              <div key={to}>
                <div
                  className={`group flex items-center justify-between ${linkClasses} cursor-pointer
                    ${
                      parentActive
                        ? "text-black border-l-4 border-primary-yellow"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  onClick={() => handleSubmenuToggle("inventory")}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      size={18}
                      className={
                        parentActive
                          ? "text-black"
                          : "text-slate-600 group-hover:text-black"
                      }
                    />
                    <span>{label}</span>
                  </div>

                  <div
                    className={`transition-transform duration-200 p-1 rounded-md hover:bg-slate-200
                      ${inventoryOpen ? "rotate-90" : ""}`}
                  >
                    <ChevronRight size={16} />
                  </div>
                </div>

                <SmoothSubMenu isOpen={inventoryOpen}>
                  <div className="pl-4 border-l-2 border-slate-200 ml-1 mt-1 flex flex-col gap-1">
                    {inventorySublinks.map((s) => {
                      const sActive = pathname === s.to;
                      const SIcon = s.icon;

                      return (
                        <Link
                          key={s.to}
                          to={s.to}
                          onClick={handleLinkClick}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
                            ${
                              sActive
                                ? "bg-primary-yellow text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                          <SIcon
                            size={16}
                            className={
                              sActive ? "text-white" : "text-slate-500"
                            }
                          />
                          {s.label}
                        </Link>
                      );
                    })}
                  </div>
                </SmoothSubMenu>
              </div>
            );
          }

          if (to === "/admin/sales") {
            const parentActive = isInSalesSection;

            return (
              <div key={to}>
                <div
                  className={`group flex items-center justify-between ${linkClasses} cursor-pointer
                    ${
                      parentActive
                        ? "text-black border-l-4 border-primary-yellow"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  onClick={() => handleSubmenuToggle("sales")}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      size={18}
                      className={
                        parentActive
                          ? "text-black"
                          : "text-slate-600 group-hover:text-black"
                      }
                    />
                    <span>{label}</span>
                  </div>
                  <div
                    className={`transition-transform duration-200 p-1 rounded-md hover:bg-slate-200
                      ${salesOpen ? "rotate-90" : ""}`}
                  >
                    <ChevronRight size={16} />
                  </div>
                </div>

                <SmoothSubMenu isOpen={salesOpen}>
                  <div className="pl-4 border-l-2 border-slate-200 ml-1 mt-1 flex flex-col gap-1">
                    {salesSublinks.map((s) => {
                      const sActive = pathname === s.to;
                      const SIcon = s.icon;

                      return (
                        <Link
                          key={s.to}
                          to={s.to}
                          onClick={handleLinkClick}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
                            ${
                              sActive
                                ? "bg-primary-yellow text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                          <SIcon
                            size={16}
                            className={
                              sActive ? "text-white" : "text-slate-500"
                            }
                          />
                          {s.label}
                        </Link>
                      );
                    })}
                  </div>
                </SmoothSubMenu>
              </div>
            );
          }

          // Simplified active state detection
          const isActive =
            pathname === to ||
            (to === "/admin/clients" &&
              pathname.startsWith("/admin/clients")) ||
            (to === "/admin/dealers" &&
              pathname.startsWith("/admin/dealers")) ||
            (to === "/admin/subscriptions" &&
              pathname.startsWith("/admin/subscriptions")) ||
            (to === "/admin/packages" &&
              pathname.startsWith("/admin/packages"));

          return (
            <Link
              key={to}
              to={to}
              onClick={handleLinkClick}
              className={`${linkClasses} ${
                isActive
                  ? "bg-primary-yellow text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-slate-600"}
              />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 -mx-2 -mb-2">
        {/* <ProfileMenu /> */}
      </div>
    </aside>
  );
}
