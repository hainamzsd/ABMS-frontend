import { Link, Redirect, Stack, useNavigation, usePathname } from "expo-router";
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
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";

const Layout = () => {
    const { session, signOut } = useAuth();

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

        return () => { };
    }, []);
    const [isMobile, setIsMobile] = useState(windowWidth < 768);
    if (!session) {
        return <Redirect href="/web/login" />;
    }
    const user: any = jwtDecode(session);
    if (user.Role != 0) {
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
                <Navbar navigation={[
                    // {
                //     name: "Quản lý tài khoản",
                //     href: "/web/Admin"
                // },
                {
                    name: "Quản lý tòa nhà",
                    href: "/web/Admin/buildings"
                }
                ]} />
            )}
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
                    <Stack.Screen name="index"></Stack.Screen>
                    <Stack.Screen name="create"></Stack.Screen>
                </Stack>
            </View>
        </>
    )
}

export default Layout