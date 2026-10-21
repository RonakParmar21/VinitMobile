# 📐 SYSTEM ARCHITECTURE & SCALING BLUEPRINT
**Project:** Vinit Mobile - Store V01 Surat (AI CCTV Monitoring & WhatsApp Automation)  
**Target Hardware:** Dahua NVR4104HS-P-4KS2/L & IPC-HFW2431S-S2 / IPC-HDW2431T  
**Deployment Platform:** Next.js on Vercel + FastAPI on Render  

---

## 1. DAHUA HARDWARE INTEGRATION

The system connects directly to on-premise Dahua IP cameras and NVRs without requiring proprietary vendor cloud subscriptions or lock-in.

```
                    ┌──────────────────────────────────────────────┐
                    │          DAHUA HARDWARE (STORE V01)          │
                    │                                              │
                    │  [CH01: Entrance IPC-HFW2431S 4MP]           │
                    │  [CH02: Billing IPC-HDW2431T 4MP]            │
                    │  [CH03: Inventory IPC-HFW1230S 2MP]          │
                    │                    │                         │
                    │       4-Port PoE Switch / NVR                │
                    │           (192.168.1.100)                    │
                    └──────────────────┬───────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     RTSP STREAM INGESTION     │             │    HTTP CGI SNAPSHOT API      │
│  (Real-Time Motion/YOLO)      │             │  (On-Demand Verification)     │
└───────────────┬───────────────┘             └───────────────┬───────────────┘
                │                                             │
                ▼                                             ▼
  rtsp://admin:pass@ip:554/cam/realmonitor      http://ip:port/cgi-bin/snapshot.cgi
  ?channel=1&subtype=0                          ?channel=1
```

### 1.1 Direct RTSP Stream Ingestion
- **Primary Main Stream (High Resolution 4MP for Detection & Archival):**
  ```text
  rtsp://<username>:<password>@<camera_ip>:554/cam/realmonitor?channel=<ch>&subtype=0
  ```
  * Codec: H.265+ Smart Codec
  * Resolution: 2688x1520 @ 25fps, 4096 Kbps
  * Used for: Edge YOLOv8 human detection during curfew hours (23:00 - 06:00) and edge boundary analysis for shutter closure.

- **Secondary Sub Stream (Low Bitrate for Remote WhatsApp & Mobile Previews):**
  ```text
  rtsp://<username>:<password>@<camera_ip>:554/cam/realmonitor?channel=<ch>&subtype=1
  ```
  * Codec: H.264
  * Resolution: 704x576 (D1) @ 15fps, 512 Kbps
  * Used for: Fast remote preview without saturating store uplink broadband.

### 1.2 Dahua HTTP CGI Snapshot API
Dahua cameras expose an instantaneous HTTP JPEG extraction endpoint via basic HTTP Digest authentication:
```http
GET http://192.168.1.101/cgi-bin/snapshot.cgi?channel=1 HTTP/1.1
Authorization: Digest username="admin", realm="Login to Dahua", ...
```
- **Response:** `image/jpeg` payload (typical size: ~45KB - 85KB).
- **Latency:** ~120ms - 250ms roundtrip.
- **Advantage:** Enables Next.js and WhatsApp bots to grab a crystal-clear frozen frame on demand without maintaining an open RTSP connection.

---

## 2. 50-SHOP SCALING STRATEGY: EDGE VS. CENTRALIZED CLOUD

Scaling from Store V01 Surat to 50 retail stores across Gujarat poses significant architectural choices regarding bandwidth and compute.

### 2.1 The Cloud Bottleneck (Why Centralized Cloud Streaming Fails)
- **Bandwidth Consumption:**
  * 3 cameras per store @ 4Mbps = 12 Mbps constant upstream bandwidth per store.
  * For 50 stores: $50 \times 12\text{ Mbps} = 600\text{ Mbps}$ continuous cloud ingest.
  * Monthly Data Volume: $600\text{ Mbps} \times 3600 \times 24 \times 30 \approx 194\text{ Terabytes / month}$.
  * Cloud ingress / egress bandwidth bill on AWS/GCP would exceed **$1,800 to $3,500/month**.
  * Any ISP glitch or broadband fiber cut in a retail mall drops all security intelligence.

### 2.2 The Winning Strategy: Local Edge Mini PC / Raspberry Pi
Install a low-cost Edge Appliance at each retail branch:
- **Hardware:** Intel N100 Mini PC (8GB RAM, 128GB SSD ~ ₹9,500 / $115) OR Raspberry Pi 5 with Coral TPU (~ ₹6,500 / $80).
- **Operation:**
  1. Runs local Python OpenCV + YOLOv8 nano / MobileNetV4.
  2. Analyzes local RTSP feeds at 5 FPS (sufficient for intrusion and shutter motion).
  3. When an event occurs (e.g., Night Intrusion at 23:45 or Early Shutter at 21:25), the edge device grabs a Dahua snapshot frame (~60KB) and sends an async HTTP POST webhook to the cloud worker.
