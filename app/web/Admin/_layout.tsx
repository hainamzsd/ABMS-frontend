import { Link, Stack, useNavigation, usePathname } from "expo-router";
import { Menu as PaperMenu } from "react-native-paper";
import styles from "./styles"
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

const _layout = () => {
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

    return (
        <>
            {/* <Stack.Screen options={{ headerShown: false }}></Stack.Screen> */}
            {!isMobile && (
                <Navbar />
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

export default _layout