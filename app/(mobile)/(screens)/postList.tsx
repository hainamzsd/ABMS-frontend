import { View, Text, SafeAreaView, StyleSheet, Pressable, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/resident/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { Clock, Info } from 'lucide-react-native'
import SHADOW from '../../../constants/shadow'


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

const PostList = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [currentPage, setCurrentPage] = useState(1);
    const [dataToDisplay, setDataToDisplay] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading state

    useEffect(() => {
        const startIndex = (currentPage - 1) * 4;
        const endIndex = startIndex + 4;
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
            return <ActivityIndicator size="small" color={theme.primary} />;
        }
        return null;

    };

    const render = ({ item }: any) => (
        <Pressable style={styles.box}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Hiện trạng cao tốc Vân Phong - Nha Trang dự kiến vượt tiến độ 6 tháng</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <View style={[styles.iconTextContainer, { backgroundColor: theme.primary, borderRadius: 20, padding: 10 }]}>
                    <Info color={'white'} size={20}></Info>
                    <Text style={{ color: 'white', marginLeft: 5 }}>{t("Post")}</Text>
                </View>
                <View style={styles.iconTextContainer}>
                    <Clock color={'#9C9C9c'} size={20}></Clock>
                    <Text style={{ color: "#9C9C9C", marginLeft: 5 }}>24/2/22</Text>
                </View></View>
        </Pressable>

    )
    return (
        <>
            <Header headerTitle={t("News")}></Header>
            <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
                <View style={{ flex:1 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginHorizontal:26,marginTop:20 }}>{t("All news")}</Text>

                    <FlatList
                        style={{ paddingHorizontal: 26 }}
                        data={dataToDisplay}
                        renderItem={render}
                        keyExtractor={(item: any) => item.id.toString()}
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


export default PostList