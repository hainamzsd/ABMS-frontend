import { View, Text, SafeAreaView, TextInput, StyleSheet } from "react-native";
import React from "react";
import Header from "../../../components/resident/header";
import SHADOW from "../../../constants/shadow";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react-native";
import { useSession } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import * as yup from "yup";
interface user{
  FullName:string;
  PhoneNumber:string;
  RoomId:string;
  Email:string;
  Id:string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  age: yup.number().typeError('Age must be a number').positive('Age must be positive').required('Age is required'),
});


const personalInformationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const{session } = useSession();
  const user:user = jwtDecode(session as string);
  
  return (
    <>
      <Header headerTitle={t("Update Information")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
        <View
              style={[
                { backgroundColor: theme.sub, borderColor: theme.primary },
                styles.headerBox,
              ]}
            >
              <Info color={"black"} style={{ marginRight: 5 }}></Info>
              <Text>{t("Updated information will be displayed in the profile")}</Text>
            </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ marginBottom: 10 }}>{t("Fullname")}</Text>
            <TextInput
              placeholder="Điền họ và tên"
              placeholderTextColor={"#9C9C9C"}
              style={[
                SHADOW,
                { padding: 15, backgroundColor: "white", borderRadius: 10 },
              ]}
            ></TextInput>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ marginBottom: 10 }}>Email</Text>
            <TextInput
              placeholder="Điền email"
              placeholderTextColor={"#9C9C9C"}
              style={[
                SHADOW,
                { padding: 15, backgroundColor: "white", borderRadius: 10 },
              ]}
            ></TextInput>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    marginTop: 20,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
})

export default personalInformationScreen;
