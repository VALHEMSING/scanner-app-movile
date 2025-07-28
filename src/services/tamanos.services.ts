import { ESP32_URL } from "../constants/constants"



export const tamanosServices = {
    tamanoUno: async () => {
        await fetch(`${ESP32_URL}/tamano1`)
    },
    tamanoDos: async () => {
        await fetch(`${ESP32_URL}/tamano2`)
    },
    tamanoTres: async () => {
        await fetch(`${ESP32_URL}/tamano3`)
    }
}