"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Camera,
  CheckCheck,
  Phone,
  Video as VideoIcon,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Bot,
  Sparkles,
  Eye,
  Lock,
  MessageSquare,
  Bell,
} from "lucide-react";
import { CameraInfo, STORE_CAMERAS } from "@/lib/cameras";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  snapshotCard?: {
    channel: number;
    channelName: string;
    title: string;
    snapshotUrl: string;
    status: "ONLINE" | "OFFLINE";
    timestamp: string;
  };
}

interface WhatsAppChatProps {
  onOpenSnapshot: (cam: CameraInfo) => void;
}

export default function WhatsAppChat({ onOpenSnapshot }: WhatsAppChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-init-1",
      sender: "bot",
      text:
        "नमस्ते! 🙏 मैं आपका सुरक्षा सहायक (WhatsApp Bot) हूँ।\n\n" +
        "मैं कैमरों की स्थिति, शटर और सुरक्षा की जानकारी देता हूँ।\n\n" +
        "आप मुझसे हिंदी में कुछ भी पूछ सकते हैं या नीचे दिए गए विकल्पों में से चुन सकते हैं।",
      timestamp: "10:30 AM",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState("bot");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActionChips = [
    "क्या कैमरा ऑन है?",
    "लाइव फोटो भेजो",
    "कौन सा कैमरा बंद है?",
    "शटर की क्या स्थिति है?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean, human Hindi response generator without tech jargon / IPs / shop names
  const getCleanHindiResponse = (raw: string) => {
    const lower = raw.toLowerCase();
    const timeNow = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Photo / Snapshot request
    if (
      lower.includes("फोटो") ||
      lower.includes("photo") ||
      lower.includes("snapshot") ||
      lower.includes("तस्वीर") ||
      lower.includes("pic")
    ) {
      if (lower.includes("बिलिंग") || lower.includes("billing") || lower.includes("2")) {
        return {
          reply: `📸 *बिलिंग काउंटर का लाइव स्नैपशॉट:*\n\n📹 *कैमरा:* कैमरा 2 (बिलिंग काउंटर)\n🕒 *समय:* ${timeNow}\n✅ *स्थिति:* कैमरा सामान्य रूप से चालू है।\n\nनीचे फोटो कार्ड दिया गया है।`,
          snapshotCard: {
            channel: 2,
            channelName: "Camera 2 - Billing Counter",
            title: "बिलिंग काउंटर (लाइव फोटो)",
            snapshotUrl: "/snapshots/v01_cam2.jpg",
            status: "ONLINE" as const,
            timestamp: timeNow,
          },
        };
      }

      return {
        reply: `📸 *प्रवेश द्वार का लाइव स्नैपशॉट:*\n\n📹 *कैमरा:* कैमरा 1 (मुख्य प्रवेश द्वार व शटर)\n🕒 *समय:* ${timeNow}\n✅ *स्थिति:* कैमरा चालू है और शटर खुला हुआ है।\n\nनीचे फोटो कार्ड दिया गया है।`,
        snapshotCard: {
          channel: 1,
          channelName: "Camera 1 - Entrance & Shutter",
          title: "मुख्य प्रवेश द्वार (लाइव फोटो)",
          snapshotUrl: "/snapshots/v01_cam1.jpg",
          status: "ONLINE" as const,
          timestamp: timeNow,
        },
      };
    }

    // 2. Offline camera query
    if (
      lower.includes("ऑफलाइन") ||
      lower.includes("offline") ||
      lower.includes("बंद") ||
      lower.includes("खराब")
    ) {
      return {
        reply: `⚠️ *बंद कैमरों की स्थिति:*\n\nकुल *3* में से *1 कैमरा बंद* है:\n\n🔴 *कैमरा 3 (इन्वेंटरी रूम):* ऑफलाइन (केबल या पावर कनेक्शन जांचें)\n\n✅ *कैमरा 1 (प्रवेश द्वार)* और *कैमरा 2 (बिलिंग काउंटर)* सामान्य रूप से चालू हैं।`,
        snapshotCard: {
          channel: 3,
          channelName: "Camera 3 - Inventory Room",
          title: "इन्वेंटरी रूम (ऑफलाइन)",
          snapshotUrl: "/snapshots/v01_cam3.jpg",
          status: "OFFLINE" as const,
          timestamp: "सिग्नल नहीं आ रहा",
        },
      };
    }

    // 3. Camera On / Status Query
    if (
      lower.includes("कैमरा") ||
      lower.includes("camera") ||
      lower.includes("ऑन") ||
      lower.includes("चालू") ||
      lower.includes("status")
    ) {
      return {
        reply: `📹 *कैमरा स्थिति रिपोर्ट:*\n\nहाँ, मुख्य कैमरे चालू हैं:\n\n1️⃣ *कैमरा 1 (प्रवेश द्वार व शटर):* ✅ चालू (Online)\n2️⃣ *कैमरा 2 (बिलिंग काउंटर):* ✅ चालू (Online)\n3️⃣ *कैमरा 3 (इन्वेंटरी रूम):* ⚠️ बंद (Offline)\n\n📊 कुल 2 कैमरे सक्रिय हैं और रिकॉर्डिंग चालू है।`,
      };
    }

    // 4. Shutter Query
    if (lower.includes("शटर") || lower.includes("shutter") || lower.includes("दुकान")) {
      return {
        reply: `🏬 *शटर और समय स्थिति:*\n\n• *दुकान बंद होने का समय:* रात 10:00 बजे\n• *वर्तमान स्थिति:* शटर पूरी तरह खुला हुआ है ✅\n• *अलर्ट सिस्टम:* यदि 10:00 बजे से पहले शटर बंद होता है, तो तुरंत सूचना भेजी जाएगी।`,
      };
    }

    // 5. Default
    return {
      reply: `नमस्ते! 🙏 मैं आपका सुरक्षा सहायक हूँ।\n\nआप निम्न जानकारी ले सकते हैं:\n• 📸 *लाइव फोटो* मंगाना\n• 📹 *कैमरा चालू/बंद* देखना\n• 🔒 *शटर की स्थिति* जांचना\n\nनीचे दिए गए विकल्पों पर क्लिक करें।`,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userTimestamp = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error("API response error");

      const data = await res.json();
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: data.reply || getCleanHindiResponse(text).reply,
        timestamp: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        snapshotCard: data.snapshotCard || getCleanHindiResponse(text).snapshotCard,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Guaranteed instant client fallback
      const fallback = getCleanHindiResponse(text);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        snapshotCard: fallback.snapshotCard,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnapshotCardClick = (card: NonNullable<Message["snapshotCard"]>) => {
    const matched = STORE_CAMERAS.find((c) => c.channel === card.channel) || STORE_CAMERAS[0];
    onOpenSnapshot(matched);
  };

  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split("\n");
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*[^*]+\*)/g);
      return (
        <div key={lIdx} className="min-h-[1.2rem]">
          {parts.map((part, pIdx) => {
            if (part.startsWith("*") && part.endsWith("*")) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-900">
                  {part.slice(1, -1)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex h-[calc(100vh-65px)] w-full bg-white overflow-hidden font-sans border-t border-slate-200">
      {/* WhatsApp Sidebar (Clean Light Theme) */}
      <div className="hidden md:flex flex-col w-80 lg:w-96 bg-white border-r border-slate-200">
        {/* Sidebar Header */}
        <div className="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-slate-800">WhatsApp</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <MoreVertical className="h-4 w-4" />
          </div>
        </div>

        {/* Sidebar Search Bar */}
        <div className="p-2.5 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs text-slate-500">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none w-full text-xs"
            />
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {/* Active Bot Chat */}
          <div
            onClick={() => setActiveChat("bot")}
            className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${
              activeChat === "bot" ? "bg-slate-100" : "hover:bg-slate-50"
            }`}
          >
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-sm">
                <Bot className="h-6 w-6" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate">
                  सुरक्षा सहायक (Security Bot)
                </span>
                <span className="text-[10px] text-slate-400">10:30 AM</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                लाइव मॉनिटरिंग चालू • हिंदी में सहायता
              </p>
            </div>
          </div>

          {/* Group 2: Security Alerts */}
          <div
            onClick={() => setActiveChat("alerts")}
            className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${
              activeChat === "alerts" ? "bg-slate-100" : "hover:bg-slate-50"
            }`}
          >
            <div className="h-11 w-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  सुरक्षा अलर्ट (Security Alerts)
                </span>
                <span className="text-[10px] text-slate-400">09:25 PM</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                समय से पहले शटर बंद होने की सूचना
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main WhatsApp Chat Window (Authentic WhatsApp Light Theme) */}
      <div className="flex-1 flex flex-col h-full bg-[#efeae2]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f0f2f5] border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884] text-white font-bold shadow-sm">
              <Bot className="h-5 w-5" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                सुरक्षा सहायक (Security Assistant)
              </h3>
              <p className="text-xs text-[#00a884] font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Online
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 text-slate-600">
            <button title="Search Chat" className="hover:text-slate-900 transition">
              <Search className="h-4 w-4" />
            </button>
            <button title="Options" className="hover:text-slate-900 transition">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Action Chips Bar */}
        <div className="px-4 py-2 bg-white/95 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            सुझाव:
          </span>
          {quickActionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 transition active:scale-95 disabled:opacity-50 shadow-xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Messages Body with Light Wallpaper */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5 whatsapp-light-bg">
          {/* Date Stamp */}
          <div className="flex justify-center my-1">
            <span className="px-3 py-1 rounded-md bg-white text-[11px] text-slate-600 shadow-xs border border-slate-200">
              आज (TODAY)
            </span>
          </div>

          {/* Encryption Notice */}
          <div className="flex justify-center mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ffeecd] text-[11px] text-slate-700 shadow-xs border border-[#ffd279]/40 max-w-sm text-center">
              <Lock className="h-3 w-3 text-slate-700" />
              <span>संदेश एंड-टू-एंड एनक्रिप्टेड हैं।</span>
            </div>
          </div>

          {/* Message List */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-xs ${
                  msg.sender === "user"
                    ? "bg-[#d9fdd3] text-slate-900 rounded-tr-none border border-[#c1f5b8]"
                    : "bg-white text-slate-900 rounded-tl-none border border-slate-200/80"
                }`}
              >
                {/* Text Content */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {renderFormattedText(msg.text)}
                </div>

                {/* Attached Snapshot Card */}
                {msg.snapshotCard && (
                  <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => handleSnapshotCardClick(msg.snapshotCard!)}
                    >
                      <img
                        src={msg.snapshotCard.snapshotUrl}
                        alt={msg.snapshotCard.title}
                        className="w-full h-48 object-cover transition group-hover:scale-102"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                        <span>{msg.snapshotCard.status}</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-md">
                          <Eye className="h-3.5 w-3.5" />
                          बड़ी फोटो देखें
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 flex items-center justify-between text-xs bg-slate-50 border-t border-slate-100">
                      <div>
                        <p className="font-semibold text-slate-800">{msg.snapshotCard.title}</p>
                        <p className="text-[11px] text-slate-500">
                          समय: {msg.snapshotCard.timestamp}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSnapshotCardClick(msg.snapshotCard!)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs transition font-medium"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        देखें
                      </button>
                    </div>
                  </div>
                )}

                {/* Timestamp & Read Receipts */}
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    msg.sender === "user" ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === "user" && (
                    <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start">
              <div className="rounded-2xl rounded-tl-none bg-white p-3 border border-slate-200 text-slate-600 text-xs flex items-center gap-2 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-slate-500 ml-1">
                  सहायक टाइप कर रहा है...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Input Footer */}
        <div className="p-3 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            title="Attach"
            className="p-2 text-slate-500 hover:text-slate-700 transition"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="हिंदी में संदेश लिखें (उदा. 'लाइव फोटो भेजो')..."
              className="flex-1 bg-white text-slate-900 placeholder:text-slate-400 text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#00a884] focus:outline-none transition shadow-xs"
            />

            {inputText.trim() ? (
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884] hover:bg-[#029070] text-white transition active:scale-95 shadow-sm disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSendMessage("लाइव फोटो भेजो")}
                title="Quick Live Photo"
                className="p-2 text-slate-500 hover:text-emerald-700 transition"
              >
                <Camera className="h-5 w-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
