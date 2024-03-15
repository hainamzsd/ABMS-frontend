import { Redirect } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { View } from "react-native";
import { NativeBaseProvider } from "native-base";
import { ThemeProvider } from "../(mobile)/context/ThemeContext";
export default function Layout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <ThemeProvider> 
         <NativeBaseProvider>
          <Slot />
         </NativeBaseProvider>
        </ThemeProvider>
      </AuthProvider>
      <Toast/>
    </PaperProvider>
  );
}
