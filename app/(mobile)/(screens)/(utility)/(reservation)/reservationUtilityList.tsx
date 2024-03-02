import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import Header from '../../../../../components/resident/header';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import SHADOW from '../../../../../constants/shadow';
import usePagination from '../../../../../utils/pagination';
import { router } from 'expo-router';

interface ItemProps {
    id: number;
    name: string;
    description: string;
  }
  export const MOCK_DATA = [
    { id: 1, name: 'Item 1', description: 'Description for item 1' },
    { id: 2, name: 'Item 2', description: 'Description for item 2' },
    { id: 3, name: 'Item 3', description: 'Description for item 3' },
    { id: 4, name: 'Item 3', description: 'Description for item 3' },
    { id: 5, name: 'Item 3', description: 'Description for item 3' },
    { id: 6, name: 'Item 3', description: 'Description for item 3' },
    { id: 7, name: 'Item 3', description: 'Description for item 3' },
    { id: 8, name: 'Item 3', description: 'Description for item 3' },
  ];

  const PER_PAGE = 3;
  const fetchItems = async (page: number) => {
    const response = await fetch(`https://your-api.com/items?page=${page}&per_page=${PER_PAGE}`);
    const data = await response.json();
    return data;
  };
  
const ReservationUtilityList = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
 
    const [currentPage, setCurrentPage] = useState(1);
    const [dataToDisplay, setDataToDisplay] = useState<ItemProps[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading state
  
    useEffect(() => {
        const startIndex = (currentPage - 1) * 3;
        const endIndex = startIndex + 3;
        const newData = MOCK_DATA.slice(startIndex, endIndex);
        // Append new data to existing data
        setDataToDisplay([...dataToDisplay, ...newData]);
      }, [currentPage]); // Update data when page changes
    
    //   useEffect(() => {
    //     const fetchData = async () => {
    //       const newData = await fetchItems(currentPage);
    //       setData([...data, ...newData]); // Append new data
    //     };
    //     fetchData();
    //   }, [currentPage]); 


      const handleNextPage = async () => {
        if (currentPage * 3 < MOCK_DATA.length && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate delayed loading for demonstration purposes
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
    const render = ({ item }: any) => (
        <Pressable style={[SHADOW, { backgroundColor: 'white', borderRadius: 10, marginTop: 20 }]}
        onPress={() =>
            router.push({
              pathname: `/(mobile)/(screens)/(utility)/(reservation)/${item.id}`,
              params: item,
            })}>
        <View style={{ borderBottomWidth: 1 }}>
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.circle, { backgroundColor: theme.sub }]}></View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Bong da</Text>
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
                    <Text style={{ fontWeight: 'bold' }}>{t("Unsucessful")}</Text>
                </View>
            </View>
        </View>
        <View style={{ borderBottomWidth: 1 }}>
            <View style={{ paddingHorizontal: 10,paddingVertical:20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{color:"#9C9C9C"}}>{t("Date")}: </Text>
                    <Text>aaa</Text>
                </View>
                <View style={{ flexDirection: 'row' ,marginTop:10}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Time")}: </Text>
                    <Text>aaa</Text>
                </View>
                <View style={{ flexDirection: 'row' ,marginTop:10}}>
                    <Text style={{color:"#9C9C9C"}}>{t("Number of tickets")}: </Text>
                    <Text>aaa</Text>
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
    )

    return (
        <>
            <Header headerTitle={t("Booking history")} />
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                <View style={{ flex:1,  }}>
                   <FlatList
                   style={{paddingHorizontal:26}}
                    data={dataToDisplay}
                    renderItem={render}
                    keyExtractor={(item) => item.id.toString()}
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

