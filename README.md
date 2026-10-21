# 📹 Vinit Mobile (Store V01 Surat) - AI CCTV & WhatsApp Automation System

Production-ready prototype for an intelligent retail surveillance system connecting on-premise Dahua CCTV cameras with a Next.js Dark Surveillance Dashboard and a Python FastAPI edge worker for automated Hindi WhatsApp alerts.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (Node 20+ recommended)
- **Python**: v3.10+ (tested on Python 3.11 & 3.14)

### 2. Run the Next.js Frontend
```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Run the Python FastAPI Backend (Local or Render)
```bash
# Navigate to backend directory
cd backend

# Install python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Open **[http://localhost:8000/docs](http://localhost:8000/docs)** for interactive Swagger API documentation.

---

## 🛠️ Features Breakdown

### 1. Store & Camera Overview (Store V01 Surat)
- **Store Location:** V01 - Surat Main Branch (Shop #12-14, Ghod Dod Road, Surat, Gujarat).
- **Channel 1 (Main Entrance & Shutter):** Online (Dahua IPC-HFW2431S-S2 4MP).
- **Channel 2 (Billing Counter & POS):** Online (Dahua IPC-HDW2431T-AS 4MP).
- **Channel 3 (Inventory Stock Room):** Offline (Dahua IPC-HFW1230S-S5) with PoE alert.
- **"Get Live Snapshot" Button:** Fetches Dahua snapshot frame with live OSD time overlay and opens the high-resolution Snapshot Inspector.

### 2. WhatsApp AI Chatbot (Full Hindi Output)
- Authentic WhatsApp Web interface with dark theme bubbles and checkmarks.
- Pre-configured quick-action chips:
  * *"क्या V01 शॉप का कैमरा ऑन है?"*
  * *"V01 की लाइव फोटो भेजो"*
  * *"कौन से कैमरे ऑफलाइन हैं?"*
  * *"शटर की क्या स्थिति है?"*
- Next.js API route (`/api/chat`) with Google Gemini integration & local Hindi rule engine fallback.
- **Tool-Calling:** Automatically detects snapshot requests and returns interactive camera image cards directly inside WhatsApp chat.

### 3. Automated Security Alerts Feed
- Real-time event log with categories:
  * **Early Shutter Closure:** e.g., *"चेतावनी: V01 स्टोर का शटर रात 10:00 बजे से पहले (9:25 PM) बंद कर दिया गया है।"*
  * **Night Intruder Detected:** e.g., *"सुरक्षा चेतावनी: रात 11:45 बजे V01 स्टोर के अंदर अज्ञात व्यक्ति की हलचल देखी गई!"*
  * **Camera Offline Alert:** Disconnection alert for Channel 3 Inventory Room.
- **"Simulate Webhook Alert" Button:** One-click trigger to demonstrate instant webhook ingestion, toast notifications, and WhatsApp dispatch.

### 4. Staff Face Attendance (Bonus)
- Dahua AI Face Recognition attendance table.
- Logs Staff Name, Role, In Time, Out Time, Face Thumbnail, and AI Confidence Score (97% - 99.4%).
- Interactive *"Simulate Face Check-In"* button.

### 5. Render & Vercel Deployment
- `backend/render.yaml`: Blueprint for 1-click deployment on Render free tier.
- `ARCHITECTURE.md`: Complete 1-page architecture guide with Dahua RTSP/CGI specs, 50-shop edge scaling strategy, and monthly cost analysis (₹40/mo for 1 store, ₹8,100/mo for 50 stores).

---

## 🔐 Environment Variables (`.env.example`)
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# FastAPI Backend URL
BACKEND_URL=https://your-render-service.onrender.com

# WhatsApp Cloud API credentials
WHATSAPP_TOKEN=your_whatsapp_token_here
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=vinit_mobile_cctv_webhook_secret

# Store Identification
STORE_ID=V01
STORE_NAME=Vinit Mobile - Store V01 Surat Main Branch
```
