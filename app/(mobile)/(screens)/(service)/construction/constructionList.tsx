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
  { id: 1, name: 'Xay nha', description: 'Description for item 1' },
  { id: 2, name: 'Hoa', description: 'Description for item 2Description for item 2Description for item 2Description for item 2' },
  { id: 3, name: 'Item 3', description: 'Description for item 3' },
];

const ConstructionList = () => {
 
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
        <Pressable style={[SHADOW, { backgroundColor: 'white',  }]}
        onPress={() => {
          router.push({
            pathname: `/(mobile)/(screens)/(service)/construction/${item.id}`,
            params: item,
          })
        }}
        >
        <View style={{ borderBottomWidth: 1,borderColor:'#9c9c9c' }}>
           <View style={{padding:20, flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{justifyContent:'space-between',flex:1}}>
                    <View style={{flex:0.6}}>
                    <Text style={{fontWeight:'bold', fontSize:20}}>{item.name}</Text>
                    <Text>{item.description}</Text>
                    </View>
                    <Text style={{color:"#9c9c9c"}}>{t("Create date")} 22/2/222</Text>
                </View>
                <View style={{
                    padding: 10, borderRadius: 20, backgroundColor: theme.primary,
                    justifyContent: 'center', height: 40
                }}>
                    <Text style={{ fontWeight: '600',color:'white' }}>{t("Unsucessful")}</Text>
                </View>
           </View>
        </View>
    </Pressable>
    )
    return (
      <>
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
                    data={dataToDisplay}
                    style={{marginTop:10}}
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
  
export default ConstructionList