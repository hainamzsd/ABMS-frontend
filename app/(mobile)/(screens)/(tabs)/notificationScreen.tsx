import {
  FlatList,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { notificationScreenStyles } from "../styles/notificationScreenStyles";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const NotificationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <ScrollView style={{ paddingHorizontal: 26 }}>
          <Text
            style={{ marginVertical: 20, fontSize: 24, fontWeight: "bold" }}
          >
            {t("Notification list")}
          </Text>
          <TouchableOpacity style={notificationScreenStyles.box}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Thông báo chung
              </Text>
              <Text>
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem{" "}
              </Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: "300", color: "#9C9C9C" }}>
              22 tháng 1, 2024
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default NotificationScreen;
