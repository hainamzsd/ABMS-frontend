import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native'
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
import { jwtDecode } from 'jwt-decode';
import { useSession } from '../../../context/AuthContext';
import moment from 'moment';
import { statusUtility } from '../../../../../constants/status';
import { useIsFocused } from '@react-navigation/native';
import AlertWithButton from '../../../../../components/resident/AlertWithButton';
import LoadingComponent from '../../../../../components/resident/loading';
export const MOCK_DATA = [
  { id: 1, name: 'Xay nha', description: 'Description for item 1' },
  { id: 2, name: 'Hoa', description: 'Description for item 2Description for item 2Description for item 2Description for item 2' },
  { id: 3, name: 'Item 3', description: 'Description for item 3' },
];
interface Construction{
  id:string;
  roomId:string;
  name:string;
  constructionOrganization:string;
  phoneContact:string;
  startTime:string;
  endTime:string;
  description:string;
  createTime:Date;
  status:number;
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
const ConstructionList = () => {
 
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<Construction[]>([]); // Holds all fetched data
    const [displayData, setDisplayData] = useState<Construction[]>([]); // Data to display
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);
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
    const fetchConstructionData = async () => {
      setIsLoading(true);
      setError("");
      if (!room.length || !user.BuildingId) {
        return;
      }
    
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/construction/get?room_id=${room[0]?.id}&building_id=${user.BuildingId}`, {
          timeout: 10000
        });
        if (response.data.statusCode == 200) {
          const filteredData = response.data.data.filter((item: Construction) => item.status !== 0);

          // Set the filtered data
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
    const render = ({ item }:{item:Construction}) => (
        <Pressable style={[SHADOW, { backgroundColor: 'white', borderRadius:10, marginTop:10 }]}
        onPress={() => {
          router.push({
            pathname: `/(mobile)/(screens)/(service)/construction/${item.id}`,
          })
        }}
        >
        <View style={{  }}>
           <View style={{padding:20, flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{justifyContent:'space-between',flex:1}}>
                    <View style={{flex:0.6}}>
                    <Text style={{fontWeight:'bold', fontSize:20}}>{item.name}</Text>
                    <Text>{item.description}</Text>
                    </View>
                    <Text style={{color:"#9c9c9c"}}>{t("Create date")}: {moment.utc(item.createTime).format("DD-MM-YYYY")}</Text>
                </View>
                <View style={{
                    padding: 10, borderRadius: 20, backgroundColor: theme.primary,
                    justifyContent: 'center', height: 40
                }}>
                    <Text style={{ fontWeight: '600',color:'white' }}>{t(statusUtility[item?.status]?.status)}</Text>
                </View>
           </View>
        </View>
    </Pressable>
    )
    return (
      <>
        <AlertWithButton 
      title={t("Error")}
      visible={showError}
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
      <LoadingComponent loading={isLoading}></LoadingComponent>
        <Header headerTitle={t("Manage construction request")} />
        <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
          <View style={{ marginHorizontal: 26 }}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{t("Registered construction")}</Text>
              <Text>{t("Visitor requests")}</Text>
            </View>
          </View>
          <View style={{ flex:1,  }}>
                   <FlatList
                    data={displayData}
                    style={{marginTop:10, paddingHorizontal:20}}
                    renderItem={render}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={loadMoreItems} 
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                   />
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
  
export default ConstructionList