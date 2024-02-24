import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useSession } from "../context/AuthContext";
import { Redirect } from "expo-router";
import styles from "../styles/indexStyles";
export default function AppLayout() {
  const { session, isLoading } = useSession();
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
      </Stack>
    </View>
  );
}
