import React, { Fragment, useEffect } from "react";
import { Platform, StatusBar, Text, View } from "react-native";
import styles from "./styles/indexStyles";
import { AuthProvider, useSession } from "./context/AuthContext";
import { router, Slot } from "expo-router";
import { ThemeProvider } from "./context/ThemeContext";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Stack } from "expo-router";
import LoginScreen from "./login";
import * as Notifications from 'expo-notifications';
import { LanguageProvider } from "./context/LanguageContext";
import { usePushNotifications } from "./context/usePushNotifcation";
import { NativeBaseProvider } from "native-base";
import Toast from "react-native-toast-message";
const Layout = () => {
  const insets = useSafeAreaInsets();
  const { expoPushToken, notification } = usePushNotifications();
  
  // useEffect(() => {
  //   if (notification && notification.request.content.data.postId) {
  //     // Navigate to the post detail screen using the postId from the notification data
  //     navigator.('PostDetail', { postId: notification.request.content.data.postId }); // Assuming you have navigation setup
  //   }
  // }, [notification]);\
  console.log(expoPushToken?.data )
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
       
          <View
            style={{
              marginBottom: -insets.bottom,
              marginTop: -insets.top,
              flex: 1,
            }}
          >
             <NativeBaseProvider >
          <Slot />
         </NativeBaseProvider>
          </View>
          <Toast/>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Layout;
