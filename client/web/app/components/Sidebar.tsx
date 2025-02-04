import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Settings,
  FilePlus,
  Lock,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const getLinkStyles = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center ${isOpen ? "px-4" : "justify-center px-2"} py-4
    ${isActive ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-purple-50"}
    transition-colors duration-200`;
  };

  const getIconStyles = ({ isActive }: { isActive: boolean }) => {
    return `flex-shrink-0 ${isActive ? "text-purple-700" : "text-purple-600"}`;
  };

  const navItems = [
    { path: "/update-profile", icon: <User className="h-6 w-6" />, label: "Profile" },
    { path: "/", icon: <ShieldCheck className="h-6 w-6" />, label: "My Vault" },
    { path: "/settings", icon: <Settings className="h-6 w-6" />, label: "Settings" },
    { path: "/import-passwords", icon: <Lock className="h-6 w-6" />, label: "Passwords" },
    // { path: "/new", icon: <FilePlus className="h-6 w-6" />, label: "New Entry" },
  ];

  return (
    <div className="relative">
      {/* Mobile Sidebar Toggle */}
      <button
        className="absolute top-4 left-4 lg:hidden p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-purple-800" />
        ) : (
          <Menu className="h-6 w-6 text-purple-800" />
        )}
      </button>

      {/* Expand/Collapse Button */}
      <button
        className="absolute top-1/2 -right-4 transform -translate-y-1/2
        p-2 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700
        transition-all duration-200 z-50 hidden lg:flex items-center
        justify-center group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-white" />
        ) : (
          <ChevronRight className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <nav className={`pt-15 ${
        isOpen ? "w-48" : "w-20"
      } h-full transition-all duration-300 ease-in-out bg-white shadow-lg`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={getLinkStyles}
          >
            <div className={getIconStyles}>
              {item.icon}
            </div>
            {isOpen && (
              <span className="ml-3 text-sm font-medium">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;