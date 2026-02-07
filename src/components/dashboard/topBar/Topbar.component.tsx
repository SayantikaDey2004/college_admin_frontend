import { RxHamburgerMenu } from "react-icons/rx";
import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import useDashboardContext from "../../../context/dashboard/useDashboardContext";
import { useAuthContext } from "../../../context/auth/useAuthContext";
import { useNavigate } from "react-router";
import api from "../../../config/axios.config";
import { useNotificationContext } from "../../../context/notification/useNotificationContext";
import NotificationPanel from "../../notification/NotificationPanel";

const Topbar = ({
  isOpen,
  handleOpen,
}: {
  isOpen: boolean;
  handleOpen: () => void;
}) => {
  const { pageName } = useDashboardContext();
  const { user, onLogout } = useAuthContext();
  const { unreadCount } = useNotificationContext();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      if (response.status === 200) {
        onLogout();
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-[60px] bg-white flex border-b border-gray-200 w-full items-center justify-between px-5 shadow-sm">
      {/* Left Section - Hamburger and Page Name */}
      <div className="flex items-center gap-4">
        {!isOpen && (
          <button
            onClick={handleOpen}
            className="cursor-pointer bg-white hover:bg-gray-100 transition-colors duration-200 p-2 rounded-lg border border-gray-200"
            aria-label="Open sidebar"
          >
            <RxHamburgerMenu size={20} className="text-gray-700" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-800">{pageName}</h1>
      </div>

      {/* Right Section - Notifications and User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsDropdownOpen(false);
            }}
            className={`relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 ${
              isNotificationOpen ? "bg-gray-100 text-gray-900" : ""
            }`}
            aria-label="Notifications"
          >
            <FiBell size={20} />
            {/* Notification Badge */}
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1 shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          <NotificationPanel
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center gap-3 p-2 pr-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-gray-200"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
              {user?.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm">
                  {user ? getInitials(user.first_name, user.last_name) : "NA"}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">
                {user?.first_name} {user?.middle_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
            </div>

            {/* Dropdown Icon */}
            <FiChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.first_name} {user?.middle_name || ""} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {user?.designation} • {user?.department}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    // Navigate to profile page
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <FiUser size={16} />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <FiSettings size={16} />
                  <span>Settings</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
