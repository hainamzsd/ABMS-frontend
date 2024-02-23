import { LinearGradient } from "expo-linear-gradient";
import { Stack, useNavigation } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";
interface HeaderProps {
    headerTitle: string;
  }
const Header:React.FC<HeaderProps>= ({ headerTitle }) => {
    const navigation = useNavigation();
    return(
    <Stack.Screen options={{

        headerTitle: headerTitle,
        headerTitleStyle: {

          fontWeight: 'bold',
          fontSize: 24,
          color: 'white', 
        },
        headerBackground: () => (
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        ), headerTintColor: 'white',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ marginLeft: 10 }}>
              <ChevronLeft strokeWidth={5} color='white' />
            </View>
          </TouchableOpacity>
        ),
      }} ></Stack.Screen>)
}

export default Header;