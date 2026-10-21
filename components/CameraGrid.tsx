"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Camera,
  AlertTriangle,
  CheckCircle2,
  WifiOff,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { CameraInfo, STORE_CAMERAS } from "@/lib/cameras";

interface CameraGridProps {
  onOpenSnapshot: (camera: CameraInfo) => void;
  onSimulateShutter: () => void;
  onSimulateIntruder: () => void;
}

export default function CameraGrid({
  onOpenSnapshot,
  onSimulateShutter,
  onSimulateIntruder,
}: CameraGridProps) {
  const [cameras] = useState<CameraInfo[]>(STORE_CAMERAS);
  const [liveTimestamp, setLiveTimestamp] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTimestamp(now.toLocaleTimeString("en-IN", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Clean Status Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Live Camera Feeds
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time video surveillance and automated shutter detection
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700">2 Online</span>
            <span className="text-slate-300">|</span>
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span className="text-slate-700">1 Offline</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">
            <span>Shutter:</span>
            <span className="text-emerald-700 font-semibold">Open</span>
          </div>
        </div>
      </div>

      {/* 3 Camera Cards (Clean Light Theme) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    camera.status === "ONLINE" ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Camera {camera.channel}: {camera.channel === 1 ? "Entrance & Shutter" : camera.channel === 2 ? "Billing Counter" : "Inventory Room"}
                  </h3>
                  <p className="text-xs text-slate-500">{camera.hindiName}</p>
                </div>
              </div>

              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  camera.status === "ONLINE"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {camera.status}
              </span>
            </div>

            {/* Camera Snapshot Preview */}
            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden group">
              <img
                src={camera.snapshotUrl}
                alt={camera.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
              />

              {/* Time Stamp Badge */}
              <div className="absolute top-2.5 right-2.5 text-[10px] font-mono text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                {liveTimestamp || "Live"}
              </div>

              {/* Offline Overlay */}
              {camera.status === "OFFLINE" && (
                <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center text-center p-4">
                  <WifiOff className="h-8 w-8 text-rose-400 mb-1.5" />
                  <p className="text-xs font-bold text-white">Camera Offline</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Signal lost • Check network connection
                  </p>
                </div>
              )}

              {/* Hover Quick Action */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onOpenSnapshot(camera)}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-semibold text-xs shadow-md hover:bg-slate-100 transition"
                >
                  View Full Photo
                </button>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-white">
              <span className="text-xs text-slate-500">
                {camera.status === "ONLINE" ? "Live Stream Active" : "Disconnected"}
              </span>

              <button
                onClick={() => onOpenSnapshot(camera)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition active:scale-95 shadow-xs"
              >
                <Camera className="h-3.5 w-3.5" />
                Get Live Snapshot
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shutter Guard Status Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Shutter Monitor
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              दुकान का शटर रात 10:00 बजे से पहले बंद होने पर WhatsApp पर सूचना भेजी जाती है।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateShutter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            Test Early Shutter (9:25 PM)
          </button>

          <button
            onClick={onSimulateIntruder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            Test Night Intruder (11:45 PM)
          </button>
        </div>
      </div>
    </div>
  );
}
