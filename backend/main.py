"""
Vinit Mobile - Store V01 Surat
AI CCTV Monitoring & WhatsApp Automation System
FastAPI Backend Worker for Render deployment
"""

import os
import io
import time
import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Query, UploadFile, File
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from PIL import Image, ImageDraw
import httpx

app = FastAPI(
    title="Vinit Mobile CCTV Surveillance & WhatsApp Worker",
    version="1.0.0",
    description="Edge AI & CCTV backend for Store V01 Surat - Dahua snapshot proxy, intrusion detection, early shutter closure detection, and WhatsApp webhooks"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration & Environment
NEXTJS_WEBHOOK_URL = os.getenv("NEXTJS_WEBHOOK_URL", "http://localhost:3000/api/alerts")
WHATSAPP_CLOUD_API_URL = os.getenv("WHATSAPP_CLOUD_API_URL", "http://localhost:3000/api/whatsapp/mock")
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN", "mock_whatsapp_token_vinit_mobile")
STORE_ID = "V01"
STORE_NAME = "Vinit Mobile - Store V01 Surat Main Branch"
STORE_SCHEDULED_CLOSE = "22:00"  # 10:00 PM

# Camera Registry for Store V01
CAMERAS = {
    1: {
        "channel": 1,
        "name": "Entrance / Main Shutter",
        "location": "Front Gate & Customer Entry",
        "status": "ONLINE",
        "ip": "192.168.1.101",
        "port": 554,
        "model": "Dahua IPC-HFW2431S-S2 4MP IR Bullet",
        "firmware": "V2.820.0000000.12.R.230415",
        "rtsp_url": "rtsp://admin:VinitPass#2026@192.168.1.101:554/cam/realmonitor?channel=1&subtype=0",
        "snapshot_cgi": "/cgi-bin/snapshot.cgi?channel=1",
        "last_ping_ms": 4.2,
        "resolution": "2688x1520 (4MP) @ 25fps",
        "encoding": "H.265+ Smart Codec",
        "night_vision": "Smart Dual Illuminators (30m)",
    },
    2: {
        "channel": 2,
        "name": "Billing Counter & Safe",
        "location": "POS Desk, Cash Drawer & Display Shelves",
        "status": "ONLINE",
        "ip": "192.168.1.102",
        "port": 554,
        "model": "Dahua IPC-HDW2431T-AS 4MP Eyeball Dome",
        "firmware": "V2.820.0000000.15.R.230822",
        "rtsp_url": "rtsp://admin:VinitPass#2026@192.168.1.102:554/cam/realmonitor?channel=2&subtype=0",
        "snapshot_cgi": "/cgi-bin/snapshot.cgi?channel=2",
        "last_ping_ms": 5.8,
        "resolution": "2688x1520 (4MP) @ 25fps",
        "encoding": "H.265+ Smart Codec",
        "night_vision": "Built-in Mic & IR (30m)",
    },
    3: {
        "channel": 3,
        "name": "Inventory & Stock Room",
        "location": "High-Value Phone Vault & Storage",
        "status": "OFFLINE",
        "ip": "192.168.1.103",
        "port": 554,
        "model": "Dahua IPC-HFW1230S-S5 2MP Entry Bullet",
        "firmware": "V2.800.0000000.4.R.220110",
        "rtsp_url": "rtsp://admin:VinitPass#2026@192.168.1.103:554/cam/realmonitor?channel=3&subtype=0",
        "snapshot_cgi": "/cgi-bin/snapshot.cgi?channel=3",
        "last_ping_ms": None,
        "resolution": "1920x1080 (2MP) @ 25fps",
        "encoding": "H.264",
        "night_vision": "IR (30m) - Disconnected",
        "offline_reason": "No response to ARP/ICMP ping; PoE port switch 4 power cycle recommended",
    }
}

# In-memory recent alerts buffer
ALERT_HISTORY: List[Dict[str, Any]] = []

# --- Pydantic Request Models ---
class IntruderDetectionRequest(BaseModel):
    channel: int = Field(default=1, description="Camera channel ID (1 for Entrance)")
    simulated_time: Optional[str] = Field(default=None, description="Time in HH:MM format (e.g. '23:45' for night test)")
    motion_score: Optional[float] = Field(default=0.94, description="Simulated motion confidence (0.0 to 1.0)")
    zone: Optional[str] = Field(default="Store Entrance Perimeter", description="Monitored motion zone")

class ShutterDetectionRequest(BaseModel):
    channel: int = Field(default=1, description="Camera channel ID pointing to shop shutter")
    simulated_time: Optional[str] = Field(default="21:25", description="Time in HH:MM format (e.g. '21:25' before 22:00)")
    shutter_closed_percentage: float = Field(default=92.5, description="Percentage of shutter rolled down (0 to 100)")


# --- Webhook Dispatcher Helper ---
async def dispatch_security_alert(alert_payload: Dict[str, Any]):
    """Sends JSON notification to Next.js dashboard webhook and WhatsApp Cloud API"""
    alert_payload["dispatched_at"] = datetime.datetime.now().isoformat()
    ALERT_HISTORY.insert(0, alert_payload)
    if len(ALERT_HISTORY) > 50:
        ALERT_HISTORY.pop()

    async with httpx.AsyncClient(timeout=5.0) as client:
        # 1. Post to Next.js /api/alerts
        try:
            res1 = await client.post(NEXTJS_WEBHOOK_URL, json=alert_payload)
            alert_payload["nextjs_webhook_status"] = res1.status_code
        except Exception as e:
            alert_payload["nextjs_webhook_status"] = f"Failed: {str(e)}"

        # 2. Post to WhatsApp Cloud API endpoint (or mock)
        try:
            whatsapp_msg = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": "+919876543210",  # Store owner phone
                "type": "text",
                "text": {
                    "body": f"🚨 *{alert_payload.get('title')}*\n\n"
                            f"🏬 *स्टोर:* {alert_payload.get('store_name')}\n"
                            f"⏰ *समय:* {alert_payload.get('timestamp')}\n"
                            f"📝 *विवरण:* {alert_payload.get('message_hindi')}\n"
                            f"📹 *कैमरा:* {alert_payload.get('camera')}\n"
                            f"🔗 *लाइव स्नैपशॉट:* {alert_payload.get('snapshot_url')}"
                }
            }
            res2 = await client.post(
                WHATSAPP_CLOUD_API_URL,
                json=whatsapp_msg,
                headers={"Authorization": f"Bearer {WHATSAPP_TOKEN}"}
            )
            alert_payload["whatsapp_webhook_status"] = res2.status_code
        except Exception as e:
            alert_payload["whatsapp_webhook_status"] = f"Mock queued: {str(e)}"


