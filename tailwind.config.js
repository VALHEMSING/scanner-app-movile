// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#E8F3FE", // fondo general claro
          cardBackgraund: "#FFFFFF",
          touchs: "#00B4C0", // botones principales Vet
          title: "#007F8C", // títulos Vet
          texts: "#111827",
          borderColor: "#D1D5DB",
          btnRestart: "#F59E0B", // ámbar para “reiniciar”
          btnScanner: "#00b4c0", // Vet
          btnPause: "#10B981", // verde play/pausa
          gBorder: "#1C1C1E",
          bntAltura: "#00B4C0",
        },
        dark: {
          background: "#0F172A", // fondo oscuro
          cardBackgraund: "#1E293B",
          touchs: "#0A9396", // botones Vet oscuro
          title: "#4ADE80", // verde agua brillante
          texts: "#E2E8F0",
          borderColor: "#374151",
          bgBorder: "#111827",
          btnRestart: "#FBBF24",
          btnScanner: "#0A9396",
          btnPause: "#34D399",
          bntAltura: "#0a9396",
        },

        // Paleta auxiliar Medicina
        med: {
          light: "#8C1424", // vinotinto claro
          DEFAULT: "#6B0F1A", // vinotinto medio
          dark: "#4C0A11", // vinotinto oscuro
        },
      },
    },
  },
  plugins: [],
};
