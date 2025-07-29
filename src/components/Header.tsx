import { View, Text, useColorScheme } from "react-native";
import { HeaderProps } from "../types/headerProps";
import AntDesign from "@expo/vector-icons/AntDesign";

export const Header = ({ title = "Scanner" }: HeaderProps) => {
  const colorScheme = useColorScheme();
  return (
    <View
      className={`pt-14 flex-row justify-center items-center rounded-br-full rounded-bl-full border-2 dark:border-zinc-900 bg-light-title dark:bg-dark-title`}
    >
      <View className="flex-row items-center gap-2">
        <AntDesign
          name="scan1"
          size={32}
          color={colorScheme === "dark" ? "#c1c1c1c1" : "#2f0e07"}
          className="mb-3 "
        />
        <Text className="text-3xl font-bold mb-3 text-slate-500 dark:text-zinc-600">
          {title}
        </Text>
      </View>
    </View>
  );
};
