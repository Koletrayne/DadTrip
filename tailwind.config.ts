import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAF1DD",
        parchment: {
          DEFAULT: "#FAF1DD",
          50:  "#FFF9EB",
          100: "#FBF1D9",
          200: "#F4E2B5",
          300: "#ECCF87",
          400: "#E0B95C",
        },
        // Campfire orange — primary CTA / warmth
        sunset: {
          DEFAULT: "#E07A2F",
          50:  "#FDF3E7",
          100: "#FBE2C7",
          200: "#F6C58E",
          300: "#EFA557",
          400: "#E78D3D",
          500: "#E07A2F",
          600: "#BD611E",
          700: "#8E4716",
          800: "#5E2F0E",
          900: "#3A1D08",
        },
        // Forest green
        forest: {
          DEFAULT: "#2F5D50",
          50: "#EAF1EE",
          100: "#D5E3DD",
          200: "#A9C5BA",
          300: "#7DA797",
          400: "#558974",
          500: "#2F5D50",
          600: "#264B41",
          700: "#1C3831",
          800: "#142822",
          900: "#0B1714",
        },
        // Warm gold — XP, achievements, quest accents
        gold: {
          DEFAULT: "#C99A3D",
          50:  "#FBF6E8",
          100: "#F5EAC2",
          200: "#EDD68B",
          300: "#E2C05A",
          400: "#D5AC44",
          500: "#C99A3D",
          600: "#A37B2E",
          700: "#7A5C22",
          800: "#553F18",
          900: "#3A2C12",
        },
        // Deep brown — borders, headings, ink-on-parchment alt
        bark: {
          DEFAULT: "#5C3A1E",
          50:  "#F5ECE0",
          100: "#E5D2BC",
          200: "#C8A37F",
          300: "#A57746",
          400: "#7E5A2E",
          500: "#5C3A1E",
          600: "#4A2F18",
          700: "#382412",
          800: "#251810",
          900: "#150D08",
        },
        sky: {
          soft: "#9EC3D6",
        },
        ink: "#3A2A18",
        muted: "#7A6A55",
        card: "#FFFBF1",
        line: "#E9D9B6",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(92,58,30,0.06), 0 6px 18px rgba(92,58,30,0.08)",
        cardHover:
          "0 2px 4px rgba(92,58,30,0.08), 0 14px 32px rgba(92,58,30,0.14)",
        glow: "0 0 0 4px rgba(201,154,61,0.25)",
        quest: "inset 0 0 0 1px rgba(92,58,30,0.06), 0 4px 16px rgba(92,58,30,0.10)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "parchment-wash":
          "radial-gradient(at 10% 0%, rgba(201,154,61,0.10), transparent 55%), radial-gradient(at 100% 100%, rgba(92,58,30,0.06), transparent 50%), radial-gradient(at 50% 50%, rgba(224,122,47,0.04), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