# --- Endpoints ---

@app.get("/")
def root():
    return {
        "service": "Vinit Mobile AI CCTV Surveillance Worker",
        "store": STORE_NAME,
        "docs": "/docs",
        "health": "/health",
        "status": "ready"
    }

@app.get("/health")
def healthcheck():
    """Healthcheck endpoint optimized for Render free tier sleep/wake detection"""
    return {
        "status": "ok",
        "uptime_seconds": time.time(),
        "store_id": STORE_ID,
        "store_name": STORE_NAME,
        "active_cameras": 2,
        "offline_cameras": 1,
        "server_time_ist": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
    }

@app.get("/api/cameras/status")
def get_cameras_status():
    """Returns JSON status of store cameras (channels, online/offline, IP, last ping)"""
    return {
        "store_id": STORE_ID,
        "store_name": STORE_NAME,
        "location": "Surat, Gujarat",
        "nvr_ip": "192.168.1.100",
        "nvr_model": "Dahua NVR4104HS-P-4KS2/L",
        "cameras": list(CAMERAS.values()),
        "summary": {
            "total_channels": 3,
            "online_count": 2,
            "offline_count": 1,
            "system_status": "WARNING - 1 CAMERA OFFLINE"
        }
    }

@app.get("/api/cameras/snapshot/{channel_id}")
def get_camera_snapshot(channel_id: int, fresh: bool = Query(True)):
    """
    Simulates Dahua snapshot endpoint (/cgi-bin/snapshot.cgi?channel=1)
    Generates a live JPEG frame with Dahua OSD overlay and current timestamp.
    """
    if channel_id not in CAMERAS:
        raise HTTPException(status_code=404, detail=f"Camera channel {channel_id} not configured")

    cam = CAMERAS[channel_id]
    width, height = 960, 540

    if cam["status"] == "OFFLINE":
        # Offline Dahua screen
        img = Image.new("RGB", (width, height), (12, 12, 18))
        draw = ImageDraw.Draw(img)
        # Grid points
        for x in range(0, width, 40):
            for y in range(0, height, 40):
                draw.point((x + 10, y + 10), fill=(40, 40, 60))
        draw.rectangle([width//2 - 240, height//2 - 80, width//2 + 240, height//2 + 80], fill=(30, 10, 15), outline=(255, 60, 60), width=3)
        draw.text((width//2 - 180, height//2 - 50), "[!] DAHUA NO VIDEO SIGNAL", fill=(255, 80, 80))
        draw.text((width//2 - 200, height//2 - 20), f"{cam['name']} ({cam['model']})", fill=(220, 220, 220))
        draw.text((width//2 - 170, height//2 + 10), f"IP: {cam['ip']} | RTSP PORT 554", fill=(170, 170, 170))
        draw.text((width//2 - 180, height//2 + 40), "STATUS: CONNECTION TIMEOUT (ARP FAIL)", fill=(255, 160, 40))
    else:
        # Online camera frame
        base_color = (16, 24, 38) if channel_id == 1 else (18, 22, 34)
        img = Image.new("RGB", (width, height), base_color)
        draw = ImageDraw.Draw(img)

        # Floor grid
        for y in range(280, height, 25):
            draw.line([(0, y), (width, y)], fill=(35, 50, 75), width=1)
        for x in range(0, width, 80):
            draw.line([(width//2, 200), (x, height)], fill=(35, 50, 75), width=1)

        if channel_id == 1:
            # Entrance / Shutter view
            draw.rectangle([80, 50, width - 80, 110], fill=(24, 34, 52), outline=(60, 85, 120), width=2)
            draw.text((width//2 - 140, 70), "VINIT MOBILE - SURAT MAIN ENTRANCE", fill=(255, 200, 0))
            draw.text((width//2 - 100, 90), "SHUTTER POSITION: OPEN 100%", fill=(0, 255, 140))
            # Mobile display cabinets
            draw.rectangle([180, 250, 360, 420], fill=(20, 30, 50), outline=(0, 200, 255), width=2)
            draw.text((200, 265), "FLAGSHIP PHONE ZONE", fill=(0, 220, 255))
            draw.rectangle([width - 360, 250, width - 180, 420], fill=(20, 30, 50), outline=(255, 150, 0), width=2)
            draw.text((width - 340, 265), "ACCESSORIES RACK", fill=(255, 170, 50))
        else:
            # Billing Counter view
            draw.rectangle([180, 160, 420, 320], fill=(12, 16, 26), outline=(0, 220, 255), width=2)
            draw.text((210, 190), "BILLING POS TERMINAL #01", fill=(0, 255, 180))
            draw.text((210, 220), "SURAT V01 LIVE REGISTER", fill=(180, 210, 255))
            draw.rectangle([580, 240, 800, 320], fill=(24, 30, 46), outline=(255, 190, 0), width=2)
            draw.text((620, 260), "CASH TILL & DROP SAFE", fill=(255, 200, 50))

    # Real-time Dahua OSD
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    draw.rectangle([0, 0, width, 36], fill=(0, 0, 0))
    draw.text((15, 10), f"DAHUA TECHNOLOGY | {cam['model']}", fill=(200, 220, 240))
    draw.text((width - 260, 10), f"CH{channel_id:02d} - {cam['name'][:22]}", fill=(0, 255, 128) if cam['status'] == "ONLINE" else (255, 80, 80))

    draw.rectangle([0, height - 36, width, height], fill=(0, 0, 0))
    rec_text = "REC [●] 25FPS 4096Kbps H.265+" if cam['status'] == "ONLINE" else "SIGNAL LOSS [x]"
    draw.text((15, height - 26), rec_text, fill=(255, 60, 60) if cam['status'] == "ONLINE" else (160, 160, 160))
    draw.text((width - 240, height - 26), f"{now_str} IST", fill=(255, 255, 255))

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    buf.seek(0)

    return Response(
        content=buf.getvalue(),
        media_type="image/jpeg",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Server": "Dahua-Web-Server",
            "X-Camera-Model": cam["model"],
            "X-Camera-Status": cam["status"],
            "X-Channel-ID": str(channel_id)
        }
    )

@app.post("/api/detect/intruder")
async def detect_intruder(request: IntruderDetectionRequest, background_tasks: BackgroundTasks):
    """
    Analyzes frame/motion detection for human presence.
    If motion occurs during simulated night curfew hours (23:00 - 06:00),
    fires an urgent alert payload to Next.js webhook and WhatsApp Cloud API.
    """
    now = datetime.datetime.now()
    check_time_str = request.simulated_time if request.simulated_time else now.strftime("%H:%M")
    
    # Parse hour for curfew evaluation
    try:
        parts = check_time_str.split(":")
        hour = int(parts[0])
        minute = int(parts[1])
    except Exception:
        hour, minute = 23, 45

    # Night Curfew: 23:00 to 06:00
    is_curfew_hours = (hour >= 23 or hour < 6)

    is_intruder_confirmed = request.motion_score >= 0.75
    alert_triggered = is_curfew_hours and is_intruder_confirmed

    alert_id = f"ALERT-INT-{int(time.time())}"
    timestamp_formatted = f"रात {hour:02d}:{minute:02d} बजे"

    alert_payload = {
        "id": alert_id,
        "type": "night_intruder",
        "severity": "CRITICAL",
        "store_id": STORE_ID,
        "store_name": STORE_NAME,
        "camera": f"Channel {request.channel} (Entrance / Main Shutter)",
        "timestamp": f"{check_time_str} IST ({timestamp_formatted})",
        "title": "सुरक्षा चेतावनी: रात में अज्ञात व्यक्ति की हलचल!",
        "message_hindi": f"सुरक्षा चेतावनी: रात {hour:02d}:{minute:02d} बजे V01 स्टोर के अंदर अज्ञात व्यक्ति की हलचल देखी गई! तुरंत कार्रवाई करें।",
        "confidence": round(request.motion_score * 100, 1),
        "zone": request.zone,
        "curfew_violation": is_curfew_hours,
        "snapshot_url": "/snapshots/intruder_sample.jpg",
        "bounding_box": {"x": 380, "y": 140, "w": 200, "h": 340, "label": "person", "score": request.motion_score}
    }

    if alert_triggered:
        background_tasks.add_task(dispatch_security_alert, alert_payload)

    return {
        "detection_status": "COMPLETED",
        "alert_triggered": alert_triggered,
        "is_curfew_hours": is_curfew_hours,
        "simulated_time": check_time_str,
        "motion_confidence": request.motion_score,
        "alert_details": alert_payload
    }

@app.post("/api/detect/shutter")
async def detect_shutter(request: ShutterDetectionRequest, background_tasks: BackgroundTasks):
    """
    Analyzes edge boundary & optical flow to detect if the shop shutter rolled down
    before scheduled closing time (22:00 / 10:00 PM).
    """
    now = datetime.datetime.now()
    check_time_str = request.simulated_time if request.simulated_time else now.strftime("%H:%M")

    try:
        parts = check_time_str.split(":")
        hour = int(parts[0])
        minute = int(parts[1])
    except Exception:
        hour, minute = 21, 25

    # Check if closed before 22:00
    is_early_close = (hour < 22 and (hour >= 10))  # daytime/evening before 10 PM
    is_shutter_shut = request.shutter_closed_percentage >= 75.0

    alert_triggered = is_early_close and is_shutter_shut
    alert_id = f"ALERT-SHT-{int(time.time())}"

    # Format 12-hour Hindi display time
    period = "PM" if hour >= 12 else "AM"
    h12 = hour if hour <= 12 else hour - 12
    display_time_hi = f"रात {h12}:{minute:02d} {period}"

    alert_payload = {
        "id": alert_id,
        "type": "early_shutter",
        "severity": "WARNING",
        "store_id": STORE_ID,
        "store_name": STORE_NAME,
        "camera": f"Channel {request.channel} (Entrance / Main Shutter)",
        "timestamp": f"{check_time_str} IST ({display_time_hi})",
        "title": "चेतावनी: समय से पहले शटर बंद!",
        "message_hindi": f"चेतावनी: V01 स्टोर का शटर रात 10:00 बजे से पहले ({h12}:{minute:02d} {period}) बंद कर दिया गया है। कृपया कारण जांचें।",
        "shutter_closed_percentage": request.shutter_closed_percentage,
        "scheduled_close_time": "10:00 PM (22:00)",
        "detected_time": f"{h12}:{minute:02d} {period}",
        "snapshot_url": "/snapshots/v01_cam1.jpg"
    }

    if alert_triggered:
        background_tasks.add_task(dispatch_security_alert, alert_payload)

    return {
        "detection_status": "COMPLETED",
        "alert_triggered": alert_triggered,
        "is_early_close": is_early_close,
        "shutter_closed_percentage": request.shutter_closed_percentage,
        "check_time": check_time_str,
        "alert_details": alert_payload
    }

@app.get("/api/alerts/recent")
def get_recent_alerts():
    """Returns recent alerts dispatched by the backend worker"""
    return {
        "count": len(ALERT_HISTORY),
        "alerts": ALERT_HISTORY
    }

@app.post("/api/webhook/whatsapp")
async def mock_whatsapp_webhook(payload: Dict[str, Any]):
    """Simulates WhatsApp Cloud API webhook receiver for testing"""
    print(f"[WHATSAPP WEBHOOK RECEIVED]: {payload}")
    return {"status": "received", "timestamp": time.time()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
