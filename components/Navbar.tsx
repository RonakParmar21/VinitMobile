"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Clock,
  Bell,
  ShieldCheck,
  Radio,
  MessageCircle,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertCount: number;
  onSimulateClick: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  alertCount,
  onSimulateClick,
}: NavbarProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              CCTV Surveillance
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Monitoring
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab("surveillance")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              activeTab === "surveillance"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            Cameras
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              activeTab === "whatsapp"
                ? "bg-emerald-600 text-white shadow-sm font-semibold"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp Bot
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition relative ${
              activeTab === "alerts"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            Alerts
            {alertCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[10px]">
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              activeTab === "attendance"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Attendance
          </button>
        </nav>

        {/* Right Tools (Live Clock & Simulate Button) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>{currentTime || "Live Clock"}</span>
          </div>

          <button
            onClick={onSimulateClick}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 rounded-lg transition shadow-sm text-xs active:scale-95"
          >
            <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            Simulate Alert
          </button>
        </div>
      </div>
    </header>
  );
}
