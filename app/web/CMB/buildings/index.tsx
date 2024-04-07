import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { user } from '../../../../interface/accountType'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../../context/AuthContext'
import { COLORS, ColorPalettes, FONTS, SIZES } from '../../../../constants'
import { SHADOW, SHADOWS } from '../../../../constants'
import { Building, HomeIcon, LocateIcon } from 'lucide-react-native'
import { BedSingle } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import axios from 'axios'
import { Building as BuildingType } from '../../../../interface/roomType'
import Button from '../../../../components/ui/button'
import styles from './styles'

const Page = () => {
    const { session } = useAuth();
    const user: user = jwtDecode(session as string);

    const [isLoading, setIsLoading] = useState(false);
    const [building, setBuilding] = useState<BuildingType>();

    const fetchBuilding = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/building/get/${user?.BuildingId}`, {
                timeout: 10000,
            });
            if (response.data.statusCode === 200) {
                setBuilding(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi lấy thông tin căn hộ',
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
            console.error('Error fetching room data:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin căn hộ',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    };

    useEffect(() => {
        fetchBuilding();
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1 }}>
                    <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Thông tin tòa nhà</Text>
                            {/* <Text>Thông tin tòa nhà <Text style={{ fontWeight: 'bold', fontSize: SIZES.medium }}>Ha Dong</Text></Text> */}
                            <Text>Thông tin tòa nhà</Text>
                        </View>
                        <View>
                            <Link href={`/web/CMB/buildings/${building?.id}`}>
                                <Button text='Cập nhập thông tin tòa nhà' />
                            </Link>
                        </View>
                    </View>

                    {isLoading && <ActivityIndicator size={'large'} color="#171717"></ActivityIndicator>}
                    <View id="main-content" style={{ width: '100%', flex: 1 }}>
                        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.medium }}>
                            <View id="name" style={styles.box}>
                                <Building strokeWidth={2} color={ColorPalettes.ocean.primary} size={48}></Building>
                                <Text style={{ fontSize: SIZES.xLarge, fontWeight: 'bold' }}>{building?.name}</Text>
                            </View>
                            <View id="address" style={styles.box}>
                                <LocateIcon strokeWidth={2} color={ColorPalettes.ocean.primary} size={48}></LocateIcon>
                                <Text style={{ fontSize: SIZES.xLarge, fontWeight: 'bold' }}>{building?.address}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.medium }}>
                            <View style={styles.box}>
                                <HomeIcon strokeWidth={2} color={ColorPalettes.ocean.primary} size={48}></HomeIcon>
                                <Text style={{ fontSize: SIZES.xLarge, fontWeight: 'bold' }}>Số tầng: {building?.numberOfFloor}</Text>
                            </View>
                            <View style={styles.box}>
                                <BedSingle strokeWidth={2} color={ColorPalettes.ocean.primary} size={48}></BedSingle>
                                <Text style={{ fontSize: SIZES.xLarge, fontWeight: 'bold' }}>Số căn hộ mỗi tầng: {building?.roomEachFloor}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* style={{ flexDirection: 'row', justifyContent: 'center' } */}
                    {/*  */}
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default Page
