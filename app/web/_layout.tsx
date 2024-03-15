import { Redirect } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { NativeBaseProvider } from "native-base";
import { ThemeProvider } from "../(mobile)/context/ThemeContext";
export default function Layout() {
  return (
    <NativeBaseProvider>
      <ThemeProvider>
        <PaperProvider>
          <AuthProvider>
            <Slot />
          </AuthProvider>
          <Toast />
        </PaperProvider>
      </ThemeProvider>
    </NativeBaseProvider>
  );
}
