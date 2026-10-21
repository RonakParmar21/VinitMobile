import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CCTV Monitoring & WhatsApp Assistant",
  description:
    "Smart surveillance dashboard and WhatsApp automation system with live camera snapshots, security alerts, and attendance tracking.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
