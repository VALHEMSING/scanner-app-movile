import { ESP32_URL } from "../constants/constants"



export const cameraServices = {
    up: async () => {
        await fetch(`${ESP32_URL}/startUp4`)
    },
    down: async () => {
        await fetch(`${ESP32_URL}/startDown4`)
    },
    stop: async () => {
        await fetch(`${ESP32_URL}/stop4`)
    }
     
}