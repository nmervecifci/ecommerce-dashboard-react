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
    <div className="h-screen">
      <div className="h-screen bg-white w-[280px] px-4 py-6 overflow-y-auto">
        <div>
          <img src={logo} alt="logo" />
          <div className="px-auto py-auto my-6 bg-yellow-500 rounded-2xl flex flex-row items-center justify-center">
            <div>
              <img src={profile} alt="" width={30} />
            </div>
            <div>
              <h1 className="text-sm font-bold">Barudak visual</h1>
              <p className="text-xs font-normal">3.09K Followers</p>
            </div>
          </div>
        </div>
        <div className=" overflow-y-auto min-h-0">
          <p className="text-gray-500 text-xs mb-3">GENERAL</p>

          <div className="flex items-center gap-3 bg-[#F1FBE8] p-2 rounded mb-2">
            <img src={home} alt="" />
            <h1 className="text-sm">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3 p-2 rounded mb-2 hover:bg-gray-50">
            <img src={cart} alt="" />
            <h1 className="text-sm">Orders</h1>
          </div>

          <div className="flex items-center gap-3 p-2 rounded mb-2 hover:bg-gray-50">
            <img src={products} alt="" />
            <h1 className="text-sm">Products</h1>
          </div>

          <div className="flex items-center gap-3 p-2 rounded mb-2 hover:bg-gray-50">
            <img src={analytics} alt="" width={20} />
            <h1 className="text-sm">Analytics</h1>
          </div>

          <div className="flex items-center gap-3 p-2 rounded mb-4 hover:bg-gray-50">
            <img src={email} alt="" />
            <h1 className="text-sm">Messages</h1>
          </div>

          {/* HELP & SETTINGS */}
          <p className="text-gray-500 text-xs mb-3 uppercase">
            Help & Settings
          </p>

          <div className="flex items-center gap-3 p-2 rounded mb-2 hover:bg-gray-50">
            <img src={phone} alt="" width={20} />
            <h1 className="text-sm">Customer Support</h1>
          </div>

          <div className="flex items-center gap-3 p-2 rounded mb-6 hover:bg-gray-50">
            <img src={settings} alt="" width={20} />
            <h1 className="text-sm">Settings</h1>
          </div>
        </div>
        <div className="mt-4">
          {/* Çok kompakt upgrade kartı */}
          <div className="bg-[#F5FCEE] p-2 relative rounded-xl mt-6">
            <img
              src={cross}
              alt=""
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
    </div>
  );
}

export default Sidebar;
