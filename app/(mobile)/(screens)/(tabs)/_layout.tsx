import { Tabs } from "expo-router";
import { Bell, Home, User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/indexStyles";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Badge } from 'native-base';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useSession } from "../../context/AuthContext";

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
  const [unreadCount, setUnreadCount] = useState(0);
  const markNotificationsAsRead = async () => {
    try {
      const response= await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/notification/markAsRead?accountId=${user.Id}`);
      const updatedNotifications = notifications.map((notification:Notification) => ({ ...notification, isRead: true }));
      setNotifications(updatedNotifications);
      console.log(response);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      // Logic to fetch unread notifications count
      // Replace the URL and logic according to your API
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/notification/get-notification?accountId=${user.Id}&skip=0&take=10`);
        if (response.data) {
          setUnreadCount(response.data.length); // Assuming the API returns an array of unread notifications
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUnreadNotifications();
  }, []);

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
            <TouchableOpacity
            onPress={markNotificationsAsRead}>
              <Bell size={30} color={"black"} />
              {unreadCount > 0 && (
                <Badge // Badge to show the count
                  colorScheme="danger"
                  rounded="full"
                  variant="solid"
                  position="absolute"
                  fontSize={10}
                  top={-3}
                  right={-5}
                  zIndex={1}
                >
                  {unreadCount}
                </Badge>
              )}
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
