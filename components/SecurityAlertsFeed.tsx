"use client";

import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Clock,
  WifiOff,
  Eye,
  CheckCircle,
  Filter,
  Zap,
} from "lucide-react";
import { SecurityAlert } from "@/lib/types";
import { CameraInfo, STORE_CAMERAS } from "@/lib/cameras";

interface SecurityAlertsFeedProps {
  alerts: SecurityAlert[];
  onOpenSnapshot: (cam: CameraInfo) => void;
  onSimulateAlert: (type: "early_shutter" | "night_intruder" | "camera_offline") => void;
}

export default function SecurityAlertsFeed({
  alerts,
  onOpenSnapshot,
  onSimulateAlert,
}: SecurityAlertsFeedProps) {
  const [filter, setFilter] = useState<string>("all");
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    return alert.type === filter;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "night_intruder":
        return <AlertTriangle className="h-5 w-5 text-rose-600" />;
      case "early_shutter":
        return <Clock className="h-5 w-5 text-amber-600" />;
      case "camera_offline":
        return <WifiOff className="h-5 w-5 text-slate-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            Critical
          </span>
        );
      case "WARNING":
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Warning
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            Info
          </span>
        );
    }
  };

  const handleSnapshotClick = (alert: SecurityAlert) => {
    const ch = alert.type === "camera_offline" ? 3 : 1;
    const cam = STORE_CAMERAS.find((c) => c.channel === ch) || STORE_CAMERAS[0];
    onOpenSnapshot(cam);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mr-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            फिल्टर:
          </span>

          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Alerts ({alerts.length})
          </button>

          <button
            onClick={() => setFilter("early_shutter")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filter === "early_shutter"
                ? "bg-amber-100 text-amber-900 border border-amber-300 font-semibold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            Early Shutter
          </button>

          <button
            onClick={() => setFilter("night_intruder")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filter === "night_intruder"
                ? "bg-rose-100 text-rose-900 border border-rose-300 font-semibold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            Night Intruder
          </button>

          <button
            onClick={() => setFilter("camera_offline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filter === "camera_offline"
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <WifiOff className="h-3.5 w-3.5 text-slate-600" />
            Camera Offline
          </button>
        </div>

        {/* Trigger Button */}
        <button
          onClick={() => setIsSimulateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition shadow-xs active:scale-95"
        >
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          Simulate Alert
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-slate-200 bg-white">
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">कोई सक्रिय अलर्ट नहीं है</h4>
            <p className="text-xs text-slate-500 mt-1">
              सभी कैमरे और सुरक्षा स्थिति सामान्य है।
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 sm:p-5 transition-shadow bg-white shadow-xs ${
                alert.severity === "CRITICAL"
                  ? "border-rose-200 bg-rose-50/30"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left Description */}
                <div className="flex items-start gap-3.5 flex-1">
                  <div
                    className={`p-2.5 rounded-xl border flex-shrink-0 ${
                      alert.severity === "CRITICAL"
                        ? "bg-rose-50 border-rose-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {alert.title}
                      </h4>
                      {getSeverityBadge(alert.severity)}
                      <span className="text-xs text-slate-500">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">
                      {alert.messageHindi}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                      <span className="text-emerald-700 font-medium">WhatsApp Sent</span>
                      <span>•</span>
                      <span>{alert.camera}</span>
                    </div>
                  </div>
                </div>

                {/* Right Snapshot */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  <div
                    onClick={() => handleSnapshotClick(alert)}
                    className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 w-24 h-16 bg-slate-100 flex-shrink-0"
                  >
                    <img
                      src={alert.snapshotUrl}
                      alt={alert.title}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSnapshotClick(alert)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    फोटो देखें
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Simulate Alert Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Simulate Security Alert
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                डेमो के लिए एक अलर्ट ट्रिगर करें। यह तुरंत अलर्ट फीड और WhatsApp चैट को अपडेट करेगा।
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  onSimulateAlert("early_shutter");
                  setIsSimulateModalOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-700" />
                    1. Early Shutter Closure (समय से पूर्व शटर बंद)
                  </span>
                  <span className="text-[10px] text-amber-800 font-medium">9:25 PM</span>
                </div>
                <p className="text-xs text-amber-800/80 mt-1">
                  शटर 10:00 बजे से पहले बंद होने पर अलर्ट
                </p>
              </button>

              <button
                onClick={() => {
                  onSimulateAlert("night_intruder");
                  setIsSimulateModalOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100/60 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-700" />
                    2. Night Intruder (रात में अज्ञात व्यक्ति)
                  </span>
                  <span className="text-[10px] text-rose-800 font-medium">11:45 PM</span>
                </div>
                <p className="text-xs text-rose-800/80 mt-1">
                  रात के समय दुकान में हलचल का अलर्ट
                </p>
              </button>

              <button
                onClick={() => {
                  onSimulateAlert("camera_offline");
                  setIsSimulateModalOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <WifiOff className="h-4 w-4 text-slate-600" />
                    3. Camera Offline (कैमरा बंद)
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium">Camera 3</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  इन्वेंटरी रूम कैमरा कनेक्शन टूटने का अलर्ट
                </p>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSimulateModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
