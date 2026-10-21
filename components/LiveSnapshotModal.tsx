"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  Camera,
} from "lucide-react";
import { CameraInfo } from "@/lib/cameras";

interface LiveSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCamera: CameraInfo | null;
  onSelectCamera: (cam: CameraInfo) => void;
  allCameras: CameraInfo[];
}

export default function LiveSnapshotModal({
  isOpen,
  onClose,
  selectedCamera,
  onSelectCamera,
  allCameras,
}: LiveSnapshotModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  if (!isOpen || !selectedCamera) return null;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = selectedCamera.snapshotUrl;
    a.download = `Camera_${selectedCamera.channel}_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRefresh = () => {
    setRefreshKey(Date.now());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Camera {selectedCamera.channel} Snapshot
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    selectedCamera.status === "ONLINE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {selectedCamera.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {selectedCamera.channel === 1
                  ? "Entrance & Shutter"
                  : selectedCamera.channel === 2
                  ? "Billing Counter"
                  : "Inventory Room"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Camera Switcher */}
            <div className="flex items-center bg-slate-200/80 rounded-lg p-1 text-xs">
              {allCameras.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => onSelectCamera(cam)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    selectedCamera.channel === cam.channel
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Cam {cam.channel}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              title="Refresh"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <button
              onClick={handleDownload}
              title="Download Photo"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              <Download className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              title="Toggle Zoom"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              {isZoomed ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-3 select-none">
          <div
            className={`relative transition-transform duration-300 overflow-hidden rounded-lg ${
              isZoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={`${selectedCamera.snapshotUrl}?t=${refreshKey}`}
              alt={`Snapshot from Camera ${selectedCamera.channel}`}
              className="w-full max-h-[64vh] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
