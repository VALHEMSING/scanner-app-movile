import { View, Text, useColorScheme, StatusBar, Platform } from "react-native";
import { HeaderProps } from "../types/headerProps";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export const Header = ({ title = "Scanner" }: HeaderProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View>
      {/* StatusBar dinámico */}
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header con glassmorphism */}
      <BlurView
        intensity={90}
        tint={isDark ? "dark" : "light"}
        className="py-2 pt-4 rounded-3xl overflow-hidden"
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(59, 130, 246, 0.2)", "rgba(30, 41, 59, 0.8)"]
              : ["rgba(59, 130, 246, 0.1)", "rgba(243, 244, 246, 0.9)"]
          }
          className="absolute inset-0"
        />

        <View className="flex-row items-center justify-center gap-4">
          <View className="w-14 h-14 rounded-full bg-blue-500/20 items-center justify-center">
            <AntDesign
              name="scan1"
              size={32}
              color={isDark ? "#60a5fa" : "#3b82f6"}
            />
          </View>

          <Text
            className={`text-4xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            style={{
              textShadowColor: isDark ? "#60a5fa40" : "#3b82f640",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 6,
            }}
          >
            {title}
          </Text>
        </View>

        {/* Línea decorativa animada */}
        <View className="mt-4 h-0.5 w-1/3 mx-auto rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </BlurView>
    </View>
  );
};
