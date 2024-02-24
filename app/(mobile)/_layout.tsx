import React from "react";
import { StatusBar, Text, View } from "react-native";
import styles from "./styles/indexStyles";
import { router, Stack } from "expo-router";
import { AuthProvider, useSession } from "./context/AuthContext";
import { Slot } from "expo-router";
import { Redirect } from "expo-router";
const Root = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default Root;
