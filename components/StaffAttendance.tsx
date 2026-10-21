"use client";

import React, { useState } from "react";
import {
  Users,
  Clock,
  ScanFace,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { AttendanceRecord } from "@/lib/types";

interface StaffAttendanceProps {
  initialRecords?: AttendanceRecord[];
}

export default function StaffAttendance({ initialRecords }: StaffAttendanceProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>(
    initialRecords || [
      {
        id: "EMP-101",
        name: "Amit Patel",
        role: "Store Manager",
        hindiRole: "स्टोर मैनेजर",
        thumbnail: "/snapshots/staff/amit_patel.jpg",
        inTime: "09:42 AM",
        outTime: "08:15 PM",
        status: "DEPARTED",
        confidence: 99.4,
        cameraSource: "Camera 1 (Entrance)",
        date: "Today",
      },
      {
        id: "EMP-102",
        name: "Priya Sharma",
        role: "Senior Sales Executive",
        hindiRole: "सेल्स एक्जीक्यूटिव",
        thumbnail: "/snapshots/staff/priya_sharma.jpg",
        inTime: "10:05 AM",
        outTime: "--:-- (ड्यूटी पर)",
        status: "ON_SHIFT",
        confidence: 98.9,
        cameraSource: "Camera 2 (Counter)",
        date: "Today",
      },
      {
        id: "EMP-103",
        name: "Rahul Deshmukh",
        role: "Billing & Cash Specialist",
        hindiRole: "बिलिंग विशेषज्ञ",
        thumbnail: "/snapshots/staff/rahul_deshmukh.jpg",
        inTime: "10:14 AM",
        outTime: "--:-- (ड्यूटी पर)",
        status: "ON_SHIFT",
        confidence: 99.2,
        cameraSource: "Camera 2 (Counter)",
        date: "Today",
      },
      {
        id: "EMP-104",
        name: "Neha Singh",
        role: "Inventory Lead",
        hindiRole: "स्टॉक प्रभारी",
        thumbnail: "/snapshots/staff/neha_singh.jpg",
        inTime: "11:00 AM",
        outTime: "--:-- (ड्यूटी पर)",
        status: "ON_SHIFT",
        confidence: 97.6,
        cameraSource: "Camera 1 (Entrance)",
        date: "Today",
      },
    ]
  );

  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const newRec: AttendanceRecord = {
        id: `EMP-${Math.floor(105 + Math.random() * 50)}`,
        name: "Karan Verma",
        role: "Technical Support",
        hindiRole: "तकनीकी सहायता",
        thumbnail: "/snapshots/staff/amit_patel.jpg",
        inTime: timeStr,
        outTime: "--:-- (ड्यूटी पर)",
        status: "ON_SHIFT",
        confidence: 98.7,
        cameraSource: "Camera 1 (Entrance)",
        date: "Today",
      };

      setRecords((prev) => [newRec, ...prev]);
      setIsScanning(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ScanFace className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Staff Attendance Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated face detection attendance from entrance and counter cameras
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700">
            <span>Present: </span>
            <span className="font-bold text-emerald-700">{records.length} Staff</span>
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition shadow-xs active:scale-95 disabled:opacity-50"
          >
            <ScanFace className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Scanning Face..." : "Simulate Check-In"}
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Employee
                </th>
                <th scope="col" className="px-4 py-3">
                  Role
                </th>
                <th scope="col" className="px-4 py-3">
                  In Time
                </th>
                <th scope="col" className="px-4 py-3">
                  Out Time
                </th>
                <th scope="col" className="px-4 py-3">
                  Confidence
                </th>
                <th scope="col" className="px-5 py-3 text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Avatar & Name */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                        <img
                          src={rec.thumbnail}
                          alt={rec.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {rec.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {rec.hindiRole}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                    {rec.role}
                  </td>

                  {/* In Time */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-medium text-emerald-700">
                    <span className="flex items-center gap-1">
                      <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
                      {rec.inTime}
                    </span>
                  </td>

                  {/* Out Time */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                      {rec.outTime}
                    </span>
                  </td>

                  {/* Confidence */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {rec.confidence}%
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    {rec.status === "ON_SHIFT" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        On Shift
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                        Departed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
