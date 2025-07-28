import { title } from "process";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#e8f3fe", // Color de fondo claro
          title: "#a4cefc",
          track: "#d3d3d3",
          active: "#4CAF50",
          thumb: "#4CAF50", // Título en claro
        },
        dark: {
          background: "#0F172A",
          cardBackgraund: "#2D3748",
          title: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
};
