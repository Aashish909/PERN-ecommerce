import { Search, Bell, User, ChevronDown, LogOut, Settings as SettingsIcon, ShoppingBag, UserCircle, Moon, Sun, Command, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const Header = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ... (adminName logic remains same)
  const adminName = user?.name || "Admin";
  const adminEmail = user?.email || "admin@reshop.com";
  const adminAvatar = user?.avatar?.url;

  // ... (useEffect remains same)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ... (handleLogout remains same)
  const handleLogout = async () => {
    // ...
    try {
      dispatch(logoutUser());
      toast.success('Logged out successfully!');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="relative z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between gap-4">

        {/* Left: Mobile Menu & Greeting */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              {getGreeting()}, {adminName.split(' ')[0]}
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Here's what's happening today</p>
          </div>
        </div>

        {/* Center: Search Bar (Global) */}
        <div className="flex-1 max-w-xl mx-auto hidden md:block px-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search orders, customers, products..."
              className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm dark:text-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-300">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              {adminAvatar ? (
                <img
                  src={adminAvatar}
                  alt={adminName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <User size={18} className="text-white" />
                </div>
              )}
              <div className="hidden lg:block text-left mr-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">{adminName}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Admin</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
            </button>

            {/* Dropdown Menu - Fixed Position to prevent clipping */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="
      fixed
      top-[75px]
      right-6
      w-64
      bg-white 
      dark:bg-gray-900
      rounded-2xl 
      shadow-xl 
      border 
      border-gray-100 
      dark:border-gray-800
      overflow-hidden 
      z-[10000]
      animate-in fade-in slide-in-from-top-3 duration-200
    "
              >
                {/* User Header */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{adminName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{adminEmail}</p>
                </div>

                {/* Menu Items */}
                <div className="p-2 space-y-1">

                  <button
                    onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg 
          hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 
          text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                  >
                    <UserCircle size={18} />
                    My Profile
                  </button>

                  <button
                    onClick={() => { navigate('/orders'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg 
        hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 
        text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                  >
                    <ShoppingBag size={18} />
                    My Orders
                  </button>

                  <button
                    onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg 
        hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 
        text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                  >
                    <SettingsIcon size={18} />
                    Settings
                  </button>

                  {/* Dark / Light toggle */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg 
          hover:bg-gray-50 dark:hover:bg-gray-800 
          text-gray-700 dark:text-gray-300 text-sm transition-colors font-medium"
                  >
                    <div className="flex items-center gap-3">
                      {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                      Appearance
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded capitalize text-gray-600 dark:text-gray-400">
                      {isDarkMode ? "Dark" : "Light"}
                    </span>
                  </button>

                </div>

                {/* Logout */}
                <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg 
        text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 
        transition-colors text-sm font-medium"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
