import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../../../components/resident/header'
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SHADOW from '../../../../../constants/shadow';
import { useSession } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AlertWithButton from '../../../../../components/resident/AlertWithButton';
import LoadingComponent from '../../../../../components/resident/loading';
import moment from 'moment';
import ParkingCardDetail from '../../../../../components/resident/ParkingCardDetail';
import CustomAlert from '../../../../../components/resident/confirmAlert';
import Alert from '../../../../../components/resident/Alert';
import { useNavigation } from 'expo-router';
interface Room{
  roomNumber:string;
  id:string;
}
interface user{
  FullName:string;
  PhoneNumber:string;
  Id:string;
  Avatar:string;
  BuildingId:string;
}
interface ParkingCard{
  id: string;
  residentId: string;
  licensePlate: string;
  brand: string;
  color: string;
  type: number,
  image: string,
  expireDate: string,
  note: string;
  createUser: string;
  createTime: Date,
  modifyUser: string;
  modifyTime: string;
  status: number,
  resident: {
    id: string;
    fullName:string;
}
}

const vehicleType: { [key: number]: string } ={
  1: "Xe máy",
  2: "Ô tô",
  3: "Xe đạp",
  4:"Xe đạp điện"
}
const DeleteParkingCard = () => {

  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);    
  const navigation = useNavigation();
  const [data, setData] = useState<ParkingCard[]>([]);
  const isFocused = useIsFocused();
  const{session } = useSession();
  const user:user = jwtDecode(session as string);
  const [room, setRoom] = useState<Room[]>([]);
  useEffect(() => {
      const fetchData = async () => {
      setError("");
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
              setShowError(true);
              setError(t("System error please try again later"));
          }
        } catch (error) {
          if(axios.isCancel(error)){
              setShowError(true);
              setError(t("System error please try again later"));
          }
          console.error('Error fetching data:', error);
          setShowError(true);
          setError(t("System error please try again later"));
        } finally {
        }
      };
  
      fetchData();
    }, [session, isFocused]);
    
  useEffect(() => {
    const fetchElevatorData = async () => {
      if (!room.length || !user.BuildingId) {
        return;
      }
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/parking-card/get?room_id=${room[0]?.id}&status=1&building_id=${user.BuildingId}`,{
                timeout:10000
            });
            if(response.data.statusCode == 200){
              setData(response.data.data);
            }
           
        } catch (error) {
            if(axios.isAxiosError(error)){
                setShowError(true);
                setError(t("System error please try again later")+".");
                return;
            }
            console.error('Error fetching card:', error);
            setShowError(true);
            setError(t('Failed to return requests')+".");
        } finally {
            setIsLoading(false);
        }
    };
    if(isFocused){
    fetchElevatorData();
    }
}, [room, isFocused]); 


const [disableBtn, setDisableBtn] = useState(false);
const [showDeleteMsg, setShowDeleteMsg] = useState(false);
const [confirmBox, setShowConfirmBox] = useState(false);
const handleDeleteCard = async (item:ParkingCard) => {
  setDisableBtn(true);
  setIsLoading(true);
  setError("");
  try {
      const response = await axios.delete(
          `https://abmscapstone2024.azurewebsites.net/api/v1/parking-card/delete/${item.id}`, {
          timeout: 10000,
          headers:{
              'Authorization': `Bearer ${session}`
            }
      }
      );
      const roomservice = await axios.post(
        `https://abmscapstone2024.azurewebsites.net/api/v1/UpdateOrDeleteRoomService?roomId=${room[0]?.id}&feeType=${vehicleType[item.type]}`, {
        timeout: 10000,
        headers:{
            'Authorization': `Bearer ${session}`
          }
    }
    );
      console.log(response);
      if (response.data.statusCode == 200 && roomservice.data.statusCode == 200) {
          setShowConfirmBox(false);
          setShowDeleteMsg(true);
          setTimeout(() => {
              setShowDeleteMsg(false);
              navigation.goBack();
            }, 2000);
      }
      else {
          setShowError(true);
          setError(t("System error please try again later"));
      }
  } catch (error) {
      if (axios.isCancel(error)) {
          setShowError(true);
          setError(t("System error please try again later"));
      }
      console.error('Error fetching data:', error);
      setShowError(true);
      setError(t("System error please try again later"));
  } finally {
      setDisableBtn(false);
      setIsLoading(false);
  }
};
  return (
    <>
       <AlertWithButton 
      title={t("Error")}
      visible={showError}
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
      
            <Alert title={t("Successful")} content={t("Cancel card successfuly")}
            visible={showDeleteMsg}></Alert>
      <LoadingComponent loading={isLoading}></LoadingComponent>
      <Header headerTitle={t("Manage parking card")} />
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ paddingHorizontal: 26,flex:1 }}>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{t("Registered card")}</Text>
            <Text>{t("Choose card to cancel")}</Text>
          </View>
         
          {data.length>0 &&
                   <FlatList
                    data={data}
                    style={{ marginVertical:20,flex:1}}
                    renderItem={({item}:{item:ParkingCard}) => {return(
                      <TouchableOpacity
                      onPress={() => setShowConfirmBox(true)}
                      >
                       <CustomAlert title={t("Confirmation")} 
            content={t("Do you want to cancle this card")+"?"}
            visible={confirmBox}
            onClose={() => setShowConfirmBox(false)}
            onConfirm={()=>handleDeleteCard(item)}
            disable={disableBtn}
            ></CustomAlert>
                      <View style={styles.cardContainer}
                     
                      >
                      <LinearGradient
                        colors={[theme.primary, theme.sub]}
                        start={[0, 1]} 
                        end={[1, 0]} // Adjusted for a smoother gradient effect
                        style={styles.gradientBackground}
                      >
                        
                        <View style={styles.contentContainer}>
                          <View style={{flex:1}}>
                          <Text style={styles.parkingCardText}>{t("Parking card")}</Text>
                          <Text style={styles.ownerName}>{item.resident.fullName}</Text>
                          </View>
                          <Image source={require('../../../../../assets/images/logoGradient1.png') } style={styles.logo} />
                        </View>
                        <View style={{justifyContent:'center', paddingHorizontal:26,paddingVertical:10}}>
                        <Text style={styles.expireDate}>{t("Expire date")}: {item.expireDate}</Text>
                        </View>
                      </LinearGradient>
                    </View>
                    </TouchableOpacity>
                    )}}
                    keyExtractor={(item) => item.id.toString()}
                   />
                 
                   }
                    
         
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    maxHeight:200,
    overflow: 'hidden',
    marginTop:10
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent:'space-between',
    flexDirection: 'row',
    paddingHorizontal:30,
    borderBottomWidth:6,
    flex:1,
    paddingVertical:10,
    borderColor:'white'
  },
  ownerName: {
    fontSize: 20,
    flexWrap:'wrap',
    fontWeight: 'bold',
  },
  parkingCardText: {
    fontWeight:'600'
  },
  logo: {
    width: 100,
    height: 125,
  },
  expireDate: {
    fontSize: 14,
  },

})


export default DeleteParkingCard