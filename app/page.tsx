"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-10 overflow-auto">
          <h1 className="text-6xl font-bold mb-6">Welcome to Blink Personal</h1>
          <p className="text-xl text-zinc-400">Your private AI app builder is ready.</p>
        </main>
      </div>
    </div>
  );
}
