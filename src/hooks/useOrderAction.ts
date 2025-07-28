import { useState } from "react";
import { OrderActionOptions } from "../types/order"; // o donde tengas el archivo

export const useOrderAction = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<"green" | "red">("green");

  const execute = async ({
    action,
    succesMessages,
    errorMessages,
  }: OrderActionOptions) => {
    try {
      await action();
      if (succesMessages) {
        setMessage(succesMessages);
        setColor("green");
        setVisible(true);
      }
    } catch (err) {
      console.error("Order failed:", err);
      setMessage(errorMessages ?? "Ocurrió un error");
      setColor("red");
      setVisible(true);
    }
  };

  return { execute };
};
