import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surveillance: {
          bg: "#070a12",
          surface: "#0d1322",
          card: "#121b2f",
          border: "#1e2c4a",
          accent: "#00f0a8",
        },
        whatsapp: {
          dark: "#0b141a",
          header: "#202c33",
          incoming: "#202c33",
          outgoing: "#005c4b",
          green: "#25d366",
          teal: "#00a884",
          badge: "#25d366",
          border: "#2a3942",
        },
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
        "radar-sweep": "radar 4s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
