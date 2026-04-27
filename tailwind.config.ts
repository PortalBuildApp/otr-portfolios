import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a4bbfd",
          400: "#7b94fa",
          500: "#5a6ef5",
          600: "#4451e8",
          700: "#3840cd",
          800: "#2f35a5",
          900: "#2c3183",
          950: "#1a1d4e",
        },
        neutral: {
          950: "#0a0a0f",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#e2e8f0",
            a: { color: "#7b94fa" },
            strong: { color: "#f8fafc" },
            h1: { color: "#f8fafc", fontFamily: "var(--font-playfair)" },
            h2: { color: "#f8fafc", fontFamily: "var(--font-playfair)" },
            h3: { color: "#f8fafc" },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
