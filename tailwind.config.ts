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
        collab: {
          yellow: "#FEE74B",
          "yellow-light": "#FFF8D6",
          dark: "#1A1A1A",
          gray: "#F4F4F5",
          charcoal: "#2D2D2D",
        },
        brand: {
          primary: "#2563EB",
          secondary: "#1D4ED8",
          container: "#2563EB",
          "container-secondary": "#3B82F6",
        },
        primary: {
          50: "#EFF6FF",
          100: "#EBF2FF",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#2563EB",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        accent: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        warning: {
          500: "#F59E0B",
        },
        danger: {
          500: "#EF4444",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#f8f9fa",
          100: "#f3f4f5",
          200: "#e1e3e4",
          400: "#767586",
          600: "#464554",
          800: "#191c1d",
          900: "#111827",
          950: "#0B0F19",
        },
        surface: {
          DEFAULT: "#f8f9fa",
          dark: "#2e3132",
          glass: "rgba(255, 255, 255, 0.7)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(37, 99, 235, 0.35)",
        "glow-sm": "0 8px 32px 0 rgba(37, 99, 235, 0.06)",
        card: "0 4px 24px -4px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 12px 40px -8px rgba(37, 99, 235, 0.1)",
        glass: "0 8px 32px 0 rgba(37, 99, 235, 0.05)",
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(at 0% 0%, rgba(37,99,235,0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(59,130,246,0.06) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(37,99,235,0.05) 0px, transparent 50%)",
        "mesh-dashboard":
          "radial-gradient(at 0% 0%, rgba(37,99,235,0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(59,130,246,0.04) 0px, transparent 50%)",
        "gradient-brand": "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
        "gradient-cta": "linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)",
        "gradient-dark": "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
        "gradient-primary-btn": "linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)",
        "gradient-collab-yellow": "linear-gradient(180deg, #FEE74B 0%, #F5D90A 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.2)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-dot": "pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
