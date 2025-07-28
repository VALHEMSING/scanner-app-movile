import { ESP32_URL } from "../constants/constants";

export const emergencyServices = {
  pause: async () => {
    await fetch(`${ESP32_URL}/pausa`);
  },
  stopEmergncy: async () => {
    await fetch(`${ESP32_URL}/emergencia`);
  },
};
