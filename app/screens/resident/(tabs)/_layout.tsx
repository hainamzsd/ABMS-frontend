import { Tabs } from "expo-router";
import { COLORS } from "../../../../constants/colors";
import { Bell, Home, User } from "lucide-react-native";

export default function _layout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,

            tabBarStyle: {
                backgroundColor: COLORS.background,
                borderTopWidth: 1,
                borderTopColor: '#ccc',
                paddingBottom: 0
            },
        }
        }>
            <Tabs.Screen name='screens/resident/index'
                options={{
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: '#ccc',
                    tabBarLabel: "Trang chủ",
                    tabBarLabelStyle: { fontSize: 14 },
                    tabBarIcon: ({ color, size }) => (
                        <Home size={30} color={'black'}></Home>

                    ),
                }} />
            <Tabs.Screen name='screens/resident/profile'
                options={{
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: '#ccc',
                    tabBarLabel: "Trang cá nhân",
                    tabBarLabelStyle: { fontSize: 14 },
                    tabBarIcon: ({ color, size }) => (
                        <User size={30} color={'black'}></User>

                    ),
                }} />
            <Tabs.Screen name='Notifications' 
                options={{
                    tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: '#ccc',
                    tabBarLabel: "Thông báo",
                    tabBarLabelStyle: { fontSize: 14 },
                    tabBarIcon: ({ color, size }) => (
                        <Bell size={30} color={'black'}></Bell>

                    ),
                }} />
        </Tabs>
    )
}