import { FlatList, SafeAreaView, Text, View } from "react-native";
import Header from "../../../components/resident/header";
import roomInformationStyles from "./styles/roomInformationStyles";
import { CircleUser, CircleUserRound, Info } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useSession } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import AlertWithButton from "../../../components/resident/AlertWithButton";
import LoadingComponent from "../../../components/resident/loading";


interface Room{
  roomNumber:string;
  id:string;
  buildingName: string;
  buildingAddress: string;
  residents:Resident[];
}
interface Resident{
  id: string;
  roomId: string;
  fullName: string;
  dateOfBirth: string;
  gender: boolean;
  phone: string;
  isHouseholder: boolean;
  status: number,
}
interface user{
  FullName:string;
  PhoneNumber:string;
  Id:string;
  Avatar:string;
  BuildingId:string;
}

export default function Room() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const{session } = useSession();
  const user:user = jwtDecode(session as string);
  const [error, setError] = useState(false);
const [errorText, setErrorText] = useState("");
const [room, setRoom] = useState<Room[]>([]);
const [loading,setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  fetchData();
}, [session]);
  return (
    <>
     <AlertWithButton content={errorText} title={t("Error")} 
    visible={error} onClose={() => setError(false)}></AlertWithButton>
    <LoadingComponent loading={loading}></LoadingComponent>
      <Header headerTitle={t("Room information")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1, }}>
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
                  {room[0]?.roomNumber}
                </Text>
                <Text>{room[0]?.buildingAddress}</Text>
              </View>
            </View>
            <View style={{ padding: 20 }}>
              <Text>{t("Member")}: {room[0]?.residents.length}</Text>
            </View>
          </View>
          <View style={roomInformationStyles.memberInformationContainer}>
            <Text style={roomInformationStyles.memberInformationHeader}>
              {t("Member information")}
            </Text>
            <Text style={{ fontWeight: "300" }}>{t("Registered member")}</Text>
          </View>
        </View>

          {room[0] && <FlatList
          style={{ paddingHorizontal: 26}}
          data={room[0]?.residents}
          renderItem={({ item }:{item:Resident}) => (
            <View style={roomInformationStyles.memberBox}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    roomInformationStyles.memberCircle,
                    { backgroundColor: theme.secondary},
                  ]}
                >
                  <CircleUser
                    strokeWidth={1.5}
                    size={40}
                    color={"white"}
                  ></CircleUser>
                </View>
                <View>
                <Text style={roomInformationStyles.memberName}>{item.fullName}</Text>
                {item.isHouseholder && <Text style={{fontSize:14, color:'#9c9c9c'}}>{t("House owner")}</Text>} 
                </View>
              </View>
            </View>)}
          keyExtractor={(item) => item.id}
          >
        
          </FlatList>}
          
      </SafeAreaView>
    </>
  );
}
