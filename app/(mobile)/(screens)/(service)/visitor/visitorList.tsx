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
import { useIsFocused } from '@react-navigation/native';
import { useSession } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AlertWithButton from '../../../../../components/resident/AlertWithButton';
import LoadingComponent from '../../../../../components/resident/loading';
import { statusUtility } from '../../../../../constants/status';
import moment from 'moment';


interface Visitor{
  id: string;
  roomId: string;
  fullName: string;
  arrivalTime: Date;
  departureTime: Date;
  gender: boolean;
  phoneNumber: string;
  identityNumber: string;
  identityCardImgUrl: string;
  description: string;
  status: number,
}
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

const VisitorList = () => {
 
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<Visitor[]>([]); // Holds all fetched data
    const [displayData, setDisplayData] = useState<Visitor[]>([]); // Data to display
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const isFocused = useIsFocused();
  const{session } = useSession();
  const user:user = jwtDecode(session as string);
  const [room, setRoom] = useState<Room[]>([]);
  console.log(room);
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
    const fetchConstructionData = async () => {
      if (!room.length || !user.BuildingId) {
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/visitor/get-all?room_id=${room[0]?.id}&building_id=${user.BuildingId}`, {
          timeout: 10000
        });
        if (response.data.statusCode == 200) {
          const filteredData = response.data.data.filter((item: Visitor) => item.status !== 0);
          setData(filteredData);
          setDisplayData(filteredData);
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
    if(isFocused){
      fetchConstructionData();
    }
}, [room, isFocused]); 
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
    const render = ({ item }: {item:Visitor}) => (
        <Pressable style={[SHADOW, { backgroundColor: 'white', borderRadius: 10, marginTop: 20 }]}
        onPress={() => {
          router.push({
            pathname: `/(mobile)/(screens)/(service)/visitor/${item.id}`,
          })
        }}
        >
        <View style={{ borderBottomWidth: 1,borderColor:'#9c9c9c' }}>
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',flex:1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center',flex:0.6 }}>
                    <View style={[styles.circle, { backgroundColor: theme.primary }]}>
                    <CircleUser
                  strokeWidth={1.5}
                  size={40}
                  color={"white"}
                ></CircleUser>
                    </View>
                    <View >
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item?.fullName}</Text>
                    </View>
                </View>
                <View style={{
                    padding: 10, borderRadius: 20, backgroundColor: theme.primary,
                    justifyContent: 'center', height: 40
                }}>
                    <Text style={{ fontWeight: '600',color:'white' }}>{t(statusUtility[item?.status as number]?.status)}</Text>
                </View>
            </View>
        </View>
        <View style={{ borderBottomWidth: 0 ,borderColor:'#9c9c9c'}}>
            <View style={{ paddingHorizontal: 10,paddingVertical:20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{color:"#9C9C9C"}}>{t("Arrival date")}: </Text>
                    <Text>{moment.utc(item?.arrivalTime).format("DD-MM-YYYY")}</Text>
                </View>
                <View style={{ flexDirection: 'row' ,marginTop:5}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Departure date")}: </Text>
                    <Text>{moment.utc(item?.departureTime).format("DD-MM-YYYY")}</Text>
                </View>
                <View style={{ flexDirection: 'row' ,marginTop:5}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Phone")}: </Text>
                    <Text>{item?.phoneNumber}</Text>
                </View>
            </View>
        </View>
        {/* <View style={{paddingHorizontal: 10,paddingVertical:20 }}>
            <View style={{flexDirection:'row'}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Create date")}: </Text>
                    <Text>25/2/32</Text>
            </View>
        </View> */}
    </Pressable>
    )
    return (
      <>
       <AlertWithButton 
      title={t("Error")}
      visible={showError}
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
      <LoadingComponent loading={isLoading}></LoadingComponent>
        <Header headerTitle={t("Manage visitor")} />
        <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
          <View style={{ marginHorizontal: 26 }}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{t("Registered visitor")}</Text>
              <Text>{t("Visitor requests")}</Text>
            </View>
          </View>
          <View style={{ flex:1,  }}>
          {displayData.length>0?<FlatList
                   style={{paddingHorizontal:26}}
                    data={displayData}
                    renderItem={render}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={loadMoreItems} 
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                   /> :
                   <View style={{flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal:26}}>
                   <Image source={require('../../../../../assets/images/human2.png')}
                   style={{width:300,height:300, opacity:0.7}}
                   />
                   <Text style={{color:'#9c9c9c', marginTop:5, textAlign:'center'}}>{t("You dont have any visitor requests")+"."}</Text>
               </View>}
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
  
export default VisitorList