import React, { useEffect, useState } from "react";
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
import { Link, Redirect, Stack, router, usePathname } from "expo-router";
import styles from "./styles";
import SHADOW from "../../../constants/shadow";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { Menu as PaperMenu } from "react-native-paper";
import { Menu } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";
const _layout = () => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const {session} = useAuth();
 
  const { signOut} = useAuth();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [more, setMore] = React.useState(false);
  const openMore = () => setMore(true);
  const closeMore = () => setMore(false);
  const navigation:any[] = [
    { name: "Trang chính", href: "/web/CMB" },
    {
      name: "Quản lý tài khoản",
      href: "/web/CMB/accounts",
    },
    {
      name: "Quản lý tòa nhà",
      href: "/web/CMB/buildings",
    },
    {
      name: "Quản lý bài viết",
      href: "/web/CMB/posts",
    },
  ];
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://example.com/avatar.jpg",
  };

  const pathName = usePathname();
  console.log(session);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );
  const [isMobile, setIsMobile] = useState(windowWidth < 768);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const width = Dimensions.get("window").width;
      setWindowWidth(width);
      setIsMobile(width < 768);
    };

    Dimensions.addEventListener("change", updateDimensions);

    return () => {};
  }, []);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  if (!session) {
    return <Redirect href="/web/login" />;
  }
  const userData:any = jwtDecode(session);
  if(userData.Role!=1){
    Toast.show({
        type: 'error',
        text1: 'Bạn không có quyền truy cập trang này',
    })
    signOut();
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }}></Stack.Screen>

      {!isMobile && (
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
                          color: pathName.includes(item.href)  ? "#333" : "#6B7280",
                        }}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                ))}
                <PaperMenu
              style={{ padding: 8, marginTop: 50 }}
              visible={more}
              onDismiss={closeMore}
              anchor={
                <TouchableOpacity
                  style={{
                    marginRight: 30,
                    paddingVertical: 28,
                    
                  }}
                  onPress={openMore}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >Xem thêm
                  </Text>
                </TouchableOpacity>
              }
            >
              <PaperMenu.Item onPress={() => {
                signOut();
                // router.push("/");
                }} title="Quản lý thu"/>
            
            </PaperMenu>
              </View>
              
            </View>
            <PaperMenu
              style={{ padding: 8, marginTop: 50 }}
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
              <PaperMenu.Item onPress={() => {
                signOut();
                router.replace("/web/login");
                }} title="Logout" />
            </PaperMenu>
          </View>
        </View>
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <SafeAreaView
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 16,
            height: 64,
          }}
        >
          <TouchableOpacity onPress={toggleMenu}>
            <Menu width={32} height={32} />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      <Modal visible={menuVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={{ alignItems: "flex-end", padding: 16 }}>
            <TouchableOpacity onPress={toggleMenu}>
              <Text style={{ fontSize: 20 }}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menu}>
            {navigation.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  console.log(`Navigating to ${item.href}`);
                  toggleMenu();
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: pathName === item.href ? "#333" : "#555",
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
            {user ? (
              <View style={styles.menuItem}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{ width: 54, height: 54, borderRadius: 28 }}
                    source={{
                      uri: "https://i.ytimg.com/vi/7KxBpKTIl98/maxresdefault.jpg",
                    }}
                  />
                  <View style={{ marginLeft: 8 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {user.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#555" }}>
                      {user.email}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => console.log("Sign out")}>
                  <Text style={{ fontSize: 16, color: "#555", marginTop: 8 }}>
                    Sign out
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => console.log("Sign in")}
              >
                <Text style={{ fontSize: 16, color: "#555" }}>Sign in</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="/screens/CMB"></Stack.Screen>
          <Stack.Screen name="accounts"></Stack.Screen>
        </Stack>
      </View>
    </>
  );
};

export default _layout;
