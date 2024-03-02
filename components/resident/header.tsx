import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack, useNavigation } from "expo-router";
import { ChevronLeft, MenuSquare } from "lucide-react-native";
import { TouchableOpacity, View,Pressable } from "react-native";
import { useTheme } from "../../app/(mobile)/context/ThemeContext";
interface HeaderProps {
  headerTitle: string;
  headerRight?: boolean | null;
  rightPath?: string| any;
}

const Header: React.FC<HeaderProps> = ({ headerTitle, headerRight, rightPath }) => {
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
              <ChevronLeft strokeWidth={2} color="black" size={30} />
            </View>
          </Pressable>
        ),
        headerRight: () => 
        headerRight && rightPath && 
          <View style={{ marginRight: 10 }}>
          <Link href={rightPath}>
           <MenuSquare strokeWidth={2} color="black" />
       </Link>

         </View>
      }}
    ></Stack.Screen>
  );
};

export default Header;
