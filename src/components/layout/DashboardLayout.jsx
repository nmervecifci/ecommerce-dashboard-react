import React from "react";
import main from "../../../src/assets/images/main_banner_bg.png";
import right_arrow from "../../../src/assets/images/arrow_icon.svg";
import SalesFunnel from "../SalesFunnel";

function DashboardLayout() {
  return (
    <div>
      {/*Main Banner*/}
      <div className="hidden md:block">
        <div className="relative max-w-md mx-auto">
          <div className="absolute top-20 left-20">
            {" "}
            <p className="text-white font-extrabold text-2xl">
              Here's happening in your sales last weeks
            </p>
          </div>
          <div className="absolute top-40 left-20">
            <h1 className="text-white font-extrabold text-2xl">$8,567.000</h1>
          </div>
          <div className="absolute top-60 left-20">
            <p>
              <span className="text-[#539632]">
                2,478 product are sellings{" "}
              </span>
              and it's increasing rom last weeks.
            </p>
          </div>
          <div>
            <img src={main} alt="" />
          </div>
          <div className="absolute px-20 py-16 top-60 flex items-center justify-center">
            <button className="px-8 py-4 bg-white text-black rounded-md text-xs hover:bg-slate-300 flex items-center gap-2">
              View report
              <img src={right_arrow} alt="" className="w-2 h-2" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-6">
              <SalesFunnel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
