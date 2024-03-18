import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useSession } from "../context/AuthContext";
import { Redirect } from "expo-router";
import styles from "../styles/indexStyles";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../../../components/resident/loading";
import { jwtDecode } from "jwt-decode";
export default function AppLayout() {
  const { session, isLoading, signOut } = useSession();
  const { theme } = useTheme();
  const { t } = useTranslation();
  // if(user.Role!=3){
  //   signOut();
  // }
  // if (isLoading) {
  //   return <LoadingComponent loading={isLoading}></LoadingComponent>;
  // }
  if (!session ) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack initialRouteName="(tabs)" >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(utility)/utilityListScreen"  />
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
