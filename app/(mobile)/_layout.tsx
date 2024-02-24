import React from "react";
import { StatusBar, Text, View, SafeAreaView } from "react-native";
import styles from "./styles/indexStyles";
import { AuthProvider, useSession } from "./context/AuthContext";
import { Slot } from "expo-router";
import { ThemeProvider } from "./context/ThemeContext";
import { Redirect } from "expo-router";
const Root = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Root;
