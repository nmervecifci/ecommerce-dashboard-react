import React from "react";
import { ArrowRight, TrendingUp, Package, DollarSign } from "lucide-react";
import SalesFunnel from "../SalesFunnel";

function DashboardLayout() {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full">
      {/* Mobile Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:hidden">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-xl font-bold">$8,567K</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Products Sold</p>
              <p className="text-xl font-bold">2,478</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main Banner - Desktop */}
      <div className="hidden md:block mb-6">
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl overflow-hidden">
          {/* Background pattern or image would go here */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          <div className="relative p-8 lg:p-12">
            <div className="max-w-2xl">
              <p className="text-white/90 text-sm mb-2">Sales Overview</p>
              <h1 className="text-white font-bold text-3xl lg:text-4xl mb-4">
                Here's what's happening in your sales last week
              </h1>

              <div className="mb-4">
                <h2 className="text-white font-bold text-2xl lg:text-3xl mb-2">
                  $8,567,000
                </h2>
                <p className="text-white/90">
                  <span className="text-green-300 font-semibold">
                    2,478 products are selling
                  </span>{" "}
                  and it's increasing from last week.
                </p>
              </div>

              <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                View report
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="md:hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white">
          <h2 className="font-bold text-xl mb-2">Weekly Sales</h2>
          <p className="text-3xl font-bold mb-2">$8,567K</p>
          <p className="text-blue-100 text-sm mb-4">
            <span className="text-green-300">↗ 2,478 products sold</span>
          </p>
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            View report
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <SalesFunnel />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
