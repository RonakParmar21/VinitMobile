"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CameraGrid from "@/components/CameraGrid";
import WhatsAppChat from "@/components/WhatsAppChat";
import SecurityAlertsFeed from "@/components/SecurityAlertsFeed";
import StaffAttendance from "@/components/StaffAttendance";
import LiveSnapshotModal from "@/components/LiveSnapshotModal";
import { CameraInfo, STORE_CAMERAS } from "@/lib/cameras";
import { SecurityAlert } from "@/lib/types";
import { Bell, X } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("surveillance");
  const [cameras] = useState<CameraInfo[]>(STORE_CAMERAS);
  const [selectedCamera, setSelectedCamera] = useState<CameraInfo | null>(STORE_CAMERAS[0]);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [toastAlert, setToastAlert] = useState<SecurityAlert | null>(null);

  // Load initial alerts from API
  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts) setAlerts(data.alerts);
      })
      .catch((err) => console.error("Error loading alerts:", err));
  }, []);

  const handleOpenSnapshot = (camera: CameraInfo) => {
    setSelectedCamera(camera);
    setIsSnapshotModalOpen(true);
  };

  const handleSimulateAlert = async (
    type: "early_shutter" | "night_intruder" | "camera_offline"
  ) => {
    let payload: Partial<SecurityAlert> = {};
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (type === "night_intruder") {
      payload = {
        type: "night_intruder",
        severity: "CRITICAL",
        camera: "Camera 1 (Entrance)",
        timestamp: `${timeStr} (रात 11:45 PM)`,
        title: "सुरक्षा चेतावनी: रात में अज्ञात व्यक्ति!",
        messageHindi:
          "सुरक्षा चेतावनी: रात 11:45 बजे दुकान के अंदर अज्ञात व्यक्ति की हलचल देखी गई!",
        confidence: 96.8,
        snapshotUrl: "/snapshots/intruder_sample.jpg",
      };
    } else if (type === "early_shutter") {
      payload = {
        type: "early_shutter",
        severity: "WARNING",
        camera: "Camera 1 (Entrance)",
        timestamp: `${timeStr} (रात 9:25 PM)`,
        title: "चेतावनी: समय से पहले शटर बंद!",
        messageHindi:
          "चेतावनी: दुकान का शटर रात 10:00 बजे से पहले (9:25 PM) बंद कर दिया गया है।",
        confidence: 98.4,
        snapshotUrl: "/snapshots/v01_cam1.jpg",
      };
    } else {
      payload = {
        type: "camera_offline",
        severity: "WARNING",
        camera: "Camera 3 (Inventory)",
        timestamp: timeStr,
        title: "कैमरा ऑफलाइन चेतावनी!",
        messageHindi:
          "चेतावनी: इन्वेंटरी रूम का कैमरा ऑफलाइन हो गया है।",
        confidence: 100,
        snapshotUrl: "/snapshots/v01_cam3.jpg",
      };
    }

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.alert) {
        setAlerts((prev) => [data.alert, ...prev]);
        setToastAlert(data.alert);
        setTimeout(() => setToastAlert(null), 5000);
      }
    } catch (err) {
      console.error("Failed to simulate alert:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Navbar Always Visible at Top */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.length}
        onSimulateClick={() => handleSimulateAlert("early_shutter")}
      />

      {/* Floating Alert Toast Notification */}
      {toastAlert && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-bounce">
          <div
            className={`p-4 rounded-xl border shadow-lg bg-white flex items-start justify-between gap-3 ${
              toastAlert.severity === "CRITICAL"
                ? "border-rose-300"
                : "border-amber-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  toastAlert.severity === "CRITICAL"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <Bell className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900">
                  {toastAlert.title}
                </span>
                <p className="text-xs text-slate-600 leading-snug">
                  {toastAlert.messageHindi}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <button
                    onClick={() => {
                      setActiveTab("alerts");
                      setToastAlert(null);
                    }}
                    className="text-emerald-700 font-medium hover:underline"
                  >
                    View Alerts
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => {
                      setActiveTab("whatsapp");
                      setToastAlert(null);
                    }}
                    className="text-[#00a884] font-medium hover:underline"
                  >
                    Open in WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setToastAlert(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === "whatsapp" ? (
        /* WhatsApp Bot in Full Screen Edge-to-Edge Under Sticky Navbar */
        <main className="flex-1 w-full overflow-hidden">
          <WhatsAppChat onOpenSnapshot={handleOpenSnapshot} />
        </main>
      ) : (
        /* Standard Container for Surveillance, Alerts, Attendance */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {activeTab === "surveillance" && (
            <CameraGrid
              onOpenSnapshot={handleOpenSnapshot}
              onSimulateShutter={() => handleSimulateAlert("early_shutter")}
              onSimulateIntruder={() => handleSimulateAlert("night_intruder")}
            />
          )}

          {activeTab === "alerts" && (
            <SecurityAlertsFeed
              alerts={alerts}
              onOpenSnapshot={handleOpenSnapshot}
              onSimulateAlert={handleSimulateAlert}
            />
          )}

          {activeTab === "attendance" && <StaffAttendance />}
        </main>
      )}

      {/* Clean Footer (Displayed on standard tabs) */}
      {activeTab !== "whatsapp" && (
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span>CCTV Monitoring System</span>
            <span className="mx-2">•</span>
            <span>All 3 Camera Feeds Connected</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Live Security Monitoring Active</span>
          </div>
        </footer>
      )}

      {/* Live Snapshot Viewer Modal */}
      <LiveSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        selectedCamera={selectedCamera}
        onSelectCamera={(cam) => setSelectedCamera(cam)}
        allCameras={cameras}
      />
    </div>
  );
}
