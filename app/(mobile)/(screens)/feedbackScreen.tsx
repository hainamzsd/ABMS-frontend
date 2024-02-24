import { SafeAreaView, Text, TextInput, View } from "react-native";
import Header from "../../../components/resident/header";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function FeedBack() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <Header headerTitle={t("Feedback")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 16 }}>Chọn loại dịch vụ</Text>
            <TextInput style={{ height: 20 }}></TextInput>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
