import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        bg: "#0F0F13",
        panel: "#151821",
        panelAlt: "#1B1F2A",
        line: "#2A3142",
        text: "#F4F6FA",
        muted: "#9EA8BF",
        accent: "#5E6AD2",
        accentAlt: "#7E8BFF",
        high: "#E46E88",
        normal: "#46C09A",
      },
      boxShadow: {
        soft: "0 14px 28px rgba(4, 8, 20, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;