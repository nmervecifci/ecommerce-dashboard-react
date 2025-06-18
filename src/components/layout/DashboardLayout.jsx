import React, { useEffect, useState } from "react";
import main from "../../../src/assets/images/main_banner_bg.png";
import right_arrow from "../../../src/assets/images/arrow_icon.svg";
import SalesFunnel from "../SalesFunnel";

function DashboardLayout() {
  const [isMobile, setIsMobile] = useState(false);

  // Ekran boyutu kontrol
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // İlk yükleme
    checkScreenSize();

    // Window resize event listener
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      // Mobile View - Only Images
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center p-4">
        {/* Mobile Header */}
        <div className="text-center mb-8">
          <h2 className="text-white text-lg font-bold mb-2">
            📱 Mobile Dashboard
          </h2>
          <p className="text-white/70 text-sm">Image Preview Mode</p>
        </div>

        {/* Main Banner Image */}
        <div className="relative mb-8 max-w-sm w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
            <img
              src={main}
              alt="Dashboard Main Banner"
              className="w-full h-auto rounded-xl shadow-lg"
            />
            <div className="text-center mt-3">
              <span className="text-white/80 text-sm font-medium">
                Main Banner
              </span>
            </div>
          </div>
        </div>

        {/* Arrow Icon Display */}
        <div className="relative max-w-xs w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <img src={right_arrow} alt="Arrow Icon" className="w-8 h-8" />
              </div>
            </div>
            <div className="text-center">
              <span className="text-white/80 text-sm font-medium">
                Navigation Icon
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Info */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-xs">
            Switch to desktop for full dashboard experience
          </p>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div>
      {/*Main Banner*/}
      <div className="relative max-w-md mx-auto">
        <div className="absolute top-20 left-20 z-10">
          <p className="text-white font-extrabold text-2xl">
            Here's happening in your sales last weeks
          </p>
        </div>
        <div className="absolute top-40 left-20 z-10">
          <h1 className="text-white font-extrabold text-2xl">$8,567.000</h1>
        </div>
        <div className="absolute top-60 left-20 z-10">
          <p>
            <span className="text-[#539632]">2,478 product are sellings </span>
            and it's increasing from last weeks.
          </p>
        </div>
        <div>
          <img src={main} alt="Main Banner" />
        </div>
        <div className="absolute px-20 py-16 top-60 flex items-center justify-center z-10">
          <button className="px-8 py-4 bg-white text-black rounded-md text-xs hover:bg-slate-300 flex items-center gap-2">
            View report
            <img src={right_arrow} alt="Arrow" className="w-2 h-2" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <SalesFunnel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
