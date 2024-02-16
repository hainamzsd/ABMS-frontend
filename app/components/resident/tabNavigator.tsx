import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ProfileScreen from "../../screens/resident/(tabs)/profileScreen"
import HomeScreen from "../../screens/resident/(tabs)"
import NotificationScreen from "../../screens/resident/(tabs)/notificationScreen"
import { COLORS } from "../../../constants/colors"
import { Bell, Home, User } from "lucide-react-native"

const Tab = createBottomTabNavigator()

export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
  
      tabBarStyle: {
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingBottom:0
      },
    }
    }>
        <Tab.Screen name='Home' component={HomeScreen}
          options={{
              tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: '#ccc',
            tabBarLabel:"Trang chủ",
            tabBarLabelStyle:{fontSize:14},
            tabBarIcon: ({ color, size }) => (
              <Home size={30} color={'black'}></Home>

            ), 
          }} />
        <Tab.Screen name='Profile' component={ProfileScreen} 
        options={{
          tabBarActiveTintColor: 'black', 
            tabBarInactiveTintColor: '#ccc',
            tabBarLabel:"Trang cá nhân",
            tabBarLabelStyle:{fontSize:14},
          tabBarIcon: ({ color, size }) => (
            <User size={30} color={'black'}></User>

          ),
        }}/>
        <Tab.Screen name='Notifications' component={NotificationScreen}
        options={{
          tabBarActiveTintColor: 'black', 
            tabBarInactiveTintColor: '#ccc',
            tabBarLabel:"Thông báo",
            tabBarLabelStyle:{fontSize:14},
          tabBarIcon: ({ color, size }) => (
            <Bell size={30} color={'black'}></Bell>

          ), 
        }} />
      </Tab.Navigator>
  )
}