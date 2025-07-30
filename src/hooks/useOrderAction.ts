import { useState } from "react";
import { OrderActionOptions } from "../types/order";

export const useOrderAction = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<"green" | "red">("green");

  const execute = async ({
    action,
    succesMessages,
    errorMessages,
    silent = false,        // ← nuevo flag
  }: OrderActionOptions & { silent?: boolean }) => {
    try {
      await action();
      if (succesMessages && !silent) {
        setMessage(succesMessages);
        setColor("green");
        setVisible(true);
      }
    } catch (err) {
      console.error("Order failed:", err);

      // Si es silencioso o es un error de red, no mostramos nada
      if (!silent) {
        const network =
          err instanceof TypeError &&
          (err.message.includes("Network request failed") ||
            err.message.includes("fetch"));
        setMessage(network ? "" : errorMessages ?? "Ocurrió un error");
        setColor("red");
        setVisible(!network); // ocultamos si es error de red
      }
    }
  };

  return { execute, visible, message, color, setVisible };
};