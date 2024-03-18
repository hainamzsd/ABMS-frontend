import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, ActivityIndicator, SafeAreaView, Text } from 'react-native';
import Button from '../../../../../components/ui/button';
import Input from '../../../../../components/ui/input';
import { statusForReceptionist } from '../../../../../constants/status';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Reservation } from '../../../../../interface/utilityType';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from '../../../context/AuthContext';
import { Room } from '../../../../../interface/roomType';
import Swal from 'sweetalert2';

const StatusData = [
    { label: "Phê duyệt", value: 3 },
    { label: "Từ chối", value: 4 },
    { label: "Để chờ", value: 2 }
]

const UtilityDetail = () => {
    const item = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [utility, setUtility] = useState<Reservation>();
    const [status, setStatus] = useState();
    const navigation = useNavigation();
    const disableBtn = status === undefined;
    const { session } = useAuth();
    const [room, setRoom] = useState<Room>();

    useEffect(() => {
        fetchData();
    }, [session])

    // GET: Utility
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/reservation/get?utilityDetailId=${item?.id}`, {
                timeout: 10000,
            });
            if (response.status === 200) {
                setUtility(response.data.data[0]);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi lấy thông tin tiện ích của căn hộ',
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
            console.error('Error fetching utility of room data:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin tiện ích của căn hộ',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    // GET: ROOM
    const fetchRoom = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get/${utility?.room_id}`, { timeout: 100000 })
            if (response.data.statusCode === 200) {
                setRoom(response.data.data)
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom',
                })
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Hệ thống không phản hồi, thử lại sau',
                    position: 'bottom'
                });
            }
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                position: 'bottom',
            })
        } finally {
            setIsLoading(false)
        }
    }

    // PUT: Approve Status
    const approveUtility = async () => {
        try {
            setIsLoading(true); // Set loading state to true
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/reservation/manage/${utility?.id}?status=${status}`, {}, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            // console.log(response);

            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Phê duyệt phiếu đặt chỗ thành công',
                    position: 'bottom'
                })
                // router.replace('/web/Receptionist/utilities/utility');
            }
            else {
                console.error(response);
                Toast.show({
                    type: 'error',
                    text1: 'Phê duyệt yêu cầu không thành công',
                    position: 'bottom'
                })
            }
        } catch (error: any) {
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            else {
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi cập nhật phiếu đặt chỗ! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (utility?.room_id === undefined) {
            return;
        }
        fetchRoom();
    }, [utility])

    // DELETE: Cancel Status
    const cancelUtility = async () => {
        try {
            setIsLoading(true); // Set loading state to true
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/reservation/manage/${utility?.id}?status=${status}`, {}, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            // console.log(response);

            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Từ chối phiếu đặt chỗ thành công',
                    position: 'bottom'
                })
                // router.replace('/web/Receptionist/utilities/utility');
            }
            else {
                console.error(response);
                Toast.show({
                    type: 'error',
                    text1: 'Từ chối yêu cầu không thành công',
                    position: 'bottom'
                })
            }
        } catch (error: any) {
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            else {
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi cập nhật phiếu đặt chỗ! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 30,
                paddingVertical: 30,
                backgroundColor: "#F9FAFB",
            }}
        >
            {isLoading &&
                <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>
            }
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Quay Lại"
                        onPress={() => navigation.goBack()}
                    ></Button>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
                            Thông tin phiếu đặt chỗ tiện ích
                        </Text>
                        <Text>Lễ tân xem xét yêu cầu đăng kí của cư dân về phiếu đặt chỗ</Text>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Thông tin căn hộ
                        </Text>
                        {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
                        <Input
                            editable={false}
                            selectTextOnFocus={false}
                            placeholderTextColor={'black'}
                            placeholder={`${room?.roomNumber}`} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
                        ></Input>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Tên sân
                        </Text>
                        <Input
                            editable={false}
                            selectTextOnFocus={false}
                            placeholderTextColor={'black'}
                            placeholder={utility?.utility_detail_name} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
                        ></Input>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Khung giờ
                        </Text>
                        <Input
                            editable={false}
                            selectTextOnFocus={false}
                            placeholderTextColor={'black'}
                            placeholder={`${utility?.slot}`} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
                        ></Input>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Số người
                        </Text>
                        <Input
                            editable={false}
                            selectTextOnFocus={false}
                            placeholderTextColor={'black'}
                            placeholder={utility?.number_of_person} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
                        ></Input>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Ngày đặt
                        </Text>
                        <Input
                            editable={false}
                            selectTextOnFocus={false}
                            placeholderTextColor={'black'}
                            placeholder={utility?.booking_date} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
                        ></Input>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Tổng tiền
                        </Text>
                        <Input
                            editable={false}
                            selectTextOnFocus={false}
                            placeholderTextColor={'black'}
                            placeholder={`${utility?.total_price}`} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
                        ></Input>
                    </View>
                    <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: "600", fontSize: 16, marginRight: 5 }}>
                            Ghi chú:
                        </Text>
                        <Text>{utility?.description}</Text>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Trạng thái
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>Trạng thái hiện tại:</Text>
                            {utility?.status &&
                                <Button text={statusForReceptionist?.[utility?.status as any].status}
                                    style={{
                                        borderRadius: 20,
                                        marginLeft: 10,
                                        backgroundColor: statusForReceptionist?.[utility?.status as any].color
                                    }}
                                > </Button>
                            }

                        </View>
                        {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
                        <Dropdown
                            style={styles.comboBox}
                            placeholderStyle={{ fontSize: 14, }}
                            placeholder={"Chọn trạng thái"}
                            itemContainerStyle={{ borderRadius: 10 }}
                            data={StatusData}
                            value={status}
                            search={false}
                            labelField="label"
                            valueField="value"
                            onChange={(item: any) => {
                                setStatus(item.value);
                            }}
                        ></Dropdown>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Button
                            onPress={approveUtility}
                            disabled={disableBtn}
                            text="Phê duyệt" style={[{
                                width: 100, marginRight: 10,
                                opacity: disableBtn ? 0.7 : 1
                            }]}></Button>
                        <Button
                            onPress={() => {
                                Swal.fire({
                                    title: 'Xác nhận',
                                    text: 'Bạn có muốn xóa phiếu đặt chỗ này?',
                                    icon: 'warning',
                                    showCloseButton: true,
                                    confirmButtonText: 'Xóa',
                                    confirmButtonColor: '#9b2c2c',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        cancelUtility();
                                    }
                                })
                            }}
                            text="Xóa" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default UtilityDetail
const styles = StyleSheet.create({
    comboBox: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        marginTop: 5,
        flex: 1
    },
})