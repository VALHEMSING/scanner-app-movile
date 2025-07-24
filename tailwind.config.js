/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#e8f3fe",  // Color de fondo claro
          title: "#a4cefc",   
            track: '#d3d3d3',
          active: '#4CAF50',
          thumb: '#4CAF50',    // Título en claro
        },
        dark: {
          background: "#252933",
          title:"#1c1c1c",
          text: "#b83700",
           track: '#444444',
          active: '#81e6d9',
          thumb: '#81e6d9',
        },
        },
      },
    },
    plugins: [],
  }

