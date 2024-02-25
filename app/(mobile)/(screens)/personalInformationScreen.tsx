import { View, Text, SafeAreaView, TextInput } from "react-native";
import React from "react";
import Header from "../../../components/resident/header";
import SHADOW from "../../../constants/shadow";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const personalInformationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <Header headerTitle={t("Update Information")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
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

export default personalInformationScreen;
