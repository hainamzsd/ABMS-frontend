import { Tabs } from "expo-router";
import { Bell, Home, User } from "lucide-react-native";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/indexStyles";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function _layout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
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
            <Bell size={30} color={"black"}></Bell>
          ),
        }}
      />
    </Tabs>
  );
}
