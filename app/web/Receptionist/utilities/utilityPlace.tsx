import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, FlatList, StyleSheet, Pressable } from 'react-native'
import { UtilityDetail } from '../../../../interface/utilityType';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import SearchWithButton from '../../../../components/ui/searchWithButton';
import SHADOW from '../../../../constants/shadow';
import { Image } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ColorPalettes } from '../../../../constants';

const UtilityPlace = () => {
    const params = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [utilityDetails, setUtilityDetails] = useState<UtilityDetail[]>();

    useEffect(() => {
        fetchUtilityDetail();
    }, [])

    const fetchUtilityDetail = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-utility-detail?utilityId=${params?.id}`, {
                timeout: 10000,
            });
            if (response.status === 200) {
                setUtilityDetails(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi lấy thông tin tiện ích chi tiết',
                    position: 'bottom'
                })
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Hệ thống lỗi! Vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            console.error('Error fetching utility detail data:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin tiện ích chi tiết',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    const renderItem = ({ item }: { item: UtilityDetail }) => {
        return (
            <Pressable onPress={() => {
                router.push({
                    pathname: `../utilities/utility`, params: {
                        id: item?.id
                    }
                })
            }}>
                <View style={styles.container}>
                    <MapPin strokeWidth={2} color={'#fff'}></MapPin>
                    <View style={styles.textContainer}>
                        <View >
                            <Text numberOfLines={1} style={styles.title}>{item?.name}</Text>
                            <Text numberOfLines={2} style={styles.content}>{params?.location}</Text>
                        </View>
                    </View>
                </View >
            </Pressable>

        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách vị trí tiện ích</Text>
                        <Text>Thông tin các vị trí tiện ích</Text>
                    </View>
                    <SearchWithButton placeholder="Tìm kiếm tên vị trí tiện ích" />
                </View>
                <FlatList
                    style={{ paddingHorizontal: 30, paddingTop: 30 }}
                    data={utilityDetails}
                    renderItem={renderItem}
                    keyExtractor={item => item?.id}
                />
            </SafeAreaView>
        </View>
    )
}

export default UtilityPlace
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomColor: '#cccccc',
        alignItems: 'center',
        ...SHADOW,
        backgroundColor: ColorPalettes.summer.primary,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10, // Adjust for rounded corners
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: '#333333',
        overflow: 'hidden',
    },
    content: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: '#999999',
    },
});