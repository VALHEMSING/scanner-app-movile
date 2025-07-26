import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Card, Divider, Title, Snackbar } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { engineFourServices } from "../services/engineFour.services";

export const ScannerView = () => {
  const [angulo, setAngulo] = useState<number>(0);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const angleRef = useRef(0); // Referencia para el valor actual
  const directionRef = useRef(0); // Dirección actual (0 = detenido, 1 = subiendo, -1 = bajando)
  const isDark = useColorScheme() === "dark";

  // Sincronizar la referencia con el estado
  useEffect(() => {
    angleRef.current = angulo;
  }, [angulo]);

  // Función para actualizar el ángulo y enviarlo al servidor
  const updateAngle = async (newAngle: number) => {
    // Validar y ajustar el rango
    const clampedAngle = Math.max(0, Math.min(90, newAngle));

    // Actualizar estado solo si cambió
    if (clampedAngle !== angulo) {
      setAngulo(clampedAngle);

      try {
        await engineFourServices.setAngulo(clampedAngle);
        setSnackbar({
          visible: true,
          message: `Ángulo actualizado a ${clampedAngle}°`,
        });
      } catch (error) {
        console.error("Error al actualizar:", error);
        setSnackbar({
          visible: true,
          message: "Error de conexión",
        });
      }
    }
  };

  // Efecto de limpieza
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Manejar presión de botón
  const handlePressIn = (direction: number) => {
    directionRef.current = direction;

    // Cambio inmediato
    updateAngle(angleRef.current + direction);

    // Iniciar intervalo para cambios continuos
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        updateAngle(angleRef.current + directionRef.current);
      }, 150);
    }
  };

  // Manejar liberación de botón
  const handlePressOut = () => {
    directionRef.current = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Card className="mb-4">
        <Card.Content className="border-2 rounded-xl p-4">
          <Title className="text-center font-bold text-lg dark:text-white">
            Control de Ángulo (0° - 90°)
          </Title>
          <Divider className="my-2" />

          <View className="items-center my-4">
            <Text className="text-3xl font-bold dark:text-cyan-300">
              {angulo}°
            </Text>
          </View>

          <View className="flex-row justify-around mt-4">
            {/* Botón para disminuir */}
            <TouchableOpacity
              className={`w-20 h-20 rounded-full items-center justify-center 
                ${angulo <= 0 ? "bg-gray-400" : "bg-blue-500"}`}
              disabled={angulo <= 0}
              onPressIn={() => handlePressIn(-1)}
              onPressOut={handlePressOut}
              activeOpacity={0.7}
            >
              <Text className="text-white text-3xl">-</Text>
            </TouchableOpacity>

            {/* Botón para aumentar */}
            <TouchableOpacity
              className={`w-20 h-20 rounded-full items-center justify-center 
                ${angulo >= 90 ? "bg-gray-400" : "bg-blue-500"}`}
              disabled={angulo >= 90}
              onPressIn={() => handlePressIn(1)}
              onPressOut={handlePressOut}
              activeOpacity={0.7}
            >
              <Text className="text-white text-3xl">+</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={1500}
        wrapperStyle={{ bottom: 80 }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
};
