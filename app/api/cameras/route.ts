import { NextResponse } from "next/server";
import { STORE_CAMERAS } from "@/lib/cameras";

export async function GET() {
  return NextResponse.json({
    storeId: "V01",
    storeName: "Vinit Mobile - Store V01 Surat Main Branch",
    address: "Shop 12-14, Ghod Dod Road, Surat, Gujarat 395007",
    nvrIp: "192.168.1.100",
    nvrModel: "Dahua NVR4104HS-P-4KS2/L (4-Channel 4K PoE NVR)",
    summary: {
      total: STORE_CAMERAS.length,
      online: STORE_CAMERAS.filter((c) => c.status === "ONLINE").length,
      offline: STORE_CAMERAS.filter((c) => c.status === "OFFLINE").length,
      systemHealth: "ATTENTION_REQUIRED",
    },
    cameras: STORE_CAMERAS,
  });
}
