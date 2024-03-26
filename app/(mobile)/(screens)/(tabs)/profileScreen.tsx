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
import { Link, router, useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import Alert from "../../../../components/resident/Alert";
import CustomAlert from "../../../../components/resident/confirmAlert";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingComponent from "../../../../components/resident/loading";
import AlertWithButton from "../../../../components/resident/AlertWithButton";
import { useIsFocused } from "@react-navigation/native";

interface user{
  FullName:string;
  PhoneNumber:string;
  RoomId:string;
  Email:string;
  Id:string;
}

interface Room{
  roomNumber:string;
  id:string;
  buildingName: string;
  buildingAddress: string;
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
const ProfileScreen = () => {
  const { signOut } = useSession();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState(false);
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
          `https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?accountId=${user.Id}`,{
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
}, [session,isFocused]);
  return (
    <>
      <AlertWithButton content={errorText} title={t("Error")} 
    visible={error} onClose={() => setError(false)}></AlertWithButton>
    {/* <LoadingComponent loading={loading}></LoadingComponent> */}
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
            <TouchableOpacity onPress={()=>{
              router.push("/(mobile)/(screens)/userAvatarScreen")
            }}>
              <Image
                style={stylesProfileScreen.avatar}
                source={{
                  uri: fetchUser && fetchUser.avatar ? fetchUser.avatar : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Atlantic_near_Faroe_Islands.jpg/800px-Atlantic_near_Faroe_Islands.jpg" ,
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
                {fetchUser?.fullName}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>{t("Phone")}:</Text>
              <Text style={{ marginLeft: 5 }}>{fetchUser?.phoneNumber}</Text>
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
                {room[0]?.roomNumber}
              </Text>
              <Text style={{ fontWeight: "300" }}>{room[0]?.buildingAddress}</Text>
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
                  <Text style={stylesProfileScreen.text}>{t("Update Information")}</Text>
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
                  <Text style={stylesProfileScreen.text}>{t("Change password")}</Text>
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
                  <Text style={stylesProfileScreen.text}>{t("Change color pallete")}</Text>
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
                  <Text style={stylesProfileScreen.text}>{t("Change language")}</Text>
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
              setConfirm(true);
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {t("Logout")}
            </Text>
          </TouchableOpacity>
          <CustomAlert title={t("Confirm logout")} content={t("Do you want to logout")+"?"} 
          onClose={() => setConfirm(false)} 
          onConfirm={signOut}
          visible={confirm}></CustomAlert>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ProfileScreen;
