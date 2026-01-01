import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BsFillGrid3X3GapFill,
  BsPeople,
  BsCreditCard2Front,
  BsBox,
  BsWallet2,
  BsPercent,
} from "react-icons/bs";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const TrackingSidebar = ({ onClose }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (key) => setOpenMenu((cur) => (cur === key ? "" : key));

  const menuItems = [
    {
      label: "Dashboard",
      icon: BsFillGrid3X3GapFill,
      path: "/dashboard",
      exact: true,
    },
    { label: "Customers", icon: BsPeople, path: "/dashboard/clients" },
    {
      label: "Subscriptions",
      icon: BsCreditCard2Front,
      path: "/dashboard/subscriptions",
    },
    {
      label: "Sales",
      icon: BsPercent,
      children: [
        { label: "Invoices", path: "/dashboard/sales/invoices" },
        { label: "Payments", path: "/dashboard/sales/payments" },
      ],
    },
    {
      label: "Inventory",
      icon: BsBox,
      children: [
        { label: "Devices", path: "/dashboard/inventory/devices" },
        { label: "SIM Cards", path: "/dashboard/inventory/sim-cards" },
      ],
    },
    {
      label: "Disbursements",
      icon: BsWallet2,
      path: "/dashboard/disbursements",
    },
  ];

  return (
    <aside
      className="w-full lg:w-64 h-full lg:h-[calc(100vh-1.5rem)]
      lg:fixed lg:top-4 lg:left-4 md:rounded-2xl
      bg-linear-to-b from-[#0B2B4C]/90 to-[#081C34]/95
      backdrop-blur-xl border border-white/10
      shadow-[0_20px_20px_rgba(0,0,0,0.4)]
      p-4 flex flex-col"
    >
      <div className="mb-6 h-12 flex items-center justify-center rounded-xl bg-white/90 shadow">
        <NavLink to="/dashboard">
          <img src="/katsana-logo.png" className="h-8 object-contain" />
        </NavLink>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin scrollbar-thumb-white/20">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isOpen = openMenu === item.label;

          // Parent active logic
          const isParentActive = item.exact
            ? location.pathname === item.path
            : item.path
            ? location.pathname.startsWith(item.path)
            : item.children?.some((c) => location.pathname.startsWith(c.path));

          return (
            <div key={item.label}>
              {/* PARENT WITHOUT CHILD */}
              {!item.children && (
                <NavLink
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl
                     text-sm font-medium transition
                     ${
                       isActive
                         ? "bg-orange-500 text-white"
                         : "text-white/90 hover:bg-white/10"
                     }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`text-lg ${
                          isActive ? "text-white" : "text-orange-400"
                        }`}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              )}
              {item.children && (
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-2.5
                    rounded-xl text-sm font-medium transition
                    ${
                      ["Sales", "Inventory", "Investory"].includes(item.label)
                        ? isParentActive
                          ? "text-orange-400 border-l-4 border-yellow-400 bg-transparent"
                          : "text-white/90 hover:bg-white/10 border-l-4 border-transparent"
                        : isParentActive
                        ? "bg-orange-500 text-white"
                        : "text-white/90 hover:bg-white/10"
                    }
                    ${
                      ["Sales", "Inventory", "Investory"].includes(item.label)
                        ? "cursor-pointer"
                        : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`text-lg ${
                        isParentActive ? "text-white" : "text-orange-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <IoIosArrowDropdownCircle
                    className={`text-orange-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {/* CHILDREN */}
              {item.children && (
                <div
                  className={`ml-4 mt-1 pl-3 border-l border-white/20
                    overflow-hidden transition-all duration-300
                    ${isOpen ? "max-h-96" : "max-h-0"}`}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.label}
                      to={child.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm transition
                           ${
                             isActive
                               ? "bg-orange-500 text-white"
                               : "text-white/70 hover:bg-white/10"
                           } cursor-pointer`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default TrackingSidebar;
