import { NextRequest, NextResponse } from "next/server";
import { AttendanceRecord } from "@/lib/types";

let ATTENDANCE_LOG: AttendanceRecord[] = [
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
    cameraSource: "CH01 - Main Entrance (Dahua Face Recog)",
    date: "आज (21 Oct 2026)",
  },
  {
    id: "EMP-102",
    name: "Priya Sharma",
    role: "Senior Sales Executive",
    hindiRole: "सीनियर सेल्स एक्जीक्यूटिव",
    thumbnail: "/snapshots/staff/priya_sharma.jpg",
    inTime: "10:05 AM",
    outTime: "--:-- (ड्यूटी पर)",
    status: "ON_SHIFT",
    confidence: 98.9,
    cameraSource: "CH02 - Billing Counter AI",
    date: "आज (21 Oct 2026)",
  },
  {
    id: "EMP-103",
    name: "Rahul Deshmukh",
    role: "Billing & Cash Specialist",
    hindiRole: "बिलिंग और कैश विशेषज्ञ",
    thumbnail: "/snapshots/staff/rahul_deshmukh.jpg",
    inTime: "10:14 AM",
    outTime: "--:-- (ड्यूटी पर)",
    status: "ON_SHIFT",
    confidence: 99.2,
    cameraSource: "CH02 - Billing Counter AI",
    date: "आज (21 Oct 2026)",
  },
  {
    id: "EMP-104",
    name: "Neha Singh",
    role: "Inventory & Dispatch Lead",
    hindiRole: "स्टॉक व इन्वेंटरी प्रभारी",
    thumbnail: "/snapshots/staff/neha_singh.jpg",
    inTime: "11:00 AM",
    outTime: "--:-- (ड्यूटी पर)",
    status: "ON_SHIFT",
    confidence: 97.6,
    cameraSource: "CH01 - Main Entrance (Dahua Face Recog)",
    date: "आज (21 Oct 2026)",
  },
];

export async function GET() {
  return NextResponse.json({
    totalEmployees: ATTENDANCE_LOG.length,
    presentCount: ATTENDANCE_LOG.filter(
      (e) => e.status === "ON_SHIFT" || e.status === "DEPARTED"
    ).length,
    onShiftCount: ATTENDANCE_LOG.filter((e) => e.status === "ON_SHIFT").length,
    records: ATTENDANCE_LOG,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRecord: AttendanceRecord = {
      id: body.id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name || "सुरेश मेहता",
      role: body.role || "Trainee Specialist",
      hindiRole: body.hindiRole || "प्रशिक्षु विशेषज्ञ",
      thumbnail: body.thumbnail || "/snapshots/staff/amit_patel.jpg",
      inTime: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      outTime: "--:-- (ड्यूटी पर)",
      status: "ON_SHIFT",
      confidence: body.confidence || 98.4,
      cameraSource: "CH01 - Main Entrance (Dahua Face Recog)",
      date: "आज (21 Oct 2026)",
    };

    ATTENDANCE_LOG = [newRecord, ...ATTENDANCE_LOG];
    return NextResponse.json({ success: true, record: newRecord });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
