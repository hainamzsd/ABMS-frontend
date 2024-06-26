import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/ui/button";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native-paper";
import { jwtDecode } from "jwt-decode";
import { SHADOWS } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
interface User {
  PhoneNumber: string;
  Email: string;
  FullName: string;
  Role: number;
}

const Login: React.FC = () => {
  const { signIn } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const onPress = async () => {
    setIsLoading(true);
    try {

      const token = await signIn(phone, password)
      console.log(token);
      if (token.data.statusCode === 500) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Sai tên đăng nhập hoặc mật khẩu",
        });
      }
      else {
        Toast.show({
          type: "success",
          text1: "Đăng nhập thành công",
          position: 'bottom'
        });
        const data: User = jwtDecode(token.data.data);
        console.log("dataUser", data);
        if (data.Role === 3) {
          Toast.show({
            type: "error",
            text1: "Lỗi",
            text2: "Tài khoản không có quyền truy cập",
          });
          return;
        }
        if (data.Role == 1) {
          router.replace('/web/CMB/')
        }
        else if (data.Role == 2) {
          router.replace('/web/Receptionist/')
        }
        else {
          router.replace('/web/Admin/')
        }
        console.log(data);
      }
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: e.message || 'Lỗi hệ thống! Vui lòng thử lại sau.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <LinearGradient colors={['#7265a5', '#a66a4b']} style={styles.container}>
      <ImageBackground imageStyle={{ opacity: 0.1, marginVertical: 10 }} source={{ uri: "../../assets/images/logoGradient1.png" }} resizeMode="contain" style={styles.wrapper} >
        <View style={{ marginBottom: 40 }}>
          <Text style={styles.welcomeText}>Chào mừng quay lại</Text>
          <Text style={{ textAlign: 'center', fontSize: 15 }}>Cổng đăng nhập quản lý chung cư</Text>
        </View>
        <TextInput
          style={styles.inputField}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor="#A1A1A1"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#A1A1A1"
          secureTextEntry
        />
        {isLoading && <ActivityIndicator style={{marginBottom: 8}} size={'large'} color="#171717"></ActivityIndicator>}
        <Button
          text="Đăng nhập"
          style={{ width: 500, backgroundColor: 'rgba(90, 75, 144, 0.738)'}}
          onPress={onPress}
        ></Button>
        {/* </ImageBackground> */}
      </ImageBackground>
    </LinearGradient >

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 75,
    paddingVertical: 90,
    backgroundColor: 'rgba(251, 251, 251, 0.9)',
    ...SHADOWS.medium
  },
  welcomeText: {
    marginBottom: 10,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  inputField: {
    width: 500,
    backgroundColor: "#FFF",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Login;
