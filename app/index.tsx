import { View, Text, StatusBar, SafeAreaView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserAvatar from './screens/resident/userAvatarScreen';
import { TabNavigator } from './components/resident/tabNavigator';
import { COLORS } from '../constants/colors';
import styles from './styles/indexStyles';

const App = () => {
    const Stack = createNativeStackNavigator();
    return (
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'}></StatusBar>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={TabNavigator} options={{headerShown:false}} />
        <Stack.Screen name="Profile" component={TabNavigator}  />
        <Stack.Screen name="UserAvatar" component={UserAvatar} />
      </Stack.Navigator>
      </SafeAreaView>
    );
}

export default App;