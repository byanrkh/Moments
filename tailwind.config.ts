import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FDF3DC",
        ink: "#141414",
        lime: "#D7F24C",
        pink: "#FF7AC6",
        yolk: "#F5C84C",
        sky: "#8FD3E8",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        brutal: "6px 6px 0px 0px #141414",
        "brutal-sm": "4px 4px 0px 0px #141414",
        "brutal-lg": "10px 10px 0px 0px #141414",
        "brutal-pink": "6px 6px 0px 0px #FF7AC6",
      },
      rotate: {
        "-3": "-3deg",
        "-2": "-2deg",
        "2": "2deg",
        "3": "3deg",
      },
    },
  },
  plugins: [],
};
export default config;
