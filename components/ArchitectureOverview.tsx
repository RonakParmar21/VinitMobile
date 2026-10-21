"use client";

import React from "react";
import {
  Cpu,
  Server,
  DollarSign,
  Network,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function ArchitectureOverview() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-surveillance-surface to-surveillance-surface p-6 shadow-xl">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              System Architecture & 50-Shop Scaling Strategy
            </h2>
            <p className="text-xs text-slate-400">
              Vinit Mobile Retail Chain • Edge AI Inference + Dahua CGI + WhatsApp Automation
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Dahua Hardware Integration */}
        <div className="rounded-2xl border border-surveillance-border bg-surveillance-surface p-5 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <Network className="h-4 w-4" />
            1. Dahua Ingestion
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct dual-pipeline ingestion from Dahua IPC & NVR hardware without proprietary SDK locks:
          </p>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-slate-300">
              <span className="text-[10px] text-slate-500 block uppercase">Continuous Video Stream</span>
              <code className="text-cyan-300 text-[11px] break-all">
                rtsp://user:pass@ip:554/cam/realmonitor?channel=1&subtype=0
              </code>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-slate-300">
              <span className="text-[10px] text-slate-500 block uppercase">Instant HTTP Snapshot CGI</span>
              <code className="text-amber-300 text-[11px] break-all">
                http://ip:port/cgi-bin/snapshot.cgi?channel=1
              </code>
            </div>
          </div>
          <ul className="text-xs text-slate-400 space-y-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Sub-second live JPEG snapshot retrieval
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Subtype 1 sub-stream for low-bandwidth mobile
            </li>
          </ul>
        </div>

        {/* Pillar 2: 50-Shop Edge vs Cloud Scaling */}
        <div className="rounded-2xl border border-surveillance-border bg-surveillance-surface p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <Zap className="h-4 w-4" />
            2. Edge AI (50 Stores)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Centralized 24/7 video streaming to cloud for 50 stores would saturate retail broadband and cost $1,800+/mo in cloud ingress:
          </p>
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
            <div className="font-bold text-emerald-300 flex items-center justify-between">
              <span>Selected Architecture:</span>
              <span className="font-mono text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">EDGE INFERENCE</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Raspberry Pi 5 ($60) or Intel N100 Mini PC ($110) per store runs YOLOv8 nano locally. Cloud bandwidth is <strong>ZERO</strong> until an alert fires.
            </p>
          </div>
          <ul className="text-xs text-slate-400 space-y-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              100% offline resilient detection
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Only 50KB JPEG metadata uploaded on alerts
            </li>
          </ul>
        </div>

        {/* Pillar 3: WhatsApp Cloud API & Gemini */}
        <div className="rounded-2xl border border-surveillance-border bg-surveillance-surface p-5 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
            <Layers className="h-4 w-4" />
            3. WhatsApp & Gemini
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Meta WhatsApp Cloud API integration with Google Gemini 1.5 Flash for natural Hindi conversational query handling:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800">
              <span className="text-purple-300 font-semibold block">Tool-Calling Pipeline:</span>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Translates Hindi questions ("फोटो भेजो") into Dahua camera status/snapshot tool calls with image cards.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800">
              <span className="text-whatsapp-green font-semibold block">Zero App Download:</span>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Store owners monitor security natively on WhatsApp without installing extra CCTV apps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <div className="rounded-2xl border border-surveillance-border bg-surveillance-surface overflow-hidden shadow-xl">
        <div className="p-4 bg-surveillance-bg/90 border-b border-surveillance-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Production Monthly Cost Breakdown (1 Store vs 50 Stores)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            INR / USD
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surveillance-bg/50 text-[11px] font-mono uppercase text-slate-400 border-b border-surveillance-border">
              <tr>
                <th className="px-5 py-3">Infrastructure Component</th>
                <th className="px-4 py-3">Tier / Service Plan</th>
                <th className="px-4 py-3">1 Store Cost (Mo)</th>
                <th className="px-4 py-3">50 Stores Cost (Mo)</th>
                <th className="px-4 py-3 text-right">Optimization Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surveillance-border/50 font-mono text-[11px]">
              <tr className="hover:bg-slate-800/20">
                <td className="px-5 py-3 font-sans font-medium text-white">
                  Next.js Surveillance Dashboard
                </td>
                <td className="px-4 py-3 text-cyan-300">Vercel Hobby / Pro</td>
                <td className="px-4 py-3 text-emerald-400">₹0 ($0.00)</td>
                <td className="px-4 py-3 text-slate-200">₹1,650 ($20.00)</td>
                <td className="px-4 py-3 text-right font-sans text-slate-400">
                  Global edge CDN & serverless API routes
                </td>
              </tr>

              <tr className="hover:bg-slate-800/20">
                <td className="px-5 py-3 font-sans font-medium text-white">
                  FastAPI Backend & Detection Worker
                </td>
                <td className="px-4 py-3 text-cyan-300">Render Free / Starter</td>
                <td className="px-4 py-3 text-emerald-400">₹0 ($0.00)</td>
                <td className="px-4 py-3 text-slate-200">₹2,050 ($25.00)</td>
                <td className="px-4 py-3 text-right font-sans text-slate-400">
                  Auto-sleep on free tier; 512MB RAM sufficient
                </td>
              </tr>

              <tr className="hover:bg-slate-800/20">
                <td className="px-5 py-3 font-sans font-medium text-white">
                  WhatsApp Cloud API (Meta)
                </td>
                <td className="px-4 py-3 text-cyan-300">1,000 Free Service Conv/mo</td>
                <td className="px-4 py-3 text-emerald-400">₹0 ($0.00)</td>
                <td className="px-4 py-3 text-slate-200">₹3,200 ($38.50)</td>
                <td className="px-4 py-3 text-right font-sans text-slate-400">
                  Free tier covers 1,000 incoming user inquiries
                </td>
              </tr>

              <tr className="hover:bg-slate-800/20">
                <td className="px-5 py-3 font-sans font-medium text-white">
                  Google Gemini 1.5 Flash (Hindi AI)
                </td>
                <td className="px-4 py-3 text-cyan-300">Pay-as-you-go</td>
                <td className="px-4 py-3 text-emerald-400">₹40 ($0.50)</td>
                <td className="px-4 py-3 text-slate-200">₹1,200 ($14.50)</td>
                <td className="px-4 py-3 text-right font-sans text-slate-400">
                  $0.075 / 1M input tokens with local cache
                </td>
              </tr>

              <tr className="hover:bg-slate-800/20">
                <td className="px-5 py-3 font-sans font-medium text-white">
                  Store Edge Hardware (One-Time)
                </td>
                <td className="px-4 py-3 text-cyan-300">Raspberry Pi 5 / Mini PC</td>
                <td className="px-4 py-3 text-slate-200">₹6,500 (1-time)</td>
                <td className="px-4 py-3 text-slate-200">₹3,25,000 (1-time)</td>
                <td className="px-4 py-3 text-right font-sans text-slate-400">
                  Eliminates ₹1,50,000/mo cloud streaming bills
                </td>
              </tr>

              <tr className="bg-emerald-950/20 font-bold">
                <td className="px-5 py-3 font-sans text-emerald-300">
                  TOTAL RECURRING MONTHLY COST
                </td>
                <td className="px-4 py-3 text-slate-400">All Included</td>
                <td className="px-4 py-3 text-emerald-400 text-sm">
                  ₹40 / mo (~$0.50)
                </td>
                <td className="px-4 py-3 text-emerald-300 text-sm">
                  ₹8,100 / mo (~$98.00)
                </td>
                <td className="px-4 py-3 text-right font-sans text-emerald-400">
                  Only ₹162 ($1.96) per store / month!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
