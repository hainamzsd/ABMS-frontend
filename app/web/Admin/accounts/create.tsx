import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useState } from "react";
import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { ScrollView } from "react-native";
import { isValidPhoneNumber } from "../../../../utils/phoneValidate";
import styles from "./styles";
import { isValidEmail } from "../../../../utils/emailValidate";
import { useNavigation } from "expo-router";
import { validatePassword } from "../../../../utils/passwordValidate";
import { SIZES } from "../../../../constants";

const CreateAccount = () => {
    const navigation = useNavigation();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [isValidPhoneNumberState, setIsValidPhoneNumberState] = useState(true);
    const [email, setEmail] = useState("");
    const [isValidEmailState, setIsValidEmailState] = useState(true);
    const [password, setPassword] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [matchPassword, setMatchPassword] = useState(true);

    const handleMatchPassword = (text: string) => {
        setConfirmPassword(text);
        if (text === password) {
            setMatchPassword(true);
        } else setMatchPassword(false);
    }

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

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        const isValid = validatePassword(text);
        setIsValidPassword(isValid);
    }

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 30,
                paddingVertical: 30,
                backgroundColor: "#F9FAFB",
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
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
                        <Text>Thông tin chi tiết tài khoản của <Text style={{ fontWeight: 'bold', fontSize: SIZES.small }}>Quản lý tòa nhà </Text></Text>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Tên
                        </Text>
                        <Input placeholder="Họ và tên" style={{ width: "100%" }}></Input>
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
                            Password
                        </Text>
                        <Input
                            placeholder="Password"
                            secureTextEntry={true}
                            style={[styles.input, !isValidPassword && styles.invalid]}
                            value={password}
                            onChangeText={handlePasswordChange}
                        ></Input>
                        {!isValidPassword && password.length > 0 && (
                            <Text style={styles.errorText}>Mật khẩu không hợp lệ</Text>
                        )}
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Confirm Password
                        </Text>
                        <Input
                            placeholder="Confirm Password"
                            style={[styles.input, !matchPassword && styles.invalid]}
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={handleMatchPassword}
                        ></Input>
                        {!matchPassword && confirmPassword.length > 0 && (
                            <Text style={styles.errorText}>Mật khẩu không khớp</Text>
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
                    <View style={{ marginTop: SIZES.xSmall }}>
                        <Button text="Tạo tài khoản" />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default CreateAccount;
