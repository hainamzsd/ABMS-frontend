import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ProfileScreen from "../../screens/resident/profileScreen"
import HomeScreen from "../../screens/resident/homeScreen"
import NotificationScreen from "../../screens/resident/notificationScreen"
import { COLORS } from "../../../constants/colors"
import { Home } from "lucide-react-native"

const Tab = createBottomTabNavigator()

export function TabNavigator() {
  return (
   <Tab.Navigator screenOptions = {{
      headerShown:false,
      tabBarStyle:{
        backgroundColor:COLORS.background,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 10,
        justifyContent:'center'
      },
      tabBarItemStyle:{
        margin:5,
        borderRadius:10,
      },
}
    }>
   <Tab.Screen name='Home' component={HomeScreen}
   options={{
      tabBarShowLabel:false,
      tabBarIcon: ({color,size}) => (
      <Home size={30} color={'black'}></Home>
   ),
   
   }} />
   <Tab.Screen name='Profile' component={ProfileScreen} />
   <Tab.Screen name='Notifications' component={NotificationScreen} />
 </Tab.Navigator>
   )
}