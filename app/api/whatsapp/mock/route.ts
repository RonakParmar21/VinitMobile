import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[WhatsApp Mock API received message]:", body);
    return NextResponse.json({
      status: "sent",
      message_id: `wamid.HBgM${Date.now()}`,
      recipient: body.to || "+919876543210",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ status: "error", error: err.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  // Webhook verification endpoint for Meta WhatsApp Cloud API
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === "vinit_mobile_cctv_webhook_secret") {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ status: "WhatsApp Webhook Listener Active" });
}
