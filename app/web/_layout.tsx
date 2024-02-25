import { Redirect } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
export default function Layout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </PaperProvider>
  );
}
