import { Redirect } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { View } from "react-native";
import { NativeBaseProvider } from "native-base";
export default function Layout() {
  return (
    <PaperProvider>
      <AuthProvider>
        
    <NativeBaseProvider>
        <Slot />
        </NativeBaseProvider>
      </AuthProvider>
      <Toast/>
    </PaperProvider>
  );
}
