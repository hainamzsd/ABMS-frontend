import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/resident/homeScreen';
import UserAvatar from './screens/resident/userAvatarScreen';
import ProfileScreen from './screens/resident/profileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabNavigator } from './components/resident/tabNavigator';

const App = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    return (
      <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={TabNavigator}  />
        <Stack.Screen name="Profile" component={TabNavigator}  />
        <Stack.Screen name="UserAvatar" component={UserAvatar} />
      </Stack.Navigator>
    );
}

export default App;