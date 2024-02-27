import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";
import { notificationScreenStyles } from "../styles/notificationScreenStyles";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import SHADOW from "../../../../constants/shadow";
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
          <Pressable
            style={[
              {
                flexDirection: "row",
                borderRadius: 10,
                backgroundColor: "white",
              },
              SHADOW,
            ]}
          >
            <View
              style={{
                height: "100%",
                width: 20,
                backgroundColor: theme.primary,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            ></View>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Thông báo chung
              </Text>
              <Text>
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem{" "}
              </Text>
              <Text
                style={{ fontSize: 12, fontWeight: "300", color: "#9C9C9C" }}
              >
                22 tháng 1, 2024
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default NotificationScreen;
