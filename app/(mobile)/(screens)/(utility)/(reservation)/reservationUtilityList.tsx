import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Pressable, FlatList, ActivityIndicator, Image } from 'react-native';
import Header from '../../../../../components/resident/header';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import SHADOW from '../../../../../constants/shadow';
import ICON_MAP from '../../../../../constants/icons';
import statusUtility from '../../../../../constants/status';
import usePagination from '../../../../../utils/pagination';
import { router } from 'expo-router';
import axios from 'axios';
import LoadingComponent from '../../../../../components/resident/loading';

interface Reservation {
  
        room_id:string,
        utility_id:string,
        slot:number,
        booking_date:string,
        number_of_person:string,
        total_price:number,
        description:string,
        status:number
  }

  const PER_PAGE = 3;
 
  
const ReservationUtilityList = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Reservation[]>([]);
    const fetchItems = async (page: number) => {
        setIsLoading(true);
        setError(null);
        try{
        const response = await axios.get(`http://localhost:5108/api/v1/reservation/get?page=${page}&per_page=${PER_PAGE}`);
        return response.data.data;
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setError('Failed to fetch reservations.');
          } finally {
            setIsLoading(false);
          }
      };
   
    const [currentPage, setCurrentPage] = useState(1);
    const [dataToDisplay, setDataToDisplay] = useState<Reservation[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading state
    useEffect(() => {
        const fetchData = async () => {
          const newData = await fetchItems(currentPage);
          setData([...data, ...newData]); 
          setDataToDisplay((prevData) => [...prevData, ...newData]); 
        };
      
        fetchData();
      }, [currentPage]);

      const handleNextPage = async () => {
        const visibleDataCount = currentPage * 3;
      
        if (visibleDataCount >= data.length && !isLoadingMore) {
          setIsLoadingMore(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          setCurrentPage(currentPage + 1);
          setIsLoadingMore(false);
        }
      };
    const renderFooter = () => {
    if (isLoadingMore) {
      return <ActivityIndicator size="small"  color={theme.primary}/>;
    }
    return null;
  };
    const render = ({ item }: {item:Reservation}) => {
        const icon = ICON_MAP["Sân bóng rổ"];
        const statusText = statusUtility?.[item.status];
        return(
        <Pressable style={[SHADOW, { backgroundColor: 'white', borderRadius: 10, marginTop: 20 }]}
        onPress={() =>
            router.push({
              pathname: `/(mobile)/(screens)/(utility)/(reservation)/${item.room_id}`,
              params: {

              },
            })}>
        <View style={{ borderBottomWidth: 1,borderColor:'#9c9c9c' }}>
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.circle, { backgroundColor: theme.sub }]}>
                        {icon && <Image source={icon} style={{width:24,height:24}}/>}
                    </View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tên tiện ích</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#9C9C9C' }}>{t("Code")}: </Text>
                            <Text>aaa</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    padding: 10, borderRadius: 20, backgroundColor: theme.primary,
                    justifyContent: 'center', height: 40
                }}>
                    <Text style={{ fontWeight: '600', color:'white' }}>{t(statusText)}</Text>
                </View>
            </View>
        </View>
        <View style={{ borderBottomWidth: 1,borderColor:'#9c9c9c' }}>
            <View style={{ paddingHorizontal: 10,paddingVertical:20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{color:"#9C9C9C"}}>{t("Date")}: </Text>
                    <Text>{item.booking_date}</Text>
                </View>
                <View style={{ flexDirection: 'row' ,marginTop:10}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Time")}: </Text>
                    <Text>{item.slot}</Text>
                </View>
                <View style={{ flexDirection: 'row' ,marginTop:10}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Number of tickets")}: </Text>
                    <Text>{item.number_of_person}</Text>
                </View>
            </View>
        </View>
        <View style={{paddingHorizontal: 10,paddingVertical:20 }}>
            <View style={{flexDirection:'row'}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Create date")}: </Text>
                    <Text>25/2/32</Text>
            </View>
        </View>
    </Pressable>
    )}

    return (
        <>
        <LoadingComponent loading={isLoading}></LoadingComponent>
            <Header headerTitle={t("Booking history")} />
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                <View style={{ flex:1,  }}>
                   <FlatList
                   style={{paddingHorizontal:26}}
                    data={dataToDisplay}
                    renderItem={render}
                    keyExtractor={(item) => item.room_id}
                    onEndReached={handleNextPage} 
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                   />
                </View>
            </SafeAreaView>
        </>
    );
};

export default ReservationUtilityList;

const styles = StyleSheet.create({
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
});

