import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainView from "./src/MainView";
import 'react-native-gesture-handler'; // debe estar al inicio
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function App() {
  return (
    <GestureHandlerRootView>
    <SafeAreaProvider>
      <View className="flex-1 bg-light-background dark:bg-dark-background">
        <MainView />
      </View>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
