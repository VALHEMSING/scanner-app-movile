import { ScrollView, View, Text, Alert, useColorScheme, Dimensions } from "react-native";
import { Button, Card, Divider, Title, Snackbar } from "react-native-paper";
import CustomSlider from "../components/CustomSileder";
import { useCallback, useRef, useState } from "react";
import { engineFourServices } from "../services/engineFour.services";



const DEBOUNCE_DELAY = 300; // ms
const { width } = Dimensions.get("window");
const isSmallScreen = width < 375; // iPhone SE y dispositivos pequeños

const ALTURA_PRESETS = [
  { label: "50 cm", value: 50 },
  { label: "100 cm", value: 100 },
  { label: "150 cm", value: 150 },
];
const CICLOS_PRESETS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
];
export const ScannerView = () => {

     // Estados
  const [ciclo, setCiclo] = useState(1);
  const [angulo, setAngulo] = useState(0);
  const [altura, setAltura] = useState(50);
  const [ancho, setAncho] = useState(0);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMotor, setLoadingMotor] = useState(false);
  const [manualDarkMode, setManualDarkMode] = useState<boolean | null>(null);



  const [isMovingForward, setIsMovingForward] = useState(false);
  const [isMovingBackward, setIsMovingBackward] = useState(false);

  // Refs para control
  const lastSentValues = useRef({
    angulo: -1,
    altura: -1,
    ancho: -1,
  });

  const debounceTimeouts = useRef({
    angulo: null as NodeJS.Timeout | null,
    altura: null as NodeJS.Timeout | null,
    ancho: null as NodeJS.Timeout | null,
  });
  const isMounted = useRef(true);
 const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

     const colors = {
    background: isDark ? 'dark:bg-dark-bg' : 'bg-light-bg',
    card: isDark ? 'dark:bg-dark-card' : 'bg-light-card',
    text: isDark ? '#1c1c1c' : '#1e1e1e',
    sliderTrack: isDark ? '#e56b6b' : '#ed862b',
    sliderActive: isDark ? '#696663' : '#7fdeff',
    sliderThumb: isDark ? '#696663' : '#7fdeff',
  };


  // Función genérica con debounce
  const createDebouncedHandler = (type: "angulo" | "altura" | "ancho") =>
    useCallback((value: number) => {
      switch (type) {
        case "angulo":
          setAngulo(value);
          break;
        case "altura":
          setAltura(value);
          break;
        case "ancho":
          setAncho(value);
          break;
      }

      if (debounceTimeouts.current[type]) {
        clearTimeout(debounceTimeouts.current[type]!);
      }

      debounceTimeouts.current[type] = setTimeout(async () => {
        try {
          if (value !== lastSentValues.current[type] && isMounted.current) {
            if (type === "angulo") {
              await engineFourServices.setAngulo(value);
            }
            lastSentValues.current[type] = value;
          }
        } catch (error) {
              console.error(`Error en ${type}:`, error);
        }
      }, DEBOUNCE_DELAY);
    }, []);

     const handleAnguloChange = createDebouncedHandler("angulo");
  return (
    <ScrollView
      className=" flex-1 p-8 pt-4 "
      keyboardShouldPersistTaps="handled"
    >
      <Card className="mb-4">
        <Card.Content className="border-2 rounded-xl">
          <View>
            <View className="items-center justify-center">
              <Title>
                <Text className="font-extrabold">Configuración Wi-Fi</Text>
              </Title>
            </View>
            
            <View className="items-start p-3 mt-2 rounded-xl  border">
              <Text>
                <Text className="font-semibold">Red: </Text>
                <Text className="font-extrabold ">Prueba</Text>
              </Text>
              <Text className="my-1">
                <Text className="font-semibold">Contraseña: </Text>
                <Text className="font-extrabold">12334456</Text>
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="border-2 rounded-xl">
          <View className="items-center justify-center">
            <Title className="font-bold">Ajustes del Scanner</Title>    
          </View>
          <Divider/>
          <CustomSlider
            title="Inclinación del sensor"
            value={angulo}
            min={0}
            max={90}
            onChange={handleAnguloChange}
            unit="°"
            step={1}
            thumbColor={colors.sliderThumb}
            minTrackColor={colors.sliderActive}
            maxTrackColor={colors.sliderTrack}
            textColor={colors.text}
          />

        </Card.Content>
      </Card>
    </ScrollView>
  );
};
