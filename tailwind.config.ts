import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f3f2f2",
        surface: "#eae9e9",
        ink: "#201e1d",
        divider: "rgba(32,30,29,0.4)",
        brand: {
          DEFAULT: "#ec3013",
          dark: "#dd2b0f",
          deep: "#ae1800",
          tint: "#fff2ef",
          tint2: "#ffe0d9",
        },
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
