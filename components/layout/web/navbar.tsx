import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Pressable,
} from "react-native";
import { Link, Stack, router, useNavigation, usePathname } from "expo-router";
import { Menu as PaperMenu } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../app/web/context/AuthContext";
import NotificationButton from "../../ui/notifications";
import { Avatar } from "native-base";
import { LogOut, UserCircle, UserRound } from "lucide-react-native";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Toast from "react-native-toast-message";
interface NavigationItem {
    name: string;
    href: any;
  }

  interface User{
    Id: string;
    BuildingId:string;
  }
  interface FetchUser{
    id: string;
    username: string;
    fullName: string;
    email: string;
    avatar: string;
    buildingId:string;
    phoneNumber:string;
    role:number;
  }
  interface NavbarProps {
    navigation: Navigation;
    profile: boolean;
    notification: boolean;
    profilePath?:string;
    // Add any additional prop types here
  }
  type Navigation = NavigationItem[];
  const Navbar: React.FC<NavbarProps> = ({ navigation,notification,profile,profilePath }) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const {signOut} = useAuth();
    const {session} = useAuth();
    const userInfo:User = jwtDecode(session as string);
    const [user, setUser] = useState<FetchUser>();
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/account/get/${userInfo.Id}`);
          if(response.data.statusCode==200){
            setUser(response.data.data);
          }
          else{
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Lỗi',
                text2: 'Không thể lấy thông tin người dùng',
                autoHide: true,
            })
          }
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Lỗi',
                text2: 'Không thể lấy thông tin người dùng',
                autoHide: true,
            })
          console.error("Error fetching user info:", error);
        }
      }
    fetchUser();
      
    }, [session])
    
    const pathName = usePathname();
    return (
        <View
            style={{
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
                zIndex: 1,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 100,
                    height: 80,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            marginRight: 20,
                        }}
                        source={require("../../../assets/images/adminLogo.png")}
                    />
                    <View style={{ marginLeft: 8, flexDirection: "row" }}>
                        {navigation.map((item, index) => (
                            <Link href={item.href} key={index}>
                                <TouchableOpacity
                                    style={{
                                        marginRight: 30,
                                        paddingVertical: 28,
                                        borderBottomWidth: 2,
                                        borderBottomColor:
                                            pathName === item.href ? "#374151" : "transparent",
                                    }}
                                    onPress={() => console.log(`Navigating to ${item.href}`)}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            color: pathName === item.href ? "#333" : "#6B7280",
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        ))}
                    </View>
                </View>
                <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                  {notification&&
                  <NotificationButton></NotificationButton>
                  }
                  
                <PaperMenu
                    style={{ padding: 8, marginTop: 20 }}
                    visible={visible}
                    contentStyle={{ backgroundColor: "white",marginTop:30,
                paddingHorizontal:20 }}
                    onDismiss={closeMenu}
                    anchor={
                        <Pressable onPress={openMenu}>
                            <Avatar
                                borderWidth={3}
                                borderColor={"#374151"}
                                style={{ width: 54, height: 54, borderRadius: 26 }}
                                source={user?.avatar ? { uri: user?.avatar } : require('../../../assets/images/icon.png')}
                
                            />
                        </Pressable>
                    }
                >
                    <PaperMenu.Item title={user?.fullName}
                    titleStyle={{fontSize:16, fontWeight:'600'}}></PaperMenu.Item>
                    {profile&&
                    <PaperMenu.Item onPress={() => {
                        router.push(profilePath as any)
                    }} title="Trang cá nhân"
                    style={{alignItems:'center'}}
                    leadingIcon={()=>(<UserCircle size={20}></UserCircle>)}
                    />
                    }
                    
                    <PaperMenu.Item 
                     style={{alignItems:'center'}}
                    leadingIcon={()=>(<LogOut size={20}></LogOut>)}
                    onPress={signOut} title="Đăng xuất" />
                </PaperMenu>
                </View>
            </View>
        </View>
    )
}

export default Navbar