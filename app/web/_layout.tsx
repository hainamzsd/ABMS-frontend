import { Redirect } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Slot } from "expo-router";
import { PaperProvider } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { View } from "react-native";
import { NativeBaseProvider } from "native-base";
import { ThemeProvider } from "../(mobile)/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
export default function Layout() {
  
const config = {
  dependencies: {
    'linear-gradient': LinearGradient
  }
};

  return (
    <PaperProvider>
      <AuthProvider>
        <ThemeProvider> 
         <NativeBaseProvider config={config}>
          <Slot />
         </NativeBaseProvider>
        </ThemeProvider>
      </AuthProvider>
      <Toast/>
    </PaperProvider>
  );
}
