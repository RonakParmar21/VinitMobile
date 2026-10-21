export interface SecurityAlert {
  id: string;
  type: "early_shutter" | "night_intruder" | "camera_offline";
  severity: "CRITICAL" | "WARNING" | "INFO";
  storeId: string;
  storeName: string;
  camera: string;
  timestamp: string;
  title: string;
  messageHindi: string;
  confidence?: number;
  snapshotUrl: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  metadata?: Record<string, any>;
}

export interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  hindiRole: string;
  thumbnail: string;
  inTime: string;
  outTime: string;
  status: "PRESENT" | "ON_SHIFT" | "DEPARTED";
  confidence: number;
  cameraSource: string;
  date: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponsePayload {
  reply: string;
  snapshotCard?: {
    channel: number;
    channelName: string;
    title: string;
    snapshotUrl: string;
    status: "ONLINE" | "OFFLINE";
    timestamp: string;
    ip: string;
  };
  cameraSummary?: {
    total: number;
    online: number;
    offline: number;
  };
  suggestedChips?: string[];
}
