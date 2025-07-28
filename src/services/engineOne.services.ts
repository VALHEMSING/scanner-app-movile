import { ESP32_URL } from "../constants/constants";

export const engineOneServices = {
  moveRight: async () => {
    await fetch(`${ESP32_URL}/startRight1`);
  },
  moveLeft: async () => {
    await fetch(`${ESP32_URL}/startLeft1`);
  },
  stop: async () => {
    await fetch(`${ESP32_URL}/stope1`);
  },
};
