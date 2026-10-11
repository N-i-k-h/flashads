import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Zap, Moon, Sun, ChevronDown, LogOut, User as UserIcon, Shield, Settings, MonitorPlay } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useApp();
  const { currentUser, logout } = useAuth();
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left Brand & Primary Navigation */}
          <div className="flex items-center space-x-6 sm:space-x-10">
            {/* Brand Logo */}
            <NavLink to="/screens" className="flex items-center space-x-2 group focus:outline-none">
              <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-sm">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Flash <span className="text-rose-600 font-extrabold">Ads</span>
              </span>
            </NavLink>

            {/* Horizontal Nav Links: Content & Screens */}
            <nav className="flex items-center space-x-1 sm:space-x-2 h-14 sm:h-16">
              <NavLink
                to="/content"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-1.5 h-full text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-pink-600 border-pink-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
                  }`
                }
              >
                Content
              </NavLink>

              <NavLink
                to="/screens"
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-1.5 h-full text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-pink-600 border-pink-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
                  }`
                }
              >
                Screens
              </NavLink>
            </nav>
          </div>

          {/* Right Controls: Dark Mode, Admin Dropdown, Avatar */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Admin Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors focus:outline-none"
              >
                {/* Circular Avatar */}
                <div className="relative">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={currentUser?.name || 'Admin'}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>

                <span className="hidden md:inline-block text-xs font-semibold text-gray-800">
                  {currentUser?.name || 'Alexander Wright'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Dropdown Popover */}
              {isAdminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {currentUser?.name || 'Alexander Wright'}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {currentUser?.email || 'alex@flashads.io'}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded w-fit">
                      <Shield className="w-3 h-3" />
                      Administrator
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsAdminDropdownOpen(false);
                        navigate('/screens');
                      }}
                      className="w-full text-left flex items-center px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <MonitorPlay className="w-4 h-4 mr-2.5 text-gray-400" />
                      Screens & Players
                    </button>
                    <div className="px-3.5 py-2 text-xs text-gray-500 flex items-center">
                      <UserIcon className="w-4 h-4 mr-2.5 text-gray-400" />
                      Account Profile
                    </div>
                    <div className="px-3.5 py-2 text-xs text-gray-500 flex items-center">
                      <Settings className="w-4 h-4 mr-2.5 text-gray-400" />
                      Player Preferences
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
