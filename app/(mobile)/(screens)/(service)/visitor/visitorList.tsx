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

const VisitorList = () => {
 
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [dataToDisplay, setDataToDisplay] = useState<any[]>([]);
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
        onPress={() => {
          router.push({
            pathname: `/(mobile)/(screens)/(service)/visitor/${item.id}`,
            params: item,
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
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Hoa La</Text>
                    </View>
                </View>
                <View style={{
                    padding: 10, borderRadius: 20, backgroundColor: theme.primary,
                    justifyContent: 'center', height: 40
                }}>
                    <Text style={{ fontWeight: '600',color:'white' }}>{t("Unsucessful")}</Text>
                </View>
            </View>
        </View>
        <View style={{ borderBottomWidth: 1 ,borderColor:'#9c9c9c'}}>
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
        <Header headerTitle={t("Manage visitor")} />
        <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
          <View style={{ marginHorizontal: 26 }}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>{t("Registered visitor")}</Text>
              <Text>{t("Visitor requests")}</Text>
            </View>
          </View>
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