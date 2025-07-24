import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainView from "./src/MainView";

export default function App() {
  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <MainView />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}
