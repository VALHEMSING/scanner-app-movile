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
import { engineFourServices } from "../services/engineFour.services";
import { engineOneServices } from "../services/engineOne.services";
import { useOrderAction } from "../hooks/useOrderAction";
import { scannerServices } from "../services/scanner.services";
import { emergencyServices } from "../services/emergency.services";
import { ALTURAS_PRESETS } from "../constants/alturas.constants";
import { tamanosServices } from "../services/tamanos.services";
import { Header } from "../components/Header";
import { cameraServices } from "../services/camera.services";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375; // iPhone SE y dispositivos pequeños

export const ScannerView = () => {
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
  const directionRef = useRef(0); // Dirección actual (0 = detenido, 1 = subiendo, -1 = bajando)

  const lastSentValues = useRef({
    altura: -1,
  });

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

  const handleReset = () => {};

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
        className="p-4 rounded-3xl border-light-borderColor dark:border-dark-borderColor bg-light-bgBorder dark:bg-dark-bgBorder"
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

        <Card className="mt-5  mx-8 dark:bg-dark-cardBackgraund">
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

        <Card className="my-4 mx-5">
          <Card.Content className="border-2 rounded-xl dark:bg-dark-cardBackgraund">
            <Title className=" dark:text-dark-title m-auto font-bold items-center justify-center text-center ">
              Ajustes de placa de madera
            </Title>
            <Divider className="my-2" />
            <View className="items-center my-4">
              <Text>Presiona para mover la placa</Text>
            </View>
            <View className="flex-row justify-around">
              <TouchableOpacity
                className={`w-20 h-20 border-2 rounded-full items-center justify-center bg-red-600`}
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
              >
                <Text className="text-white text-3xl">-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`w-20 h-20 border-2 rounded-full items-center justify-center bg-blue-400`}
                onPressIn={() =>
                  execute({
                    action: engineOneServices.moveRight,
                    succesMessages: "Motor encendido",
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
              >
                <Text className="text-white text-3xl">+</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Card encargado del movimiento del sensor*/}
        <Card className="my-4 mx-5">
          <Card.Content className="border-2 rounded-xl p-4 dark:bg-dark-cardBackgraund">
            <Title className=" m-auto font-bold text-lg dark:text-white">
              Control de Ángulo
            </Title>
            <Divider className="my-2" />

            <View className="flex-row justify-around ">
              {/* Botón para disminuir */}
              <TouchableOpacity
                className={`w-20 h-20 border-2 rounded-full items-center justify-center 
                ${angulo <= 0 ? "bg-gray-400" : "bg-red-500"}`}
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
                activeOpacity={0.7}
              >
                <Text className="text-white text-3xl">-</Text>
              </TouchableOpacity>

              {/* Botón para aumentar */}
              <TouchableOpacity
                className={`w-20 h-20 border-2 rounded-full items-center justify-center 
                ${angulo >= 90 ? "bg-gray-400" : "bg-blue-500"}`}
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
                activeOpacity={0.7}
              >
                <Text className="text-white text-3xl">+</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <Card className="my-4 mx-5">
          <Card.Content className="border-2 rounded-xl">
            <Title className="font-bold m-auto">Alturas</Title>
            <Divider />
            <View className="my-3 m-auto flex-row gap-6">
              {ALTURAS_PRESETS.map((preset, index) => (
                <View key={index} className="rounded-full overflow-hidden">
                  <Button
                    mode={altura === preset.value ? "contained" : "outlined"}
                    onPress={() => handleAlturaPreset(preset.value)}
                    labelStyle={{ fontSize: 16 }}
                  >
                    {preset.label}
                  </Button>
                </View>
              ))}
            </View>

            <Text className="m-auto">Altura actual: {altura}</Text>
          </Card.Content>
        </Card>

        <Card className="mx-5 mt-4">
          <Card.Content className="border-2 rounded-xl dark:bg-dark-cardBackgraund">
            <Title className="font-bold m-auto">Opciones de scanneo</Title>
            <Divider className="my-2" />
            <View className=" m-auto flex-row gap-3 my-2">
              <Button mode="contained" icon="close"
              onPress={() => execute({
                action: scannerServices.stopedScanner,
                succesMessages:"Cancelando escaneo",
                errorMessages: "Error al cancelar escaneo"
              })}
              >
                Reiniciar
              </Button>
              <Button
                mode="contained"
                icon={isScanning ? "close" : "camera"}
                onPress={() => execute({
                action: scannerServices.startScanner,
                succesMessages:"Iniciando escaneo",
                errorMessages: "Error al iniciiar escaneo"
              })}
              >
                {isScanning ? "Cancelar" : "Escanear"}
              </Button>
            </View>
            <View className="m-auto gap-2 my-2 flex-row rounded-full">
              <Button
                mode="contained"
                icon={isPaused ? "play" : "pause"}
                onPress={handlePauseToggle}
              >
                {isPaused ? "Reanudar" : "Pausar"}
              </Button>

              <Button mode="contained" icon="stop" buttonColor="red">
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
