import { View, Text, SafeAreaView, StyleSheet, Pressable, ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../../components/resident/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { Clock, Info } from 'lucide-react-native'
import SHADOW from '../../../../constants/shadow'
import { useIsFocused } from '@react-navigation/native'
import { useSession } from '../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import AlertWithButton from '../../../../components/resident/AlertWithButton'
import LoadingComponent from '../../../../components/resident/loading'
import moment from "moment";
import { router } from 'expo-router'

interface user{
    FullName:string;
    PhoneNumber:string;
    Id:string;
    BuildingId:string;
  }
  
  interface Post{
    id: string;
    title: string;
    content: string;
    image: string;
    createUser: string;
    createTime: Date,
    modifyUser: string;
    modifyTime: string;
    status: number;
    buildingId: string;
    type: number;
  }

const index = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Post[]>([]); 
    const [displayData, setDisplayData] = useState<Post[]>([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState(false);
    const{session } = useSession();
    const user:user = jwtDecode(session as string);
    useEffect(() => {
      const fetchItems = async () => {
          setIsLoading(true);
          setError("");
          try {
              const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/post/get-all?buildingId=${user.BuildingId}&type=2`,{
                  timeout:10000
              });
              setData(response.data.data); // Store all data
              setDisplayData(response.data.data);
              console.log(displayData)
          } catch (error) {
              if(axios.isAxiosError(error)){
                  setError("");
              }
              console.error('Error fetching reservations:', error);
              setError('Failed to fetch reservations.');
          } finally {
              setIsLoading(false);
          }
      };
      if(isFocused){
          fetchItems();
      }
  }, [isFocused]);
  
  const PER_PAGE = 3;
  useEffect(() => {
      const startIndex = (currentPage - 1) * PER_PAGE;
      const endIndex = startIndex + PER_PAGE;
      setDisplayData(data.slice(startIndex, endIndex));
  }, [currentPage, data]);
  
  
  const loadMoreItems = () => {
      // Only attempt to load more items if there are more items to load
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
    const render = ({ item }: {item:Post}) => (
        <TouchableOpacity style={styles.box}
        onPress={() => router.push(`/(mobile)/(screens)/(post)/${item.id}`)}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item?.title}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <View style={[styles.iconTextContainer, { backgroundColor: theme.primary, borderRadius: 20, padding: 10 }]}>
                    <Info color={'white'} size={20}></Info>
                    <Text style={{ color: 'white', marginLeft: 5 }}>{t("Post")}</Text>
                </View>
                <View style={styles.iconTextContainer}>
                    <Clock color={'#9C9C9c'} size={20}></Clock>
                    <Text style={{ color: "#9C9C9C", marginLeft: 5 }}>{moment.utc(item.createTime).format("DD-MM-YYYY")}</Text>
                </View></View>
        </TouchableOpacity>

    )
    return (
        <>
        <AlertWithButton 
      title={t("Error")}
      visible={showError}
      content={error} onClose={() =>setShowError(false)}></AlertWithButton>
        <LoadingComponent loading={isLoading}></LoadingComponent>
            <Header headerTitle={t("News")}></Header>
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                <View style={{ flex:1 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginHorizontal:26,marginTop:20 }}>{t("All news")}</Text>

                    <FlatList
                         style={{ paddingHorizontal: 26 }}
                         data={displayData}
                         renderItem={render}
                         keyExtractor={(item) => item.id}
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
    box: {
        marginTop: 20,
        ...SHADOW,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    iconTextContainer: {
        flexDirection: 'row', alignItems: 'center'
    }
})


export default index