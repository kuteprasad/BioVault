import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchProfile, logout } from "../redux/authSlice";
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
  Loader,
  LogOut,
  Crown,
} from "lucide-react";

const ProfileSection: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { userData, loading } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("Fetching profile...");
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    console.log("Current userData:", userData);
    console.log("Loading state:", loading);
  }, [userData, loading]);

  return (
    <div className={`mb-6 ${isOpen ? "px-4" : "px-2"}`}>
      <NavLink 
        to="/profile"
        className={({ isActive }) => `
          block transition-colors duration-200
          ${isActive ? 'bg-purple-50' : 'hover:bg-purple-50'}
          rounded-lg p-2
        `}
      >
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            {loading ? (
              <Loader className="h-6 w-6 text-purple-600 animate-spin" />
            ) : (
              <User className="h-6 w-6 text-purple-600" />
            )}
          </div>
        </div>
        {isOpen && userData && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userData.fullName || 'No Name'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userData.email || 'No Email'}
            </p>
          </div>
        )}
      </NavLink>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    { path: "/", icon: <ShieldCheck className="h-6 w-6" />, label: "My Vault" },
    { path: "/settings", icon: <Settings className="h-6 w-6" />, label: "Settings" },
    { path: "/import-passwords", icon: <Lock className="h-6 w-6" />, label: "Import Passwords" },
    { path: "/match-biometrics", icon: <FilePlus className="h-6 w-6" />, label: "Match Biometrics" },
    { path: "/subscription", icon: <Crown className="h-6 w-6" />, label: "Subscription" },
  ];

  const getLinkStyles = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center ${isOpen ? "px-4" : "justify-center px-2"} py-4
    ${isActive ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-purple-50"}
    transition-colors duration-200`;
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Perform logout logic here
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      // Show error toast or message
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="loader">Loading...</div>
        </div>
      )}

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
      <nav className={`pt-4 ${
        isOpen ? "w-48" : "w-20"
      } h-full transition-all duration-300 ease-in-out bg-white shadow-lg`}>
        {/* Profile Section */}
        <ProfileSection isOpen={isOpen} />

        {/* Navigation Items */}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => getLinkStyles({ isActive })}
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            {isOpen && (
              <span className="ml-3 text-sm font-medium">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}

        {/* Logout button at bottom */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 
                     rounded-lg hover:bg-red-50 hover:text-red-600 
                     transition-all duration-200 group disabled:opacity-50"
          >
            
             
              
              {isLoading ? (
                <>
                <Loader className="h-5 w-5 animate-spin" />
                {isOpen && (
                 
                  <span>Logging out...</span>

                )}
                </>
              ) : (
                <>
                <LogOut className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                {isOpen && (
                  <span>Logout</span>

                )}
                </>
           
              )}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;