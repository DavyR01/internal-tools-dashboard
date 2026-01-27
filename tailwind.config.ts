import type { Config } from "tailwindcss";

const config: Config = {
   darkMode: "class",
   content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./features/**/*.{js,ts,jsx,tsx,mdx}",
      "./lib/**/*.{js,ts,jsx,tsx,mdx}",
      "./store/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
      extend: {
         fontFamily: {
            sans: ["var(--font-inter)", "system-ui", "sans-serif"],
         },
         colors: {
            bg: "rgb(var(--bg) / <alpha-value>)",
            surface: "rgb(var(--surface) / <alpha-value>)",
            elevated: "rgb(var(--elevated) / <alpha-value>)",
            text: "rgb(var(--text) / <alpha-value>)",
            muted: "rgb(var(--muted) / <alpha-value>)",
            border: "rgb(var(--border) / <alpha-value>)",
         },
         ringColor: {
            DEFAULT: "rgb(var(--ring) / <alpha-value>)",
         },
      },
   },
   plugins: [],
};

export default config;
