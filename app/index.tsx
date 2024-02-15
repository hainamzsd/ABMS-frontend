import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/resident/homeScreen';
import UserAvatar from './screens/resident/userAvatarScreen';
import ProfileScreen from './screens/resident/profileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const App = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}  />
        <Stack.Screen name="UserAvatar" component={UserAvatar} />
      </Stack.Navigator>
    );
}

export default App;