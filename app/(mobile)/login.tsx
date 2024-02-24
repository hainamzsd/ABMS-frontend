import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  SafeAreaView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import SHADOW from "../../constants/shadow";
import { COLORS } from "../../constants/colors";
import { TouchableOpacity } from "react-native";
import { useSession } from "./context/AuthContext";
import { router } from "expo-router";
const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // const HandleLogin = async () => {
  //   const result = await onLogin!(phone, password);
  //   if (result && result.error) {
  //     console.log(result.msg + "aa");
  //   }
  // };
  const { signIn } = useSession();
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <View style={styles.container}>
        {/* <Stack.Screen options={{ headerShown: false }}></Stack.Screen> */}
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Đăng nhập</Text>
            <Text style={styles.subHeader}>
              Nhập thông tin tài khoản của bạn
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            placeholderTextColor="#A9A9A9"
            onChangeText={(text: string) => setPhone(text)}
            value={phone}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#A9A9A9"
            secureTextEntry={true}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
          />
          <View style={{ alignItems: "flex-end" }}>
            <Text>Quên mật khẩu</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              signIn("dwa", "daw");
              router.replace("/");
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Svg viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.Box}>
        <Path
          d="M0 0 L0 50 Q25 60 50 50 Q75 40 100 50 L100 0 Z"
          fill={COLORS.primary}
        />
      </Svg>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    zIndex: 1,
  },

  input: {
    ...SHADOW,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  Box: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
  },
  subHeader: {
    fontSize: 16,
  },
  button: {
    ...SHADOW,
    marginTop: 40,
    padding: 20,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
});

export default LoginScreen;