- **Bandwidth Required:** **0 kbps idle**. Only ~60KB per alert event!
- **Zero Internet Downtime Failure:** If store internet goes down, local alarm buzzer fires, and events are queued until internet recovers.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EACH STORE BRANCH (x50)                         │
│                                                                        │
│   [Dahua Cameras] ---> [Local Switch] ---> [Edge Mini PC / RPi 5]     │
│                                                   │                    │
│                                            YOLOv8 Nano Local           │
│                                            (Zero Bandwidth Cost)       │
└───────────────────────────────────────────────────┼────────────────────┘
                                                    │
                                     Only Alert Payloads + Snapshot (60KB)
                                                    │
                                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         CENTRALIZED CLOUD LAYER                        │
│                                                                        │
│  [Render FastAPI Worker]  ──►  [Vercel Next.js]  ──►  [WhatsApp API]  │
│  (Alert Dispatcher)            (Admin Dashboard)     (Store Owners)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. MONTHLY COST BREAKDOWN (INR / USD)

Detailed infrastructure cost analysis using free tiers and pay-as-you-go serverless models:

### 3.1 Single Store (V01 Surat - Prototype / Pilot)

| Component | Provider & Tier | Details | Monthly Cost (INR) | Monthly Cost (USD) |
| :--- | :--- | :--- | :---: | :---: |
| **Frontend Surveillance Dashboard** | Vercel Hobby Tier | Next.js App Router, SSR, Global Edge CDN | **₹0** | **$0.00** |
| **Backend Worker & API** | Render Free Web Service | FastAPI, 512MB RAM, Auto-sleep/wake | **₹0** | **$0.00** |
| **WhatsApp Automation** | Meta WhatsApp Cloud API | Free Tier includes **1,000 service conversations/month** | **₹0** | **$0.00** |
| **Conversational Hindi AI** | Google Gemini 1.5 Flash | $0.075 / 1M input tokens (~200 queries/day) | **₹40** | **$0.50** |
| **Total Monthly Recurring Cost** | | | **₹40 / mo** | **~$0.50 / mo** |

*Note: Edge hardware is already present (store billing PC or ₹6,500 one-off Raspberry Pi).*

---

### 3.2 Full 50-Store Retail Chain Scale

| Component | Infrastructure Plan | Sizing & Throughput | Monthly Cost (INR) | Monthly Cost (USD) |
| :--- | :--- | :--- | :---: | :---: |
| **Next.js Dashboard** | Vercel Pro | Unlimited team seats, 1TB bandwidth, 99.99% SLA | ₹1,650 | $20.00 |
| **FastAPI Backend Cluster** | Render Starter Tier | 1GB RAM, 1 CPU, 24/7 background worker, zero sleep | ₹2,050 | $25.00 |
| **WhatsApp Cloud API** | Meta WhatsApp Business | 50 stores × 40 alerts/mo = 2,000 alert convs (1,000 free, 1,000 billed @ ₹0.40/utility msg) | ₹3,200 | $38.50 |
| **Google Gemini 1.5 Flash** | Pay-as-you-go | ~15,000 Hindi assistant interactions across 50 stores | ₹1,200 | $14.50 |
| **Edge Hardware (Amortized)** | 50 × Intel N100 Mini PCs | One-off capital expense: ₹4,75,000 (3-year depreciation: ~₹13,200/mo) | *Capital Expense* | *Capital Expense* |
| **TOTAL RECURRING MONTHLY** | **50 Stores Fully Automated** | | **₹8,100 / mo** | **~$98.00 / mo** |

> 💡 **Cost Efficiency:** Running 50 physical stores on this architecture costs **₹162 ($1.96) per store / month**, saving over 95% compared to commercial CCTV SaaS solutions (like Verkada or Eagle Eye at $40+/camera/month).

---

## 4. SECURITY & COMPLIANCE
1. **Network Segregation:** Dahua cameras sit on isolated surveillance VLAN (e.g., `192.168.1.0/24`) with outbound internet blocked; only the Edge Gateway communicates outward.
2. **End-to-End Encryption:** All alerts dispatched to WhatsApp use TLS 1.3 and SHA-256 HMAC signature verification on webhook receivers.
3. **Audit Trail:** Timestamped snapshots provide forensic proof for insurance claims regarding early shutter closure or night break-ins.
