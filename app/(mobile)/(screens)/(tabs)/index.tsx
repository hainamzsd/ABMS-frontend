import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Pressable,
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
import { Link, Stack, router, useFocusEffect } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useSession } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingComponent from "../../../../components/resident/loading";
import AlertWithButton from "../../../../components/resident/AlertWithButton";
import { useIsFocused } from "@react-navigation/native";

interface user{
  FullName:string;
  PhoneNumber:string;
  Id:string;
  Avatar:string;
  BuildingId:string;
}
  
interface Room{
  roomNumber:string;
  id:string;
}
interface UserDatabase {
  id: string;
  fullName: string;
  phoneNumber: string;
  roomId: string;
  avatar: string;
  buildingId:string;
  email:string;
  userName:string;
}
const HomeScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const{session } = useSession();
const user:user = jwtDecode(session as string);
  const isFocused = useIsFocused();
const [error, setError] = useState(false);
const [errorText, setErrorText] = useState("");
const [room, setRoom] = useState<Room[]>([]);
useEffect(() => {
    const fetchData = async () => {
    setErrorText("");
      try {
        const response = await axios.get(
          `https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?accountId=${user.Id}&buildingId=${user.BuildingId}`,{
            timeout:10000
          }
        );
        if(response.data.statusCode==200){
            setRoom(response?.data?.data);
        }
        else{
            setError(true);
            setErrorText(t("System error please try again later"));
        }
      } catch (error) {
        if(axios.isCancel(error)){
            setError(true);
            setErrorText(t("System error please try again later"));
        }
        console.error('Error fetching data:', error);
        setError(true);
        setErrorText(t("System error please try again later"));
      } finally {
      }
    };

    fetchData();
  }, [session]);
  
const [fetchUser,setFetchUser] = useState<UserDatabase>();
const [loading,setLoading] = useState(false);
useEffect(() => {
  const fetchItems = async () => {
    setErrorText("");
    if (user.Id) {
      setLoading(true);
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/account/get/${user.Id}`, {
          timeout: 10000
        });
        if (response.data.statusCode == 200) {
          setFetchUser(response.data.data);
        }
        else {
          setError(true);
          setErrorText(t("Failed to return requests") + ".");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(true);
          setErrorText(t("System error please try again later") + ".");
          return;
        }
        console.error('Error fetching reservations:', error);
        setError(true);
        setErrorText(t('Failed to return requests') + ".");
      } finally {
        setLoading(false);
      }
    }
  };
  if(isFocused){
    fetchItems();
  }
}, [session, isFocused]);
  return (
    <>
    <AlertWithButton content={errorText} title={t("Error")} 
    visible={error} onClose={() => setError(false)}></AlertWithButton>
    <LoadingComponent loading={loading}></LoadingComponent>
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
              <Text style={styles.headerText}>{t("Greet")}, {user.FullName}</Text>
              <Text style={styles.normalText}>{t("SubGreet")}</Text>
            </View>
            <Pressable onPress={()=>{
              router.push("/(mobile)/(screens)/userAvatarScreen")
            }} >
              <Image
                style={stylesHomeScreen.avatar}
                source={{
                  uri: fetchUser && fetchUser.avatar ? fetchUser.avatar : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Atlantic_near_Faroe_Islands.jpg/800px-Atlantic_near_Faroe_Islands.jpg" ,
                }}
              />
            </Pressable>
          </View>
          <Pressable style={stylesHomeScreen.room}>
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
                    {room[0]?.roomNumber}
                  </Text>
                  <Text style={{ fontWeight: "300" }}>Times city, Hà Nội</Text>
                </View>
              </View>
            </Link>
          </Pressable>

          <View style={stylesHomeScreen.featureContainer}>
            <Pressable style={stylesHomeScreen.featureBox}>
              <Link href={"/(mobile)/(screens)/(utility)/utilityListScreen"}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <View
                    style={[
                      stylesHomeScreen.circle,
                      { backgroundColor: theme.sub },
                    ]}
                  >
                    <Layers3 color={"black"} strokeWidth={1.5}></Layers3>
                  </View>
                  <Text>{t("Utility")}</Text>
                </View>
              </Link>
            </Pressable>
            <Pressable style={stylesHomeScreen.featureBox}>
              <Link href={"/(mobile)/(screens)/(service)/serviceListScreen"}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <View
                    style={[
                      stylesHomeScreen.circle,
                      { backgroundColor: theme.sub },
                    ]}
                  >
                    <Settings color={"black"} strokeWidth={1.5}></Settings>
                  </View>
                  <Text>{t("Service")}</Text>
                </View>
              </Link>
            </Pressable>
            <Pressable style={stylesHomeScreen.featureBox}>
              <Link href={"/(mobile)/(screens)/(bill)/bill"}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <View
                    style={[
                      stylesHomeScreen.circle,
                      { backgroundColor: theme.sub },
                    ]}
                  >
                    <ReceiptText color={"black"} strokeWidth={1.5}></ReceiptText>
                  </View>
                  <Text>{t("Bill")}</Text>
                </View>
              </Link>
            </Pressable>
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
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {t("News")}
            </Text>
            <Link 
            href={"/(mobile)/(screens)/postList"}
            style={{ color: "#9C9C9C" }}>{t("NewsSub")}</Link>
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
                  uri: "https://media.istockphoto.com/id/868592684/vector/blue-and-purple-landscape-with-silhouettes-of-mountains-hills-and-forest-and-stars-in-the-sky.jpg?s=612x612&w=0&k=20&c=JmQZI8O2OHVfSeblJTf_73owa0913htm_ItABKYUCuE=",
                }}
              ></Image>
              <View style={stylesHomeScreen.newTitle}>
                <Text 
                numberOfLines={2}
                style={{ fontWeight: "bold", marginBottom:5 }}>LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem</Text>
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
                  uri: "https://c.pxhere.com/photos/f2/3d/street_road_horizon_endless_flatland_america_usa_road_trip-1243541.jpg!d",
                }}
              ></Image>
              <View style={stylesHomeScreen.newTitle}>
                <Text
                numberOfLines={2}
                style={{ fontWeight: "bold", marginBottom:5 }}>Lorem</Text>
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
