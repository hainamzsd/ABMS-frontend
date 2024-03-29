import { Link, Redirect, Stack, useNavigation, usePathname } from "expo-router";
import { Menu as PaperMenu } from "react-native-paper";
import {
    Dimensions,
    Image,
    Modal,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/layout/web/navbar";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const _layout = () => {
    const {session, signOut}  = useAuth();
    const navigation:any[] = [
      { name: "Trang chính", href: "/web/Receptionist" },
      {
        name: "Quản lý tài khoản",
        href: "/web/Receptionist/accounts",
      },
      {
        name: "Quản lý dịch vụ",
        href: "/web/Receptionist/services",
      },
      {
        name: "Quản lý tiện ích",
        href: "/web/Receptionist/utilities",
      },
      {
        name: "Quản lý bài viết",
        href: "/web/Receptionist/posts",
      },
      {
        name: "Quản lý căn hộ",
        href: "/web/Receptionist/rooms",
      },
      {
        name: "Quản lý biểu phí",
        href: "/web/Receptionist/fees",
      },
    ];
    const [windowWidth, setWindowWidth] = useState(
        Dimensions.get("window").width,
    );
    useEffect(() => {
        const updateDimensions = () => {
          const width = Dimensions.get("window").width;
          setWindowWidth(width);
          setIsMobile(width < 768);
        };
    
        Dimensions.addEventListener("change", updateDimensions);
    
        return () => {};
      }, []);
    const [isMobile, setIsMobile] = useState(windowWidth < 768);
    if (!session) {
        return <Redirect href="/web/login" />;
      }
      const userData:any = jwtDecode(session);
      if(userData.Role!=2){
        Toast.show({
            type: 'error',
            text1: 'Bạn không có quyền truy cập trang này',
        })
        signOut();
      }
    return (
        <>
            {/* <Stack.Screen options={{ headerShown: false }}></Stack.Screen> */}
            {!isMobile && (
                <Navbar navigation={navigation} 
                notification={true}
                profile={true}
                profilePath="/web/Receptionist/profile"
                />
            )}
            <View style={styles.container}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="/web/Admin"></Stack.Screen>
                    <Stack.Screen name="/web/Adnmin/accounts"></Stack.Screen>
                </Stack>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50
      },
      menu: {
        paddingHorizontal: 16,
        paddingBottom: 20
      },
      menuItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
      }
});

export default _layout