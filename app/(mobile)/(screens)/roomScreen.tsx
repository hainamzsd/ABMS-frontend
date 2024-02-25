import { SafeAreaView, Text, View } from "react-native";
import Header from "../../../components/resident/header";
import roomInformationStyles from "./styles/roomInformationStyles";
import { CircleUser, CircleUserRound, Info } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Room() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <Header headerTitle={t("Room information")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={roomInformationStyles.headerTextContainer}>
            <Info color={"black"}></Info>
            <Text style={roomInformationStyles.headerText}>{t("Room")}</Text>
          </View>
          <View style={roomInformationStyles.roomBox}>
            <View style={{ borderBottomWidth: 0.5 }}>
              <View style={{ padding: 20 }}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}
                >
                  R2.18A00
                </Text>
                <Text>Times city, Hà Nội</Text>
              </View>
            </View>
            <View style={{ padding: 20 }}>
              <Text>{t("Member")}: 4</Text>
            </View>
          </View>
          <View style={roomInformationStyles.memberInformationContainer}>
            <Text style={roomInformationStyles.memberInformationHeader}>
              {t("Member information")}
            </Text>
            <Text style={{ fontWeight: "300" }}>{t("Registered member")}</Text>
          </View>
          <View style={roomInformationStyles.memberBox}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  roomInformationStyles.memberCircle,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <CircleUser
                  strokeWidth={1.5}
                  size={40}
                  color={"white"}
                ></CircleUser>
              </View>
              <Text style={roomInformationStyles.memberName}>La Canh</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
