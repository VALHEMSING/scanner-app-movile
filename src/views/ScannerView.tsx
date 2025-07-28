import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Button, Card, Divider, Title, Snackbar } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { engineFourServices } from "../services/engineFour.services";
import { engineOneServices } from "../services/engineOne.services";
import { useOrderAction } from "../hooks/useOrderAction";
import { scannerServices } from "../services/scanner.services";
import { emergencyServices } from "../services/emergency.services";

export const ScannerView = () => {
  const { execute } = useOrderAction();
  const [isScanning, setIsScanning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  // Manjejar scanner
  const handleScantoggle = async () => {
    try {
      if (isScanning) {
        await scannerServices.stopedScanner();
        setSnackbar({
          visible: true,
          message: "Escaneo cancelado...",
        });
      } else {
        await scannerServices.startScanner();
        setSnackbar({
          visible: true,
          message: "Escaneo iniciado...",
        });
      }
      setIsScanning(!isScanning);
    } catch (e) {
      console.error("Error al alternar escaneo", e);
      setSnackbar({
        visible: true,
        message: "Error al controlar el scanner",
      });
    }
  };

  // Manejador de pausa y reanudar
  const handlePauseToggle = async () => {
    try {
      await emergencyServices.pause(); // Mismo endpoint

      const nextPausedState = !isPaused;

      setIsPaused(nextPausedState); // Actualizamos el estado

      setSnackbar({
        visible: true,
        message: nextPausedState
          ? "El escaneo fue pausado exitosamente"
          : "El escaneo se ha reanudado",
      });
    } catch (e) {
      console.error("Error al cambiar el estado de pausa:", e);
      setSnackbar({
        visible: true,
        message: "Error al enviar la solicitud de pausa/reanudar",
      });
    }
  };

  return (
    <ScrollView
      className="flex-1 px-7"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={true}
    >
      <Card>
        <Card.Content className="border-2 rounded-xl dark:bg-dark-cardBackgraund">
          <View className="items-center justify-center">
            <Title>
              <Text className="font-bold">Configuración WiFi</Text>
            </Title>
          </View>
          <View className="p-4 border-2 rounded-xl bg-zinc-600">
            <Text className="my-1">
              <Text className="font-semibold">RED: </Text>
              <Text>jfdifajiof</Text>
            </Text>
            <Text className="my-1">
              <Text className="font-semibold">Contraseña:</Text>
              <Text>1233456</Text>
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card className="my-4">
        <Card.Content className="border-2 rounded-xl dark:bg-dark-cardBackgraund">
          <Title className=" dark:text-dark-title m-auto font-bold items-center justify-center text-center">
            Ajustes de placa de madera
          </Title>
          <Divider className="my-2" />
          <View className="items-center my-4">
            <Text>Presiona para mover la placa</Text>
          </View>
          <View className="flex-row justify-around">
            <TouchableOpacity
              className={`w-20 h-20 border-2 rounded-full items-center justify-center bg-red-600`}
              onPress={() =>
                execute({
                  action: engineOneServices.moveLeft,
                  succesMessages: "Motor a la izquierda",
                  errorMessages: "Error al mover a la izquierda",
                })
              }
              onPressOut={() =>
                execute({
                  action: engineOneServices.stop,
                  succesMessages: "Motor detenido",
                  errorMessages: "Error al detener el motor",
                })
              }
            >
              <Text className="text-white text-3xl">-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-20 h-20 border-2 rounded-full items-center justify-center bg-blue-400`}
            >
              <Text className="text-white text-3xl">+</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Card encargado del movimiento del sensor*/}
      <Card className="my-4">
        <Card.Content className="border-2 rounded-xl p-4 dark:bg-dark-cardBackgraund">
          <Title className=" m-auto font-bold text-lg dark:text-white">
            Control de Ángulo (0° - 90°)
          </Title>
          <Divider className="my-2" />

          <View className="items-center my-4">
            <Text className="text-3xl font-bold dark:text-cyan-300">
              {angulo}°
            </Text>
          </View>

          <View className="flex-row justify-around ">
            {/* Botón para disminuir */}
            <TouchableOpacity
              className={`w-20 h-20 border-2 rounded-full items-center justify-center 
                ${angulo <= 0 ? "bg-gray-400" : "bg-red-500"}`}
              disabled={angulo <= 0}
              onPressIn={() => handlePressIn(-1)}
              onPressOut={handlePressOut}
              activeOpacity={0.7}
            >
              <Text className="text-white text-3xl">-</Text>
            </TouchableOpacity>

            {/* Botón para aumentar */}
            <TouchableOpacity
              className={`w-20 h-20 border-2 rounded-full items-center justify-center 
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

      <Card className="my-4">
        <Card.Content>
          <View></View>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="border-2 rounded-xl dark:bg-dark-cardBackgraund">
          <Title className="font-bold m-auto">Otras opciones</Title>
          <Divider className="my-2" />
          <View className=" m-auto flex-row gap-3 my-2">
            <Button mode="contained" icon="restart">
              Reiniciar
            </Button>
            <Button
              mode="contained"
              icon={isScanning ? "close" : "camera"}
              onPress={handleScantoggle}
              buttonColor={isScanning ? "#D32F2F" : "#1976D2"}
            >
              {isScanning ? "Cancelar escaneo" : "Escanear"}
            </Button>
          </View>
          <View className="px-5 mx-5">
            <Button
              mode="contained"
              icon={isPaused ? "play" : "pause"}
              onPress={handlePauseToggle}
            >
              {isPaused ? "Reanudar" : "Pausar"}
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3500}
        wrapperStyle={{ bottom: 80 }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
};
