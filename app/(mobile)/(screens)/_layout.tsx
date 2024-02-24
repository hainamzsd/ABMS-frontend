import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useSession } from "../context/AuthContext";
import { Redirect } from "expo-router";
import styles from "../styles/indexStyles";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
export default function AppLayout() {
  const { session, isLoading } = useSession();
  const { theme } = useTheme();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!session) {
    return <Redirect href="/login" />;
  }
  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="themeModal"
          options={{
            presentation: "modal",
            title: "Đổi màu",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 24,
            },
          }}
        />
      </Stack>
    </View>
  );
}
