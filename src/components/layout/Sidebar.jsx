import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../src/assets/images/logo.svg";
import profile from "../../../src/assets/images/profile_icon.png";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  Mail,
  Phone,
  Settings,
  Gift,
} from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Menü items
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
      section: "GENERAL",
    },
    {
      id: 2,
      name: "Orders",
      path: "/orders", 
      icon: ShoppingCart,
      section: "GENERAL",
    },
    {
      id: 3,
      name: "Products",
      path: "/products",
      icon: Package,
      section: "GENERAL",
    },
    {
      id: 4,
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
      section: "GENERAL",
    },
    {
      id: 5,
      name: "Messages",
      path: "/messages",
      icon: Mail,
      section: "GENERAL",
    },
    {
      id: 6,
      name: "Customer Support",
      path: "/customer-support",
      icon: Phone,
      section: "HELP & SETTINGS",
    },
    {
      id: 7,
      name: "Settings",
      path: "/settings",
      icon: Settings,
      section: "HELP & SETTINGS",
    },
  ];

  // Aktif link kontrolü
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // GENERAL items'ları filtrele
  const generalItems = menuItems.filter(item => item.section === "GENERAL");
  
  // HELP & SETTINGS items'ları filtrele
  const helpSettingsItems = menuItems.filter(item => item.section === "HELP & SETTINGS");

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static h-screen bg-white z-40 overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        w-64 md:w-20 lg:w-64
      `}
      >
        {/* Logo */}
        <div className="p-4 md:p-2 lg:p-4 flex justify-center md:justify-center lg:justify-start">
          <div className="w-40 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              <img src={logo} alt="logo" />
            </span>
          </div>
        </div>

        {/* Profile */}
        <div className="mx-4 md:mx-2 lg:mx-4 mb-6 bg-yellow-500 rounded-2xl p-3 md:p-2 lg:p-3">
          <div className="flex items-center md:justify-center lg:justify-start">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-yellow-500 font-bold text-sm">
                <img src={profile} alt="profile" />
              </span>
            </div>
            <div className="ml-3 md:hidden lg:block">
              <h1 className="text-sm font-bold text-white">Barudak visual</h1>
              <p className="text-xs text-yellow-100">3.09K Followers</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 md:px-2 lg:px-4">
          {/* GENERAL Section */}
          <p className="text-gray-500 text-xs mb-3 uppercase md:hidden lg:block">
            GENERAL
          </p>

          {generalItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)} // Mobile'da sidebar'ı kapat
                className={`flex items-center gap-3 p-3 md:p-2 lg:p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-600 border-r-2 border-green-600"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <IconComponent className="w-5 h-5 md:mx-auto lg:mx-0 flex-shrink-0" />
                <span className="text-sm font-medium md:hidden lg:block">
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* HELP & SETTINGS Section */}
          <p className="text-gray-500 text-xs mb-3 uppercase mt-8 md:hidden lg:block">
            Help & Settings
          </p>

          {helpSettingsItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)} // Mobile'da sidebar'ı kapat
                className={`flex items-center gap-3 p-3 md:p-2 lg:p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-600 border-r-2 border-green-600"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <IconComponent className="w-5 h-5 md:mx-auto lg:mx-0 flex-shrink-0" />
                <span className="text-sm font-medium md:hidden lg:block">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Upgrade Plan */}
        <div className="p-4 md:p-2 lg:p-4 mt-auto">
          <div className="bg-green-50 p-4 md:p-2 lg:p-4 rounded-xl relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 md:hidden lg:block">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 md:justify-center lg:justify-start mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Gift className="w-4 h-4 text-green-600" />
              </div>
              <div className="md:hidden lg:block">
                <h1 className="font-bold text-sm text-gray-800">
                  Upgrade plan
                </h1>
                <p className="text-gray-600 text-xs">4 days left</p>
              </div>
            </div>

            <button className="w-full py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors md:px-2 lg:px-4">
              <span className="md:hidden lg:inline">Upgrade</span>
              <span className="md:inline lg:hidden">↑</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;