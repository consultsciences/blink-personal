"use client";

import { useState } from "react";
import { Settings, LogOut } from "lucide-react";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 hover:bg-zinc-800 px-3 py-2 rounded-2xl transition"
      >
        <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-sm font-medium">JD</div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-3xl shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-zinc-800">
            <div className="font-medium">John Doe</div>
            <div className="text-sm text-zinc-500">john@example.com</div>
          </div>
          
          <a href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 text-sm">
            <Settings className="w-4 h-4" /> Settings
          </a>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 text-sm text-red-400">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
