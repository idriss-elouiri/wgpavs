"use client";

import { useState } from "react";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(true);

  return (
    <div className="flex">
      <Sidebar showNav={showNav} onClose={() => setShowNav(false)} />
      <div className="flex-1 flex flex-col">
        <TopNavbar onMenuClick={() => setShowNav(!showNav)} />
        <main className="p-6 space-y-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}