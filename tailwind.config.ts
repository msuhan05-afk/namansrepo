import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./sections/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.45rem",
        sm: "0.35rem",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(34, 34, 34, 0.08)",
        lift: "0 22px 60px rgba(46, 125, 50, 0.18)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        steam: {
          "0%": { transform: "translateY(0) scaleX(0.8)", opacity: "0" },
          "30%": { opacity: "0.6" },
          "100%": { transform: "translateY(-28px) scaleX(1.1)", opacity: "0" },
        },
        "lamp-glow": {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "60%": { opacity: "0.18", transform: "scale(1.1)" },
          "100%": { opacity: "0.13", transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        steam: "steam 2.4s ease-out infinite",
        "lamp-glow": "lamp-glow 2s ease forwards",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
