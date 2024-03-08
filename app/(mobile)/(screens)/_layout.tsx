import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useSession } from "../context/AuthContext";
import { Redirect } from "expo-router";
import styles from "../styles/indexStyles";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
export default function AppLayout() {
  const { session, isLoading } = useSession();
  const { theme } = useTheme();
  const { t } = useTranslation();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!session) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack initialRouteName="(tabs)" >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="themeModal"
        options={{
          presentation: "modal",
          headerTitle: t("Change color pallete"),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="languageModal"
        options={{
          presentation: "modal",
          headerTitle: t("Change language"),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
    </Stack>
  );
}
