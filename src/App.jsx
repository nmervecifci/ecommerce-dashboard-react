import React from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardLayout from "./components/layout/DashboardLayout";
import { Route, Routes } from "react-router-dom";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import CustomerSupport from "./pages/CustomerSupport";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/customer-support" element={<CustomerSupport />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
