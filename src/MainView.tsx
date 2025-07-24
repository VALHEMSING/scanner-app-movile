import React from "react";
import { View } from "react-native";
import { Header } from "./components/Header";
import { ScannerView } from "./views/ScannerView";
const MainView = () => {
  return (
      <View className="flex-1">
        <Header />
        <ScannerView/>
      </View>
  );
};

export default MainView;
