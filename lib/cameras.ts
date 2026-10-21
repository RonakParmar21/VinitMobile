export interface CameraInfo {
  id: number;
  channel: number;
  name: string;
  hindiName: string;
  location: string;
  status: "ONLINE" | "OFFLINE";
  ip: string;
  port: number;
  model: string;
  rtspUrl: string;
  snapshotCgi: string;
  snapshotUrl: string;
  resolution: string;
  fps: number;
  lastPing: string;
  notes?: string;
}

export const STORE_CAMERAS: CameraInfo[] = [
  {
    id: 1,
    channel: 1,
    name: "Entrance / Shutter Camera",
    hindiName: "दुकान मुख्य प्रवेश द्वार / शटर",
    location: "Front Entry & Rolling Shutter",
    status: "ONLINE",
    ip: "192.168.1.101",
    port: 554,
    model: "Dahua IPC-HFW2431S-S2 4MP IR Bullet",
    rtspUrl: "rtsp://admin:VinitPass#2026@192.168.1.101:554/cam/realmonitor?channel=1&subtype=0",
    snapshotCgi: "/cgi-bin/snapshot.cgi?channel=1",
    snapshotUrl: "/snapshots/v01_cam1.jpg",
    resolution: "2688x1520 (4MP)",
    fps: 25,
    lastPing: "4ms",
  },
  {
    id: 2,
    channel: 2,
    name: "Billing Counter & Safe",
    hindiName: "बिलिंग काउंटर और कैश ड्रॉअर",
    location: "POS Register & Customer Checkout",
    status: "ONLINE",
    ip: "192.168.1.102",
    port: 554,
    model: "Dahua IPC-HDW2431T-AS 4MP Eyeball Dome",
    rtspUrl: "rtsp://admin:VinitPass#2026@192.168.1.102:554/cam/realmonitor?channel=2&subtype=0",
    snapshotCgi: "/cgi-bin/snapshot.cgi?channel=2",
    snapshotUrl: "/snapshots/v01_cam2.jpg",
    resolution: "2688x1520 (4MP)",
    fps: 25,
    lastPing: "6ms",
  },
  {
    id: 3,
    channel: 3,
    name: "Inventory & Stock Room",
    hindiName: "इन्वेंटरी स्टॉक रूम (ऑफलाइन)",
    location: "Mobile Stock Vault & High Value Storage",
    status: "OFFLINE",
    ip: "192.168.1.103",
    port: 554,
    model: "Dahua IPC-HFW1230S-S5 2MP Entry Bullet",
    rtspUrl: "rtsp://admin:VinitPass#2026@192.168.1.103:554/cam/realmonitor?channel=3&subtype=0",
    snapshotCgi: "/cgi-bin/snapshot.cgi?channel=3",
    snapshotUrl: "/snapshots/v01_cam3.jpg",
    resolution: "1920x1080 (2MP)",
    fps: 0,
    lastPing: "TIMEOUT",
    notes: "PoE switch port unlinked. Last heartbeat lost 42 minutes ago.",
  },
];
