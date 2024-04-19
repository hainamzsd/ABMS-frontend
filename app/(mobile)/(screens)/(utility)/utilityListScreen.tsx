import { Image, SafeAreaView } from "react-native";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import Header from "../../../../components/resident/header";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import SHADOW from "../../../../constants/shadow";
import { CircleDotDashedIcon, FileTerminal, Settings } from "lucide-react-native";
import { router } from "expo-router";
import {ICON_MAP} from "../../../../constants/iconUtility";
import { useEffect, useState } from "react";
import axios from 'axios';
import LoadingComponent from "../../../../components/resident/loading";
import { calculateSlots } from "../../../../utils/convertSlot";
import { useSession } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import AlertWithButton from "../../../../components/resident/AlertWithButton";
import { Center, VStack } from "native-base";
interface Utility {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  numberOfSlot: number;
  pricePerSlot: number;
  description: string;
  createUser: string;
  createTime: string;
  location:string;
  modifyUser: string;
  modifyTime: string;
  status: number;
}

interface user{
  FullName:string;
  PhoneNumber:string;
  Id:string;
  Avatar:string;
  BuildingId:string;
}
export default function UtilityList() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const{session } = useSession();
  const user:user = jwtDecode(session as string);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-all?buildingId=${user?.BuildingId}`,
        );
        console.log(response?.data?.data);
        if (response.data.statusCode == 200) {
          const filteredData = response.data.data.filter((item: Utility) => item.status !== 0);
          setUtilities(filteredData);
        }
        else{

        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setShowError(true);
          setError(t("System error please try again later") + ".");
          return;
        }
        console.error('Error fetching reservations:', error);
        setShowError(true);
        setError(t('Failed to return requests') + ".");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const [alert,setAlert]=useState(false);
  const handlePress = (item:any) => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    if (currentHour >= 8 && currentHour < 17) {
      router.push({
        pathname: `/(mobile)/(screens)/(utility)/schedules/utilityPlace`,
        params: {
          id: item.id,
          location: item.location,
          utilityName: item.name,
          price: item.pricePerSlot,
        },
      });
    } else {
      setAlert(true);
    }
  }
  const renderItem = ({item}:{item:Utility}) => {
    const icon = ICON_MAP[item.name];
    return(
    <Pressable
      style={{
        alignItems: "center",
        width: "30%",
        marginRight: 10,
        marginTop: 10,
      }}
      onPress={() =>
        router.push({
          pathname: `/(mobile)/(screens)/(utility)/schedules/utilityPlace`,
          params: {
            id: item.id,
            location : item.location,
            utilityName:item.name,
            price:item.pricePerSlot
          },
        })
      }
    >
      <View style={[styles.circle, { backgroundColor: theme.sub }]}>
      {icon && <Image source={icon} style={{width:24,height:24}}/>}
      </View>
      <Text style={{textAlign:'center'}}>{item.name}</Text>
    </Pressable>
  )};
  return (
    <>
    <AlertWithButton
     title={t("Notification")}
     visible={alert}
     content={t("Navigation to utility schedules is allowed only between 8 AM and 5 PM"+".")} onClose={() =>setAlert(false)}
    ></AlertWithButton>
      <AlertWithButton 
      title={t("Error")}
      visible={showError}
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
      <LoadingComponent loading={isLoading}></LoadingComponent>
      <Header headerTitle={t("Utility list")} headerRight
      rightPath={"reservationUtilityList"}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26,flex:1 }}>
            {utilities.length === 0 && !isLoading ? 
            <View style={{flex:1}}>
            <Center flex={1}>
                         <VStack space={4} alignItems="center">
                         <Image source={require('../../../../assets/images/human2.png')}
                        style={{width:200,height:300, opacity:0.7}}
                        />
                        <Text style={{color:'#9c9c9c', marginTop:5}}>{t("Utilities not available at the moment")+"."}</Text>
                         </VStack>
                     </Center>
                     </View>
            :(  
          <View style={styles.container}>
            
            <View style={styles.row}>
              <FlatList
                data={utilities}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
              />
            </View>  
          </View>
            )}
           
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    padding: 20,
    backgroundColor: "white",
    ...SHADOW,
  },
  row: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  item: {
    width: "30%",
    padding: 10,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
