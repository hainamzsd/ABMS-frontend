import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Pressable,
} from "react-native";
import { Link, Stack, useNavigation, usePathname } from "expo-router";
import { Menu as PaperMenu } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../app/web/context/AuthContext";
interface NavigationItem {
    name: string;
    href: any;
  }
  
  type Navigation = NavigationItem[];
  const Navbar: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const {signOut} = useAuth();

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
                <PaperMenu
                    style={{ padding: 8, marginTop: 20 }}
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Pressable onPress={openMenu}>
                            <Image
                                style={{ width: 54, height: 54, borderRadius: 26 }}
                                source={{
                                    uri: "https://i.ytimg.com/vi/7KxBpKTIl98/maxresdefault.jpg",
                                }}
                            />
                        </Pressable>
                    }
                >
                    <PaperMenu.Item onPress={signOut} title="Đăng xuất" />
                </PaperMenu>
            </View>
        </View>
    )
}

export default Navbar