"use client";

import { Home, BarChart3, Users, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={onClose} />}
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-9 h-9 bg-violet-600 rounded-2xl flex items-center justify-center font-bold text-xl">B</div>
            <span className="font-semibold text-2xl">Blink</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item, i) => (
              <Tooltip key={i} delayDuration={100}>
                <TooltipTrigger asChild>
                  <a href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-zinc-800 transition">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:block hidden">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
