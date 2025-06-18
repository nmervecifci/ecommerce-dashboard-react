import React from "react";
import logo from "../../../src/assets/images/logo.svg";
import profile from "../../../src/assets/images/profile_icon.png";
import cart from "../../../src/assets/images/cart_icon.svg";
import products from "../../../src/assets/images/product_list_icon.svg";
import analytics from "../../../src/assets/images/analytics.svg";
import email from "../../../src/assets/images/email_icon.svg";
import home from "../../../src/assets/images/home_icon.svg";
import phone from "../../../src/assets/images/phone_icon_dull.svg";
import settings from "../../../src/assets/images/settings.svg";
import bag from "../../../src/assets/images/grocery-bag-with-food-ecological-sustainability.png";
import cross from "../../../src/assets/images/cross_icon.svg";

function Sidebar() {
  return (
    <div className="h-screen bg-white w-[80px] md:w-[280px] px-2 md:px-4 py-6 overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="mb-6 flex justify-center md:justify-start">
        <img src={logo} alt="logo" className="w-8 md:w-auto" />
      </div>

      {/* Profile */}
      <div className="hidden md:flex px-auto py-auto mb-6 bg-yellow-500 rounded-2xl flex-row items-center justify-center">
        <div className="mr-2">
          <img src={profile} alt="profile" width={30} />
        </div>
        <div>
          <h1 className="text-sm font-bold">Barudak visual</h1>
          <p className="text-xs font-normal">3.09K Followers</p>
        </div>
      </div>

      {/* GENERAL */}
      <div className="overflow-y-auto min-h-0 flex-1">
        <p className="text-gray-500 text-[10px] md:text-xs mb-3 hidden md:block">
          GENERAL
        </p>

        {[
          { icon: home, label: "Dashboard", active: true },
          { icon: cart, label: "Orders" },
          { icon: products, label: "Products" },
          { icon: analytics, label: "Analytics" },
          { icon: email, label: "Messages" },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-2 rounded mb-2 cursor-pointer ${
              item.active ? "bg-[#F1FBE8]" : "hover:bg-gray-100"
            }`}
          >
            <img src={item.icon} alt="" className="w-5 h-5 mx-auto md:mx-0" />
            <h1 className="text-sm hidden md:block">{item.label}</h1>
          </div>
        ))}

        {/* HELP & SETTINGS */}
        <p className="text-gray-500 text-[10px] md:text-xs mb-3 uppercase hidden md:block">
          Help & Settings
        </p>

        {[
          { icon: phone, label: "Customer Support" },
          { icon: settings, label: "Settings" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded mb-2 hover:bg-gray-100 cursor-pointer"
          >
            <img src={item.icon} alt="" className="w-5 h-5 mx-auto md:mx-0" />
            <h1 className="text-sm hidden md:block">{item.label}</h1>
          </div>
        ))}
      </div>

      {/* Upgrade Plan - hidden on mobile */}
      <div className="mt-4 hidden md:block">
        <div className="bg-[#F5FCEE] p-2 relative rounded-xl mt-6">
          <img
            src={cross}
            alt="close"
            className="cursor-pointer absolute top-1 right-1 w-3 h-3"
          />
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#F1FBE8] p-1 rounded">
              <img src={bag} alt="" className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-xs">Upgrade plan</h1>
              <p className="text-gray-600 text-xs">4 days left</p>
            </div>
          </div>
          <button className="w-full py-1 bg-green-500 text-white rounded text-xs">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
