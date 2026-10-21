# 🚀 100% FREE Full-Stack Deployment Guide

This guide walks you through deploying both the **Next.js Frontend (on Vercel)** and the **Python FastAPI Backend (on Render)** completely **free of cost**, with zero credit card required.

---

## 📌 Architecture at a Glance
```
[User Browser]
      │
      ▼
[Vercel (Free)] ──────────► [Render (Free)]
Next.js App Router            FastAPI Backend Worker
(https://your-app.vercel.app) (https://your-backend.onrender.com)
```

---

## STEP 1: Push Project to GitHub (Free)

1. Open your terminal in this project folder (`e:\Freelancing\New folder`).
2. Initialize git and commit:
```bash
git init
git add .
git commit -m "Initial commit: full-stack CCTV monitoring system"
```

3. Go to **[github.com/new](https://github.com/new)** and create a new **Public** or **Private** repository (e.g., `cctv-monitoring-system`).
4. Link your local project to GitHub and push:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cctv-monitoring-system.git
git push -u origin main
```

---

## STEP 2: Deploy Python FastAPI Backend on Render (100% Free)

1. Go to **[render.com](https://render.com)** and create a free account (Sign in with GitHub).
2. On your Render dashboard, click **"New +"** ➔ select **"Web Service"**.
3. Select **"Build and deploy from a Git repository"** and choose your repository (`cctv-monitoring-system`).
4. Fill in the following settings:
   - **Name:** `vinit-cctv-backend` (or any unique name)
   - **Region:** `Singapore` (Fastest latency for India/Surat)
   - **Root Directory:** `backend`  *(⚠️ Important: type `backend`)*
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free` ($0/month)
5. Scroll down to **"Environment Variables"** and click **"Add Environment Variable"**:
   - `PYTHON_VERSION` = `3.11.8`
6. Click **"Deploy Web Service"**.
7. Once deployed, Render will give you a live URL, for example:  
   👉 **`https://vinit-cctv-backend.onrender.com`**
8. Test your backend: open `https://vinit-cctv-backend.onrender.com/health` in your browser. You should see `{"status": "ok"}`!

---

## STEP 3: Deploy Next.js Frontend on Vercel (100% Free)

1. Go to **[vercel.com](https://vercel.com)** and sign in with your GitHub account.
2. Click **"Add New..."** ➔ **"Project"**.
3. Import your GitHub repository (`cctv-monitoring-system`).
4. In the Project Configuration screen:
   - **Framework Preset:** `Next.js` (detected automatically)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `next build` (leave default)
5. Expand the **"Environment Variables"** section and add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `BACKEND_URL` | `https://vinit-cctv-backend.onrender.com` | Your Render URL from Step 2 |
   | `GEMINI_API_KEY` | *(Optional)* | Your free Gemini key from Google AI Studio |
   | `WHATSAPP_TOKEN` | `mock_token_demo` | Can be any string for demo |
6. Click **"Deploy"**.
7. In about 60 seconds, your site will be live at:  
   👉 **`https://your-project-name.vercel.app`**

---

## STEP 4: Connect Backend Webhook to Vercel (2 Minutes)

Now connect Render's alert dispatcher to your live Vercel URL:
1. Go back to your **Render Dashboard** ➔ select `vinit-cctv-backend`.
2. Go to **Environment** tab on the left.
3. Add or update this environment variable:
   - `NEXTJS_WEBHOOK_URL` = `https://your-project-name.vercel.app/api/alerts`
4. Click **"Save Changes"** (Render will automatically redeploy with the new setting).

---

## STEP 5 (Optional): Get a Free Gemini API Key (60 Seconds)

To enable live Google Gemini AI in the WhatsApp chatbot:
1. Go to **[aistudio.google.com](https://aistudio.google.com/)** and sign in with your Google account.
2. Click **"Get API key"** ➔ click **"Create API key"**.
3. Copy your key.
4. In your **Vercel Project Settings** ➔ **Environment Variables**:
   - Set `GEMINI_API_KEY` = your copied key.
   - Click Save and Redeploy.

*(Note: Even without a key, the WhatsApp Bot will continue to function using the built-in natural Hindi engine!)*

---

## 🎯 Verification Checklist

- [ ] Open your live Vercel URL (`https://your-app.vercel.app`)
- [ ] Cameras feed loads with live snapshots
- [ ] Click "WhatsApp Bot" ➔ full-screen WhatsApp Web interface opens
- [ ] Send *"क्या कैमरा ऑन है?"* or click *"लाइव फोटो भेजो"* ➔ Bot responds in Hindi
- [ ] Click "Simulate Alert" ➔ alert notification pops up in real-time
