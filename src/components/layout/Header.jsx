import React, { useState } from "react";
import { Search, Bell, Mail, User, ChevronDown } from "lucide-react";

function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="bg-[#F2F9F7] w-full px-4 md:px-6 lg:px-16 py-4 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-sm md:text-base hidden sm:block">
          Good Morning,
        </p>
        <h1 className="font-bold text-lg md:text-xl truncate">
          <span className="sm:hidden">Hi, </span>Merve Nur Cifci
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors hidden sm:flex">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Messages */}
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex">
          <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>

        {/* Profile - Mobile Version */}
        <div className="relative md:hidden">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center"
          >
            <User className="w-5 h-5 text-white" />
          </button>

          {/* Mobile Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
              <div className="px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Merve Nur Cifci</h3>
                    <p className="text-xs text-gray-500">test@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Messages
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile - Desktop Version */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="px-3 lg:px-4 py-3 lg:py-4 bg-yellow-500 rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-3 hover:bg-yellow-600 transition-colors"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center">
              <User className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
            </div>
            <div className="hidden lg:block text-left">
              <h1 className="text-sm font-bold text-white">Merve Nur Cifci</h1>
              <p className="text-xs text-yellow-100">test@gmail.com</p>
            </div>
            <ChevronDown className="w-4 h-4 text-white hidden lg:block" />
          </button>

          {/* Desktop Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
              <div className="px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Merve Nur Cifci</h3>
                    <p className="text-xs text-gray-500">test@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Account Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Help & Support
                </button>
                <div className="border-t my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  );
}

export default Header;
