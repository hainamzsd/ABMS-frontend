import { Tabs } from "expo-router";
import { Bell, Home, User } from "lucide-react-native";
import { Pressable, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/indexStyles";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Badge, Text } from 'native-base';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useSession } from "../../context/AuthContext";
import { HubConnectionBuilder } from "@microsoft/signalr";
import * as signalR from '@microsoft/signalr';
interface User{
  Id: string;
  BuildingId:string;
}
interface Notification{
  
  notification: {
      id: string;
      buildingId: string;
      title: string;
      content: string;
      type: number
      createTime: Date;
    },
    isRead: boolean
}
export default function _layout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {session} = useSession();
  const user: User = jwtDecode(session as string);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: "#ccc",
          height: 100,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "#ccc",
          tabBarLabel: t("Home"),
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIcon: ({ color, size }) => (
            <Home size={30} color={"black"}></Home>
          ),
        }}
      />
      <Tabs.Screen
        name="profileScreen"
        options={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "#ccc",
          tabBarLabel: t("Profile"),
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIcon: ({ color, size }) => (
            <User size={30} color={"black"}></User>
          ),
        }}
      />
        <Tabs.Screen
        name="notificationScreen"
        options={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "#ccc",
          tabBarLabel: t("Notification"),
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIcon: ({ color, size }) => (
              <Bell size={30} color={"black"} />
          ),
        }}
      />
    </Tabs>
  );
}
