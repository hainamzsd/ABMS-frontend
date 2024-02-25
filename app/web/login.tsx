import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/ui/button";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";

const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 40 }}>
        <Text style={styles.welcomeText}>Chào mừng quay lại</Text>
        <Text>Cổng đăng nhập quản lý chung cư</Text>
      </View>
      <TextInput
        style={styles.inputField}
        placeholder="Số điện thoại"
        placeholderTextColor="#A1A1A1"
      />
      <TextInput
        style={styles.inputField}
        placeholder="Mật khẩu"
        placeholderTextColor="#A1A1A1"
        secureTextEntry
      />
      <Button
        text="Đăng nhập"
        style={{ width: 500 }}
        onPress={() => {
          login("a", "a");
          router.replace("/web/(CMB)");
        }}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  welcomeText: {
    marginBottom: 10,
    fontSize: 24,
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
