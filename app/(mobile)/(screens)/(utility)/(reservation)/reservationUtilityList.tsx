import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Pressable, FlatList, ActivityIndicator, Image } from 'react-native';
import Header from '../../../../../components/resident/header';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import SHADOW from '../../../../../constants/shadow';
import ICON_MAP from '../../../../../constants/iconUtility';
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
    const [data, setData] = useState<Reservation[]>([]); // Holds all fetched data
    const [displayData, setDisplayData] = useState<Reservation[]>([]); // Data to display
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    // Fetch all items only once, on component mount
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:5108/api/v1/reservation/get',{
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
        fetchItems();
    }, []); // Empty dependency array ensures this runs once on mount

    // Update displayData when currentPage changes
    useEffect(() => {
        const startIndex = (currentPage - 1) * PER_PAGE;
        const endIndex = startIndex + PER_PAGE;
        setDisplayData(data.slice(startIndex, endIndex));
    }, [currentPage, data]);

    // Function to handle the 'load more' action
    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };
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
                    {displayData.length>0 ?
                       <FlatList
                       style={{paddingHorizontal:26}}
                        data={displayData}
                        renderItem={render}
                        keyExtractor={(item) => item.room_id}
                        onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5} // How far from the end (0-1) the bottom edge of the list must be from the end of the content before onEndReached is called
                        ListFooterComponent={renderFooter}
                       />
                    :
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Image source={require('../../../../../assets/images/human.png')}
                        style={{width:200,height:300, opacity:0.7}}
                        />
                        <Text style={{color:'#9c9c9c', marginTop:5}}>{t("You don't have any bookings")}</Text>
                    </View>
                    }
                
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

