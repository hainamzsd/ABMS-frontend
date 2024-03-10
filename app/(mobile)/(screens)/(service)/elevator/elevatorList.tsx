import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../../../components/resident/header';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { Pressable } from 'react-native';
import SHADOW from '../../../../../constants/shadow';
import { FlatList } from 'react-native';
import { CircleUser } from 'lucide-react-native';
import { router } from 'expo-router';
import axios from 'axios';
import LoadingComponent from '../../../../../components/resident/loading';
import AlertWithButton from '../../../../../components/resident/AlertWithButton';
import { useSession } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { statusUtility } from '../../../../../constants/status';


interface Elevator{
  id: string
  roomId: string,
  startTime: Date,
  endTime: Date,
  description: string,
  status: number,
}

interface user{
  FullName:string;
  PhoneNumber:string;
  Id:string;
  Avatar:string;
}
  
interface Room{
  roomNumber:string;
  id:string;
}
const ElevatorList = () => {
 
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<Elevator[]>([]); // Holds all fetched data
    const [displayData, setDisplayData] = useState<Elevator[]>([]); // Data to display
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);

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
  }, [session]);
  useEffect(() => {
    const fetchElevatorData = async () => {
      if (!room.length) {
        return;
      }
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/elevator/get?room_id=${room[0]?.id}`,{
                timeout:10000
            });
            if(response.data.statusCode == 200){
              setData(response.data.data);
              setDisplayData(response.data.data);
            }
           
        } catch (error) {
            if(axios.isAxiosError(error)){
                setShowError(true);
                setError(t("System error please try again later")+".");
                return;
            }
            console.error('Error fetching reservations:', error);
            setShowError(true);
            setError(t('Failed to return requests')+".");
        } finally {
            setIsLoading(false);
        }
    };
    fetchElevatorData();
}, [room]); 
useEffect(() => {
    const startIndex = (currentPage - 1) * 3;
    const endIndex = startIndex + 3;
    setDisplayData(data.slice(startIndex, endIndex));
}, [currentPage, data]);


const loadMoreItems = () => {
    if (!isLoading && displayData.length < data.length) {
        setCurrentPage(currentPage => currentPage + 1);
    }
};
    const renderFooter = () => {
    if (isLoading) {
      return <ActivityIndicator size="small"  color={theme.primary}/>;
    }
    return null;
  };
    const render = ({item}:{item:Elevator}) => {
      
      const startDate = new Date(item.startTime);
      const endDate = new Date(item.endTime);
      let status = ""
      if(item.status == 2){
        status = t("Pending");
      }
      return(
        <Pressable style={[SHADOW, { backgroundColor: 'white', borderRadius: 10, marginTop: 20 }]}
        onPress={() => {
          router.push({
            pathname: `/(mobile)/(screens)/(service)/elevator/${item.id}`,
          })
        }}
        >
        <View style={{ borderBottomWidth: 1 ,borderColor:'#9c9c9c'}}>
            <View style={{ paddingHorizontal: 10,paddingVertical:20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{color:"#9C9C9C"}}>{t("Start date")}: </Text>
                    <Text style={{fontWeight:'600'}}>{startDate.toLocaleDateString('vi')}</Text>
                </View>
                <View style={{ flexDirection: 'row',marginTop:10 }}>
                    <Text style={{color:"#9C9C9C"}}>{t("Start time")}: </Text>
                    <Text style={{fontWeight:'600'}}> {`${startDate.getUTCHours().toString().padStart(2, '0')}:${startDate.getUTCMinutes().toString().padStart(2, '0')}`}</Text>
                </View>
                <View style={{ flexDirection: 'row' ,marginTop:10}}>
                    <Text style={{color:"#9C9C9C"}}>{t("End time")}: </Text>
                    <Text style={{fontWeight:'600'}}> {`${endDate.getUTCHours().toString().padStart(2, '0')}:${endDate.getUTCMinutes().toString().padStart(2, '0')}`}</Text>
                </View>
            </View>
        </View>
        <View style={{paddingHorizontal: 10,paddingVertical:10 }}>
            <View style={{flexDirection:'row'}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Status")}: </Text>
                    <Text style={{fontWeight:'600'}}>{t(statusUtility[item.status].status)}</Text>
            </View>
        </View>
    </Pressable>
    )}
    return (
      <>
      <AlertWithButton 
      title={t("Error")}
      visible={showError}
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
      <LoadingComponent loading={isLoading}></LoadingComponent>
        <Header headerTitle={t("Manage elevator request")} />
        <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
          <View style={{ marginHorizontal: 26 }}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{t("Request list")}</Text>
              <Text>{t("Elevator request")}</Text>
            </View>
          </View>
          <View style={{ flex:1,  }}>
                   
                   {displayData.length>0? 
                   <FlatList
                    data={displayData}
                    style={{paddingHorizontal:26}}
                    renderItem={render}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={loadMoreItems} 
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                   />
                   :
                   <View style={{flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal:26}}>
                   <Image source={require('../../../../../assets/images/human2.png')}
                   style={{width:300,height:300, opacity:0.7}}
                   />
                   <Text style={{color:'#9c9c9c', marginTop:5, textAlign:'center'}}>{t("You dont have any elevator requests")+"."}</Text>
               </View>
                   }
                </View>
        </SafeAreaView>
      </>
    )
  }
  
  const styles = StyleSheet.create({
    card:{
      marginTop:20,
      borderRadius:20,
      padding:20,
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
  })
  
export default ElevatorList