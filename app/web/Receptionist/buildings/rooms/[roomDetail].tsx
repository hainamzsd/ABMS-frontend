import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native'
import Button from '../../../../../components/ui/button'
import Input from '../../../../../components/ui/input'
import { Select, CheckIcon, Box, Badge } from "native-base";
import { COLORS, SHADOWS } from '../../../../../constants';
import { Link, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { SIZES } from '../../../../../constants'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { useAuth } from '../../../context/AuthContext';

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
    const router = useRouter();
    // accountId???
    const item = useLocalSearchParams();

    // STATE
    const [isLoading, setIsLoading] = useState(false);
    const [roomData, setRoomData] = useState<Room>();
    const [roomNumber, setRoomNumber] = useState("");
    const [buildingId, setBuildingId] = useState("");
    const [roomArea, setRoomArea] = useState("");
    const [numberOfResident, setNumberOfResident] = useState("");
    const [addMember, setAddMember] = useState(false);
    const [isDetail, setIsDetail] = useState(false);

    // SESSION
    const { session } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Replace accountId ? 
                const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?accountId=${item?.roomDetail}`, {
                    timeout: 10000,
                });
                console.log(response);
                if (response.status === 200) {
                    setRoomNumber(response.data.data[0].roomNumber);
                    setBuildingId(response.data.data[0].buildingId);
                    setRoomArea(response.data.data[0].roomArea);
                    setNumberOfResident(response.data.data[0].numberOfResident);
                    setRoomData(response.data.data[0]);
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

    const updateRoom = async () => {
        // setError(null);
        // setValidationErrors({});
        const bodyData = {
            accountId: roomData?.accountId,
            buildingId: buildingId,
            roomNumber: roomNumber,
            roomArea: roomArea,
            numberOfResident: numberOfResident
        }
        try {
            setIsLoading(true); // Set loading state to true
            //   await validationSchema.validate(bodyData, { abortEarly: false });
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/account/update/${roomData?.id}`, bodyData, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            console.log(response);
            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Cập nhật tài khoản thành công',
                    position: 'bottom'
                })
                router.replace('/web/Receptionist/buildings/rooms/1');
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Cập nhật tài khoản không thành công',
                    position: 'bottom'
                })
            }
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: any = {};
                error.inner.forEach((err: any) => {
                    errors[err.path] = err.message;
                });
                //   setValidationErrors(errors);
            }
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            else {
                console.error('Error creating account:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi cập nhật tài khoản',
                    position: 'bottom'
                })
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRoomMember = () => {
    }

    const toggleDetail = () => {
        setIsDetail(!isDetail);
    }

    const toggleAddMember = () => {
        setAddMember(!addMember);
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
                                        <Select.Item label="1" value="1" />
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
                                <Button text={addMember ? "Hủy bỏ" : "Thêm thành viên"} onPress={toggleAddMember} />
                            </View>
                        </View>

                        {/* Member Card */}
                        <View id='member' style={{ width: '100%', flexDirection: 'row', gap: SIZES.small, marginVertical: SIZES.xSmall - 2, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', gap: SIZES.medium }}>
                                <View style={{ borderWidth: 1, alignSelf: 'flex-start', padding: SIZES.xSmall, borderColor: COLORS.gray2, ...SHADOWS.small, borderRadius: SIZES.small }}>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Vo Le Hang</Text>
                                            <Badge colorScheme="info" style={{ marginTop: 2 }}>Member</Badge>
                                        </View>
                                        <Button text={isDetail ? 'Hide' : 'Detail'} onPress={toggleDetail} />
                                    </View>
                                </View>
                                {isDetail && <View style={{ borderWidth: 1, alignSelf: 'flex-start', padding: SIZES.small, borderColor: COLORS.gray2, ...SHADOWS.small, borderRadius: SIZES.small }}>
                                    <Text>Họ và tên: <Text style={{ fontWeight: 'bold' }}>Võ Lê Hằng</Text></Text>
                                    <Text>Số điện thoại: <Text style={{ fontWeight: 'bold' }}>0964766165</Text></Text>
                                    <Text>Ngày sinh: <Text style={{ fontWeight: 'bold' }}>08/12/2003</Text></Text>
                                    <Text>Giới tính: <Text style={{ fontWeight: 'bold' }}>Nữ</Text></Text>
                                </View>}
                            </View>
                            {addMember && <View style={{ borderWidth: 1, width: '60%', padding: SIZES.small, borderColor: COLORS.gray2, ...SHADOWS.small, borderRadius: SIZES.small }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Họ và tên
                                </Text>
                                <Input placeholder="Tên" style={[{ width: "100%" }]}
                                    value=""
                                    onChangeText={(text) => {
                                    }}></Input>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Ngày sinh
                                </Text>
                                <Input placeholder="Ngày sinh" style={[{ width: "100%" }]}
                                    value=""
                                    onChangeText={(text) => {
                                    }}></Input>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Số điện thoại
                                </Text>
                                <Input placeholder="Số điện thoại" style={[{ width: "100%" }]}
                                    keyboardType='phone-pad'
                                    value=""
                                    onChangeText={(text) => {
                                    }}></Input>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Giới tính
                                </Text>
                                {/* Two box */}
                                <Input placeholder="Giới tính" style={[{ width: "100%" }]}
                                    value=""
                                    onChangeText={(text) => {
                                    }}></Input>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Diện tích căn hộ
                                </Text>
                                <Input placeholder="Diện tích căn hộ" style={[{ width: "100%" }]}
                                    value=""
                                    onChangeText={(text) => {
                                    }}></Input>
                            </View>}
                        </View>

                        {/* ACTION */}
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                            <Button
                                onPress={updateRoom}
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