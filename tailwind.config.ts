import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d1117",
        panel: "#161b22",
        panelAlt: "#111826",
        line: "#293444",
        text: "#e6edf3",
        muted: "#9aa7b8",
        accent: "#f7b84b",
        high: "#ef5a6f",
        normal: "#38c793",
      },
      boxShadow: {
        soft: "0 10px 24px rgba(0,0,0,.18)",
      },
    },
  },
  plugins: [],
};

export default config;

