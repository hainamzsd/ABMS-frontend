import { LinearGradient } from "expo-linear-gradient";
import { Stack, useNavigation } from "expo-router";
import { ChevronLeft, MenuSquare } from "lucide-react-native";
import { TouchableOpacity, View,Pressable } from "react-native";
import { useTheme } from "../../app/(mobile)/context/ThemeContext";
interface HeaderProps {
  headerTitle: string;
  headerRight?: boolean | null;
}

const Header: React.FC<HeaderProps> = ({ headerTitle, headerRight }) => {
  const { theme } = useTheme();

  const navigation = useNavigation();
  return (
    <Stack.Screen
      options={{
        headerTitle: headerTitle,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24,
          color: "black",
          
        },
        headerTitleAlign:'center',
        headerBackground: () => (
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        ),
        headerTintColor: "black",
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <View style={{ marginLeft: 10 }}>
              <ChevronLeft strokeWidth={2} color="black" />
            </View>
          </Pressable>
        ),
        headerRight: () => 
        headerRight &&
          <Pressable>
          <View style={{ marginRight: 10 }}>
           <MenuSquare strokeWidth={2} color="black" />
         </View>
       </Pressable>
      }}
    ></Stack.Screen>
  );
};

export default Header;
