import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useState } from "react";
import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { ScrollView } from "react-native";
import { isValidPhoneNumber } from "../../../../utils/phoneValidate";
import { styles } from "./styles/styles";
import { isValidEmail } from "../../../../utils/emailValidate";
import { useNavigation } from "expo-router";

const accountDetail = () => {
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhoneNumberState, setIsValidPhoneNumberState] = useState(true);
  const [email, setEmail] = useState("");
  const [isValidEmailState, setIsValidEmailState] = useState(true);

  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone);
    const isValid = isValidPhoneNumber(phone);
    setIsValidPhoneNumberState(isValid);
  };
  const handleEmailChange = (text: string) => {
    setEmail(text);
    const isValid = isValidEmail(text);
    setIsValidEmailState(isValid);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        backgroundColor: "#F9FAFB",
      }}
    >
      <SafeAreaView>
        <ScrollView>
          <Button
            style={{ width: 100, marginBottom: 20 }}
            text="Quay Lại"
            onPress={() => console.log(navigation.canGoBack())}
          ></Button>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
              Thông tin tài khoản
            </Text>
            <Text>Thông tin chi tiết tài khoản của lễ tân</Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Tên
            </Text>
            <Input placeholder="Họ và tên" style={{ width: "100%" }} editable={false}></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Email
            </Text>
            <Input
              placeholder="Email"
              style={[styles.input, !isValidEmailState && styles.invalid]}
              keyboardType="email-address"
              value={email}
              onChangeText={handleEmailChange}
            ></Input>
            {!isValidEmailState && email.length > 0 && (
              <Text style={styles.errorText}>Email không hợp lệ</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Số điện thoại
            </Text>
            <Input
              placeholder="Phone"
              style={[styles.input, !isValidPhoneNumberState && styles.invalid]}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
            ></Input>
            {!isValidPhoneNumberState && phoneNumber.length > 0 && (
              <Text style={styles.errorText}>Số điện thoại không hợp lệ</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default accountDetail;
