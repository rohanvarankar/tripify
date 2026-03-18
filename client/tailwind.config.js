/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          DEFAULT: "#6366f1",
          dark:   "#4f46e5",
          light:  "#eef2ff",
        },
        accent: {
          light:   "#fff7ed",
          DEFAULT: "#f97316",
          dark:    "#c2410c",
        },
        violet: {
          DEFAULT: "#8b5cf6",
          dark:    "#7c3aed",
        }
      },
      backgroundImage: {
        "hero-gradient":   "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)",
        "card-gradient":   "linear-gradient(to bottom right, #6366f1, #8b5cf6)",
        "brand-gradient":  "linear-gradient(to right, #6366f1, #8b5cf6)",
        "footer-gradient": "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
      },
      screens: {
        xxsm:   "332px",
        xsm:    "432px",
        xlplus: "1400px",
      },
      animation: {
        "fade-in":    "fadeIn 0.6s ease-out both",
        "slide-up":   "slideUp 0.6s ease-out both",
        "float":      "float 4s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
        "pulse-ring": "pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "spin-slow":  "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseRing: {
          "0%":   { transform: "scale(0.9)", opacity: "0.7" },
          "70%":  { transform: "scale(1.3)", opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
      boxShadow: {
        brand:  "0 4px 24px -4px rgba(99,102,241,0.4)",
        card:   "0 2px 20px -4px rgba(15,15,40,0.08)",
        glass:  "0 8px 32px 0 rgba(31,38,135,0.15)",
      },
      dropShadow: {
        glow: ["0 0 12px rgba(99,102,241,0.6)", "0 0 4px rgba(99,102,241,0.3)"],
      },
    },
  },
  plugins: [],
};
