import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native'
import Button from '../../../../../components/ui/button'
import Input from '../../../../../components/ui/input'
import { Select, CheckIcon, Box } from "native-base";
import { SHADOW } from '../../../../../constants';

import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import { SIZES } from '../../../../../constants'
import axios from 'axios'
import Toast from 'react-native-toast-message'

interface Room {
    id: string;
    accountId: string;
    buildingId: string | null;
    roomNumber: string | null;
    roomArea: number;
    numberOfResident: number;
    createUser: string;
    createTime: string;
    modifyUser: string | null;
    modifyTime: string | null;
    status: number;
}

const RoomDetail = () => {
    const navigation = useNavigation();
    // accountId???
    const item = useLocalSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [roomNumber, setRoomNumber] = useState("");
    const [buildingId, setBuildingId] = useState("");
    const [roomArea, setRoomArea] = useState("");
    const [numberOfResident, setNumberOfResident] = useState("");
    const [isDetail, setIsDetail] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Replace accountId ? 
                const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?accountId=caf1b564-9cd7-43ff-a8ad-4d36c9ed26d9`, {
                    timeout: 10000,
                });
                console.log(response);
                if (response.status === 200) {
                    setRoomNumber(response.data.data[0].roomNumber);
                    setBuildingId(response.data.data[0].buildingId);
                    setRoomArea(response.data.data[0].roomArea);
                    setNumberOfResident(response.data.data[0].numberOfResident);
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
        fetchData();
    }, []);

    const handleAddRoomMember = () => {

    }

    const toggleDetail = () => {
        setIsDetail(!isDetail);
    }

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 30,
                paddingVertical: 30,
                backgroundColor: "#F9FAFB",
            }}
        >
            {isLoading ?
                <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>
                :
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <Button
                            style={{ width: 100, marginBottom: 20 }}
                            text="Quay Lại"
                            onPress={() => navigation.goBack()}
                        ></Button>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
                                Thông tin căn hộ
                            </Text>
                            <Text>Thông tin chi tiết của căn hộ <Text style={{ fontWeight: 'bold', fontSize: SIZES.medium - 2 }}>{roomNumber}, Toà {buildingId}</Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ width: '48%' }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Số căn hộ
                                </Text>
                                <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 10, }}>Số căn hộ không được trống.</Text>
                                <Input
                                    value={roomNumber} onChangeText={(text) => {
                                        setRoomNumber(text);
                                    }}
                                    placeholder="Số căn hộ" style={[{ width: "100%" }]}

                                ></Input>
                                {/* {validationErrors.full_name && (
              <Text style={styles.errorText}>{validationErrors.full_name}</Text>
            )} */}
                            </View>
                            <View style={{ width: '48%' }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Toà nhà
                                </Text>
                                <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 6, }}>Số căn hộ không được trống.</Text>
                                <Box>
                                    <Select selectedValue={buildingId} minWidth="100%" height='36px' accessibilityLabel="Chọn toà nhà" placeholder="Chọn toà nhà" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1} onValueChange={itemValue => setBuildingId(itemValue)}>
                                        <Select.Item label={buildingId} value={buildingId} />
                                        <Select.Item label="abc" value="abc" />
                                    </Select>
                                </Box>
                            </View>
                        </View>
                        <View>
                            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                Diện tích căn hộ
                            </Text>
                            <Input placeholder="Tên tài khoản" style={[{ width: "100%" }]}
                                value={roomArea}
                                onChangeText={(text) => {
                                    setRoomArea(text);
                                }}></Input>
                            {/* {validationErrors.user_name && (
              <Text style={styles.errorText}>{validationErrors.user_name}</Text>
            )} */}
                        </View>
                        <View style={{ marginTop: 4 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SIZES.small }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 20 }}>
                                    Số thành viên ({numberOfResident})
                                </Text>
                                <Button text="Thêm thành viên" onPress={handleAddRoomMember} />
                            </View>
                        </View>
                        <View>
                            <Text>Vo Le Hang</Text>
                            <Button style={{width: '10%'}} text={isDetail ? 'Hide' : 'Detail'} onPress={toggleDetail}/>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Button
                                // onPress={updateAccount}
                                text="Cập nhật" style={[{
                                    width: 100, marginRight: 10,
                                }]}></Button>
                            <Button
                                // onPress={handleDeleteAccount}
                                text="Xóa" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            }
        </View>
    )
}

export default RoomDetail