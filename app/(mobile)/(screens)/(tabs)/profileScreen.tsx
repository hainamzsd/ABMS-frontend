import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../styles/indexStyles";
import stylesProfileScreen from "../styles/profileScreenStyles";
import {
  ChevronRight,
  KeyRound,
  Languages,
  Palette,
  Pencil,
} from "lucide-react-native";
import { Link, useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const ProfileScreen = () => {
  const { signOut } = useSession();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <StatusBar barStyle="dark-content"></StatusBar>
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={[0, 0]}
            end={[1, 1]}
            style={{
              width: 350,
              height: 350,
              borderRadius: 225,
              position: "absolute",
              top: -40,
              right: -100,
            }}
          />
        </View>
        <ScrollView style={{ marginHorizontal: 26 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 30,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.headerText}>{t("Account")}</Text>
              <Text style={styles.normalText}>{t("ManageAccount")}</Text>
            </View>
            <TouchableOpacity>
              <Image
                style={stylesProfileScreen.avatar}
                source={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiGAdWpsJQwrcEtjaAxG-aci3VxO7n2qYey0tI9Syx4Ai9ziAUea6-dAjlaGmRUNQW-Lo&usqp=CAU",
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={stylesProfileScreen.box}>
            <View style={{ flexDirection: "row" }}>
              <Text>{t("Fullname")}:</Text>
              <Text
                style={{ marginLeft: 5, fontWeight: "bold", marginBottom: 5 }}
              >
                Hoa la canh
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>{t("Phone")}:</Text>
              <Text style={{ marginLeft: 5 }}>0123 232 2312</Text>
            </View>
          </View>

          <TouchableOpacity style={stylesProfileScreen.room}>
            <Image
              style={{
                width: 56,
                height: 56,
              }}
              source={require("../../../../assets/images/house1.png")}
            ></Image>
            <View
              style={{
                marginLeft: 20,
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                R2.18A00
              </Text>
              <Text style={{ fontWeight: "300" }}>Times city, Hà Nội</Text>
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 30 }}>
            <View style={stylesProfileScreen.feature}>
              <Link href="/(mobile)/(screens)/personalInformationScreen">
                <View style={{ flexDirection: "row" }}>
                  <Pencil
                    color={"black"}
                    style={{ marginRight: 15 }}
                    strokeWidth={1.5}
                  ></Pencil>
                  <Text>{t("Update Information")}</Text>
                </View>
              </Link>
            </View>
            <View style={stylesProfileScreen.feature}>
              <Link href="/(mobile)/(screens)/changePasswordScreen">
                <View style={{ flexDirection: "row" }}>
                  <KeyRound
                    color={"black"}
                    style={{ marginRight: 15 }}
                    strokeWidth={1.5}
                  ></KeyRound>
                  <Text>{t("Change password")}</Text>
                </View>
              </Link>
            </View>
            <View style={stylesProfileScreen.feature}>
              <Link href={"/themeModal"}>
                <View style={{ flexDirection: "row" }}>
                  <Palette
                    color={"black"}
                    style={{ marginRight: 15 }}
                    strokeWidth={1.5}
                  ></Palette>
                  <Text>{t("Change color pallete")}</Text>
                </View>
              </Link>
            </View>
            <View style={stylesProfileScreen.feature}>
              <Link href={"/languageModal"}>
                <View style={{ flexDirection: "row" }}>
                  <Languages
                    color={"black"}
                    style={{ marginRight: 15 }}
                    strokeWidth={1.5}
                  ></Languages>
                  <Text>{t("Change language")}</Text>
                </View>
              </Link>
            </View>
          </View>
          <TouchableOpacity
            style={[
              stylesProfileScreen.logoutButton,
              { backgroundColor: theme.primary },
            ]}
            onPress={() => {
              signOut();
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {t("Logout")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProfileScreen;