import { Link, Stack, useNavigation, usePathname } from "expo-router";
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