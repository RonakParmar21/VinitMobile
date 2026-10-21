import { NextRequest, NextResponse } from "next/server";
import { SecurityAlert } from "@/lib/types";

// In-memory global alerts store for the demo session
let ALERTS_STORE: SecurityAlert[] = [
  {
    id: "ALT-001",
    type: "night_intruder",
    severity: "CRITICAL",
    storeId: "V01",
    storeName: "Vinit Mobile - Surat Main Branch",
    camera: "Channel 1 (दुकान प्रवेश द्वार)",
    timestamp: "आज रात 11:45 PM",
    title: "सुरक्षा चेतावनी: रात में अज्ञात व्यक्ति की हलचल!",
    messageHindi:
      "सुरक्षा चेतावनी: रात 11:45 बजे V01 स्टोर के अंदर अज्ञात व्यक्ति की हलचल देखी गई! Dahua AI सेंसर ने मानव उपस्थिति दर्ज की।",
    confidence: 96.4,
    snapshotUrl: "/snapshots/intruder_sample.jpg",
    status: "ACTIVE",
    metadata: {
      zone: "Restricted Front Counter",
      durationSec: 18,
      motionArea: "450px x 240px",
    },
  },
  {
    id: "ALT-002",
    type: "early_shutter",
    severity: "WARNING",
    storeId: "V01",
    storeName: "Vinit Mobile - Surat Main Branch",
    camera: "Channel 1 (दुकान मुख्य शटर)",
    timestamp: "कल रात 9:25 PM",
    title: "चेतावनी: समय से पहले शटर बंद!",
    messageHindi:
      "चेतावनी: V01 स्टोर का शटर रात 10:00 बजे से पहले (9:25 PM) बंद कर दिया गया है। कृपया कारण की जांच करें।",
    confidence: 98.2,
    snapshotUrl: "/snapshots/v01_cam1.jpg",
    status: "ACKNOWLEDGED",
    metadata: {
      scheduledClosing: "10:00 PM",
      actualClosing: "9:25 PM",
      varianceMinutes: -35,
    },
  },
  {
    id: "ALT-003",
    type: "camera_offline",
    severity: "WARNING",
    storeId: "V01",
    storeName: "Vinit Mobile - Surat Main Branch",
    camera: "Channel 3 (इन्वेंटरी स्टॉक रूम)",
    timestamp: "आज दोपहर 12:15 PM",
    title: "कैमरा ऑफलाइन चेतावनी!",
    messageHindi:
      "चेतावनी: V01 स्टोर का चैनल 3 (इन्वेंटरी रूम) कैमरा ऑफलाइन हो गया है! पिछले 42 मिनट से कोई सिग्नल नहीं आ रहा है।",
    confidence: 100,
    snapshotUrl: "/snapshots/v01_cam3.jpg",
    status: "ACTIVE",
    metadata: {
      ip: "192.168.1.103",
      pingLossRate: "100%",
      portSwitch: "PoE Port #4",
    },
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get("type");

  let filtered = ALERTS_STORE;
  if (typeFilter && typeFilter !== "all") {
    filtered = ALERTS_STORE.filter((a) => a.type === typeFilter);
  }

  return NextResponse.json({
    total: filtered.length,
    alerts: filtered,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newAlert: SecurityAlert = {
      id: body.id || `ALT-${Date.now().toString().slice(-4)}`,
      type: body.type || "early_shutter",
      severity: body.severity || "WARNING",
      storeId: body.storeId || "V01",
      storeName: body.storeName || "Vinit Mobile - Surat Main Branch",
      camera: body.camera || "Channel 1 (दुकान प्रवेश द्वार)",
      timestamp:
        body.timestamp ||
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      title: body.title || "सुरक्षा अलर्ट!",
      messageHindi:
        body.messageHindi || body.message_hindi || "नया सुरक्षा अलर्ट प्राप्त हुआ।",
      confidence: body.confidence || 95.0,
      snapshotUrl:
        body.snapshotUrl || body.snapshot_url || "/snapshots/v01_cam1.jpg",
      status: "ACTIVE",
      metadata: body.metadata || body.alert_details || {},
    };

    ALERTS_STORE = [newAlert, ...ALERTS_STORE];
    if (ALERTS_STORE.length > 50) ALERTS_STORE.pop();

    return NextResponse.json({
      success: true,
      alert: newAlert,
      message: "Alert webhook registered and feed updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process alert webhook",
      },
      { status: 400 }
    );
  }
}
