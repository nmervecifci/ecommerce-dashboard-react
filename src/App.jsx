import React from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <DashboardLayout className="flex-1 overflow-auto" />
      </div>
    </div>
  );
}

export default App;
