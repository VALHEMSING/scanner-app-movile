import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Pressable,
} from "react-native";
import { Button, Card, Divider, Title, Snackbar } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { engineFourServices } from "../services/engineFour.services";
import { engineOneServices } from "../services/engineOne.services";
import { useOrderAction } from "../hooks/useOrderAction";
import { scannerServices } from "../services/scanner.services";
import { emergencyServices } from "../services/emergency.services";
import { ALTURAS_PRESETS } from "../constants/alturas.constants";
import { tamanosServices } from "../services/tamanos.services";
import { Header } from "../components/Header";
import { cameraServices } from "../services/camera.services";
import { ESCANER_PASSWORD, ESCANER_SSID } from "../constants/constants";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375; // iPhone SE y dispositivos pequeños

export const ScannerView = () => {
  const isDark = useColorScheme() === "dark";
  const accent = isDark ? "#0A9396" : "#00B4C0";
  const btnSize = isSmallScreen ? "w-24 h-12" : "w-28 h-14";
  const labelSize = isSmallScreen ? "text-base" : "text-lg";
  const titleSize = isSmallScreen ? "text-2xl" : "text-3xl";
  const btnWidth = isSmallScreen ? "w-36" : "w-40"; // mismo ancho para todos
  // Decontruir
  const { execute } = useOrderAction();

  // --> Estados
  const [altura, setAltura] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [angulo, setAngulo] = useState<number>(0);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Refernacias
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const angleRef = useRef(0); // Referencia para el valor actual

  // Sincronizar la referencia con el estado
  useEffect(() => {
    angleRef.current = angulo;
  }, [angulo]);

  // Función para actualizar el ángulo y enviarlo al servidor
  // Efecto de limpieza
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  // Manejador de altura
  const handleAlturaPreset = async (value: number) => {
    setAltura(value);
    switch (value) {
      case 1:
        await tamanosServices.tamanoUno();
        break;
      case 2:
        await tamanosServices.tamanoDos();
        break;
      case 3:
        await tamanosServices.tamanoTres();
        break;
      default:
        console.warn("Altura invalida");
    }
  };

  return (
    <ScrollView
      className="flex-1  bg-light-borderColor dark:bg-dark-borderColor"
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={true}
    >
      <View
        className="px-4 pt-6 rounded-3xl border-light-borderColor dark:border-dark-borderColor bg-light-background dark:bg-dark-background"
        style={{
          borderWidth: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 6, // para Android
        }}
      >
        <Header />

        <Card className="mt-5 mx-8">
          <Card.Content className="border-2 rounded-xl bg-light-cardBackgraund dark:bg-dark-cardBackgraund">
            <View className="items-center justify-center ">
              <Text className=" text-light-title dark:text-dark-title font-bold text-2xl mb-3  ">
                Configuración WiFi
              </Text>
            </View>
            <View className="p-4 border-2 rounded-xl ">
              <Text className="my-1">
                <Text className="font-semibold text-light-title dark:text-dark-title">
                  RED:
                </Text>
                <Text className="dark:text-white font-extrabold">
                  {" "}
                  {ESCANER_SSID}
                </Text>
              </Text>
              <Text className="my-1">
                <Text className=" text-light-title font-semibold dark:text-dark-title">
                  Contraseña:
                </Text>
                <Text className=" dark:text-white font-extrabold">
                  {" "}
                  {ESCANER_PASSWORD}
                </Text>
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card className="my-4 mx-5">
          <Card.Content className="border-2 rounded-xl bg-light-cardBackgraund dark:bg-dark-cardBackgraund">
            <View className="items-center justify-center">
              <Text className=" text-light-title dark:text-dark-title font-bold text-xl">
                Ajustes de placa de madera
              </Text>
            </View>
            <Divider className="my-4" />
            <View className="items-center mt-1 mb-4"></View>
            <View className="flex-row justify-around items-center ">
              {/* Izquierda */}
              <TouchableOpacity
                className={`
      w-20 h-15 rounded-full items-center justify-center
      bg-gradient-to-br from-red-500 to-red-700
      shadow-md shadow-red-500/40
      active:scale-95 active:shadow-red-700/60
    `}
                onPressIn={() =>
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
                activeOpacity={0.1}
              >
                <AntDesign
                  name="leftcircleo"
                  size={50}
                  color={isDark ? "#0A9396" : "#00B4C0"}
                />
              </TouchableOpacity>

              {/* Derecha */}
              <TouchableOpacity
                className={`
      w-20 h-15 rounded-full items-center justify-center
      bg-gradient-to-br from-blue-500 to-blue-700
      shadow-md shadow-blue-500/40
      active:scale-95 active:shadow-blue-700/60
    `}
                onPressIn={() =>
                  execute({
                    action: engineOneServices.moveRight,
                    succesMessages: "Motor a la derecha",
                    errorMessages: "Error",
                  })
                }
                onPressOut={() =>
                  execute({
                    action: engineOneServices.stop,
                    succesMessages: "Motor detenido",
                    errorMessages: "Error al detener el motor",
                  })
                }
                activeOpacity={0.1}
              >
                <AntDesign
                  name="rightcircleo"
                  size={50}
                  color={isDark ? "#0A9396" : "#00B4C0"}
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Card encargado del movimiento del sensor*/}
        <Card className="my-4 mx-5">
          <Card.Content className="border-2 rounded-xl p-4 bg-light-cardBackgraund dark:bg-dark-cardBackgraund">
            <View className=" items-center justify-center ">
              <Text className=" text-light-title dark:text-dark-title font-bold text-xl ">
                Control del scanner
              </Text>
            </View>

            <Divider className="my-4" />

            <View className="flex-row justify-around pt-3 ">
              {/* Botón para disminuir */}
              <TouchableOpacity
                className={`
      w-20 h-15 rounded-full items-center justify-center
      bg-gradient-to-br from-red-500 to-red-700
      shadow-md shadow-red-500/40
      active:scale-95 active:shadow-red-700/60
    `}
                onPressIn={() =>
                  execute({
                    action: cameraServices.down,
                    succesMessages: "Motor de subida",
                    errorMessages: "error",
                  })
                }
                onPressOut={() =>
                  execute({
                    action: cameraServices.stop,
                    succesMessages: "Motor detenido",
                    errorMessages: "Error al detener el motor",
                  })
                }
                activeOpacity={0.1}
              >
                <AntDesign
                  name="downcircleo"
                  size={50}
                  color={isDark ? "#0A9396" : "#00B4C0"}
                />
              </TouchableOpacity>

              {/* Botón para aumentar */}
              <TouchableOpacity
                className={` bg-light-touchs
      w-20 h-15 rounded-full items-center justify-center
      bg-gradient-to-br from-blue-500 to-blue-700
      shadow-md shadow-blue-500/40
      active:scale-95 active:shadow-blue-700/60
    `}
                disabled={angulo >= 90}
                onPressIn={() =>
                  execute({
                    action: cameraServices.up,
                    succesMessages: "Motor de subida",
                    errorMessages: "error",
                  })
                }
                onPressOut={() =>
                  execute({
                    action: cameraServices.stop,
                    succesMessages: "Motor detenido",
                    errorMessages: "Error al detener el motor",
                  })
                }
                activeOpacity={0.1}
              >
                <AntDesign
                  name="upcircleo"
                  size={50}
                  color={isDark ? "#0A9396" : "#00B4C0"}
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <Card className="my-4 mx-5">
          <Card.Content className="border-2 rounded-xl bg-light-cardBackgraund dark:bg-dark-cardBackgraund py-4 px-3">
            {/* Título */}
            <Text
              className={`font-bold m-auto text-center mb-3 ${titleSize}`}
              style={{ color: accent }}
            >
              Alturas
            </Text>

            {/* Botones */}
            <View className="flex-row justify-center gap-3 my-4">
              {ALTURAS_PRESETS.map(({ label, value }) => {
                const isActive = altura === value;
                return (
                  <Button
                    key={value}
                    onPress={() => handleAlturaPreset(value)}
                    className={`
                      w-full
                  ${btnSize} rounded-full items-center justify-center border-2
                  ${isActive ? "border-transparent" : "border-neutral-300 dark:border-neutral-600"}
                `}
                    style={{
                      backgroundColor: isActive ? accent : "transparent",
                    }}
                  >
                    <Text
                      className={`font-bold ${labelSize} ${
                        isActive
                          ? "text-white"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {label}
                    </Text>
                  </Button>
                );
              })}
            </View>

            {/* Texto final */}
            <Text
              className={`text-center font-semibold ${labelSize}`}
              style={{ color: accent }}
            >
              Altura actual: {altura}
            </Text>
          </Card.Content>
        </Card>

        <Card className="mx-2 my-4">
          <Card.Content className="border-2 rounded-xl bg-light-cardBackgraund dark:bg-dark-cardBackgraund p-4">
            <Text className="text-light-title dark:text-dark-title font-bold text-xl text-center mb-3">
              Opciones de escaneo
            </Text>

            {/* Fila 1 */}
            <View className="flex-row justify-center gap-3 mb-3">
              <Button
                mode="contained"
                icon="close"
                buttonColor="#F59E0B"
                style={{ minWidth: 140 }}
                onPress={() =>
                  execute({
                    action: scannerServices.stopedScanner,
                    succesMessages: "Cancelando escaneo",
                    errorMessages: "Error al cancelar escaneo",
                  })
                }
              >
                Reiniciar
              </Button>

              <Button
                mode="contained"
                icon={isScanning ? "close" : "camera"}
                buttonColor="#00B4C0"
                style={{ minWidth: 140 }}
                onPress={() =>
                  execute({
                    action: scannerServices.startScanner,
                    succesMessages: "Iniciando escaneo",
                    errorMessages: "Error al iniciar escaneo",
                  })
                }
              >
                Escanear
              </Button>
            </View>

            {/* Fila 2 */}
            <View className="flex-row justify-center gap-3">
              <Button
                mode="contained"
                icon={isPaused ? "play" : "pause"}
                buttonColor="#10B981"
                style={{ minWidth: 140 }}
                onPress={handlePauseToggle}
              >
                {isPaused ? "Reanudar" : "Pausar"}
              </Button>

              <Button
                mode="contained"
                icon="stop"
                buttonColor="#EF4444"
                style={{ minWidth: 140 }}
              >
                Detener
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
      </View>
    </ScrollView>
  );
};
