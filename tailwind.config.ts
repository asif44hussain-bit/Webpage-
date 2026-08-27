import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121212",
        paper: "#F4F2ED",
        concrete: "#C9C4B8",
        "concrete-dark": "#8B8676",
        signal: "#FF4B1F",
        volt: "#DFFF3D",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        widest2: "0.28em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stamp: {
          "0%": { opacity: "0", transform: "scale(1.4) rotate(-12deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-12deg)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        fadeUp: "fadeUp 0.6s ease-out both",
        stamp: "stamp 0.4s cubic-bezier(0.2,0.8,0.2,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
