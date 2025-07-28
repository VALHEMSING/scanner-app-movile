import { ESP32_URL } from "../constants/constants";

export const scannerServices = {
  startScanner: async () => {
    await fetch(`${ESP32_URL}/startScan`);
  },
  stopedScanner: async () => {
    await fetch(`${ESP32_URL}/cancelScan`);
  },
};
