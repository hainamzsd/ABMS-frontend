import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Header from "../../../components/resident/header";
import SHADOW from "../../../constants/shadow";
import { validatePassword } from "../../../utils/passwordValidate";
import { useTheme } from "../context/ThemeContext";

const changePasswordScreen = () => {
  const { theme } = useTheme();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const isOldPasswordValid = validatePassword(oldPassword);
  const isNewPasswordValid = validatePassword(newPassword);
  const isReEnterPasswordValid = newPassword === reEnterPassword;

  return (
    <>
      <Header headerTitle="Đổi mật khẩu"></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 16 }}>
              Mật khẩu phải tối thiểu 8 kí tự và bao gồm: chữ hoa, chữ thường,
              số, kí tự đặc biệt
            </Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text>Mật khẩu cũ</Text>
            </View>
            <TextInput
              placeholder="Điền mật khẩu cũ"
              placeholderTextColor={"#9C9C9C"}
              style={[
                styles.input,
                { borderColor: isOldPasswordValid ? "#CCCCCC" : "red" },
              ]}
              onChangeText={setOldPassword}
              value={oldPassword}
              secureTextEntry
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text>Mật khẩu mới</Text>
            </View>
            <TextInput
              placeholder="Điền mật khẩu mới"
              placeholderTextColor={"#9C9C9C"}
              style={[
                styles.input,
                { borderColor: isNewPasswordValid ? "#CCCCCC" : "red" },
              ]}
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text>Nhập lại mật khẩu</Text>
            </View>
            <TextInput
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={"#9C9C9C"}
              style={[
                styles.input,
                { borderColor: isReEnterPasswordValid ? "#CCCCCC" : "red" },
              ]}
              onChangeText={setReEnterPassword}
              value={reEnterPassword}
              secureTextEntry
            />
          </View>
          {!isReEnterPasswordValid && (
            <Text style={styles.errorText}>Mật khẩu không khớp</Text>
          )}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    ...SHADOW,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  errorText: {
    color: "red",
  },
  button: {
    marginTop: 40,
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
});

export default changePasswordScreen;
