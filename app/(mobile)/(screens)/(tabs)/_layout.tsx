import { Tabs } from "expo-router";
import { COLORS } from "../../../../constants/colors";
import { Bell, Home, User } from "lucide-react-native";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/indexStyles";

export default function _layout() {
    return (
        <View style={styles.container}> 
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    borderTopWidth: 1,
                    borderTopColor: '#ccc',
                    height:100
                },
            }
            }>
                <Tabs.Screen name='index'
                    options={{
                        headerShown:false,
                        tabBarActiveTintColor: 'black',
                        tabBarInactiveTintColor: '#ccc',
                        tabBarLabel: "Trang chủ",
                        tabBarLabelStyle: { fontSize: 14},
                        tabBarIcon: ({ color, size }) => (
                            <Home size={30} color={'black'}></Home>

                        ),
                    }} />
                <Tabs.Screen name='profileScreen'
                    options={{
                        tabBarActiveTintColor: 'black',
                        tabBarInactiveTintColor: '#ccc',
                        tabBarLabel: "Trang cá nhân",
                        tabBarLabelStyle: { fontSize: 14 },
                        tabBarIcon: ({ color, size }) => (
                            <User size={30} color={'black'}></User>

                        ),
                    }} />
                <Tabs.Screen name='notificationScreen'
                    options={{
                        tabBarActiveTintColor: 'black',
                        tabBarInactiveTintColor: '#ccc',
                        tabBarLabel: "Thông báo",
                        tabBarLabelStyle: { fontSize: 14 },
                        tabBarIcon: ({ color, size }) => (
                            <Bell size={30} color={'black'}></Bell>
                        ),
                    }} />
            </Tabs></View>
    )
}