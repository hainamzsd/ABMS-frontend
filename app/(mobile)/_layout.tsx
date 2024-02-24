import React, { Fragment } from "react";
import { StatusBar, Text, View } from "react-native";
import styles from "./styles/indexStyles";
import { AuthProvider, useSession } from "./context/AuthContext";
import { Slot } from "expo-router";
import { ThemeProvider } from "./context/ThemeContext";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Stack } from "expo-router";
import LoginScreen from "./login";
const Layout = () => {
  const insets = useSafeAreaInsets();
  return (
    <ThemeProvider>
      <AuthProvider>
        <View
          style={{
            marginBottom: -insets.bottom,
            marginTop: -insets.top,
            flex: 1,
          }}
        >
          <Slot />
        </View>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Layout;
