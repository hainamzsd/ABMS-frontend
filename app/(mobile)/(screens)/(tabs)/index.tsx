import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../styles/indexStyles";
import stylesHomeScreen from "../styles/homeScreenStyles";
import {
  Layers3,
  MessageSquareDiff,
  Phone,
  PhoneOutgoing,
  ReceiptText,
  Settings,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const HomeScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <StatusBar barStyle="dark-content"></StatusBar>
        <Stack.Screen options={{ headerShown: false }}></Stack.Screen>
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={[1, 0]}
            end={[1, 1]}
            style={{
              width: 350,
              height: 350,
              borderRadius: 225,
              position: "absolute",
              top: -50,
              left: -80,
            }}
          />
        </View>
        <ScrollView style={{ paddingHorizontal: 26 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 30,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.headerText}>{t("Greet")}, Hoa La</Text>
              <Text style={styles.normalText}>{t("SubGreet")}</Text>
            </View>
            <Link href="/(mobile)/(screens)/userAvatarScreen">
              <Image
                style={stylesHomeScreen.avatar}
                source={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiGAdWpsJQwrcEtjaAxG-aci3VxO7n2qYey0tI9Syx4Ai9ziAUea6-dAjlaGmRUNQW-Lo&usqp=CAU",
                }}
              />
            </Link>
          </View>
          <TouchableOpacity style={stylesHomeScreen.room}>
            <Link href={"/(mobile)/(screens)/roomScreen"}>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
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
              </View>
            </Link>
          </TouchableOpacity>

          <View style={stylesHomeScreen.featureContainer}>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
              <View
                style={[
                  stylesHomeScreen.circle,
                  { backgroundColor: theme.sub },
                ]}
              >
                <Layers3 color={"black"} strokeWidth={1.5}></Layers3>
              </View>
              <Text>{t("Utility")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
              <View
                style={[
                  stylesHomeScreen.circle,
                  { backgroundColor: theme.sub },
                ]}
              >
                <Settings color={"black"} strokeWidth={1.5}></Settings>
              </View>
              <Text>{t("Service")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
              <View
                style={[
                  stylesHomeScreen.circle,
                  { backgroundColor: theme.sub },
                ]}
              >
                <ReceiptText color={"black"} strokeWidth={1.5}></ReceiptText>
              </View>
              <Text>{t("Bill")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
              <Link href={"/(mobile)/(screens)/feedbackScreen"}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <View
                    style={[
                      stylesHomeScreen.circle,
                      { backgroundColor: theme.sub },
                    ]}
                  >
                    <MessageSquareDiff
                      color={"black"}
                      strokeWidth={1.5}
                    ></MessageSquareDiff>
                  </View>
                  <Text>{t("Feedback")}</Text>
                </View>
              </Link>
            </TouchableOpacity>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
              <Link href={"/(mobile)/(screens)/hotlineScreen"}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <View
                    style={[
                      stylesHomeScreen.circle,
                      { backgroundColor: theme.sub },
                    ]}
                  >
                    <PhoneOutgoing
                      color={"black"}
                      strokeWidth={1.5}
                    ></PhoneOutgoing>
                  </View>
                  <Text>{t("Contact")}</Text>
                </View>
              </Link>
            </TouchableOpacity>
          </View>

          <View style={stylesHomeScreen.room}>
            <View style={{ flex: 0.8 }}>
              <Text style={styles.normalText}>{t("HotlineText")}</Text>
              <Text style={{ fontWeight: "bold" }}>0933 123 242</Text>
            </View>
            <View style={{ flex: 0.3 }}>
              <View style={stylesHomeScreen.callBox}>
                <Phone fill={"white"} color={"white"} strokeWidth={0}></Phone>
                <Text
                  style={{ fontWeight: "bold", color: "white", marginLeft: 3 }}
                >
                  {t("Call")}
                </Text>
              </View>
            </View>
          </View>

          <View style={stylesHomeScreen.newContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              {t("News")}
            </Text>
            <Text style={{ color: "#9C9C9C" }}>{t("NewsSub")}</Text>
          </View>
          <ScrollView
            style={{
              flexDirection: "row",
              marginVertical: 30,
              paddingBottom: 20,
            }}
            horizontal={true}
          >
            <View style={{ marginRight: 36 }}>
              <Image
                style={stylesHomeScreen.newImage}
                source={{
                  uri: "https://i1-giaitri.vnecdn.net/2024/02/08/argylle-wins-the-domestic-weekend-box-office-but-has-a-slow-bbb3-jpeg-1707378873-1707378888.jpg?w=380&h=228&q=100&dpr=1&fit=crop&s=575ev_g3HGOnN0JCv2QpYw",
                }}
              ></Image>
              <View style={stylesHomeScreen.newTitle}>
                <Text style={{ fontWeight: "bold" }}>Lorem</Text>
                <Text
                  style={{ fontWeight: "300", fontSize: 12, color: "#9C9C9C" }}
                >
                  13 tháng 2, 2024
                </Text>
              </View>
            </View>
            <View style={{ marginRight: 36 }}>
              <Image
                style={stylesHomeScreen.newImage}
                source={{
                  uri: "https://i1-giaitri.vnecdn.net/2024/02/08/argylle-wins-the-domestic-weekend-box-office-but-has-a-slow-bbb3-jpeg-1707378873-1707378888.jpg?w=380&h=228&q=100&dpr=1&fit=crop&s=575ev_g3HGOnN0JCv2QpYw",
                }}
              ></Image>
              <View style={stylesHomeScreen.newTitle}>
                <Text style={{ fontWeight: "bold" }}>Lorem</Text>
                <Text
                  style={{ fontWeight: "300", fontSize: 12, color: "#9C9C9C" }}
                >
                  13 tháng 2, 2024
                </Text>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;