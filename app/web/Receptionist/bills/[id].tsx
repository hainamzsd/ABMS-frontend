import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, SafeAreaView, ScrollView, Text } from 'react-native'
import Input from '../../../../components/ui/input'
import Button from '../../../../components/ui/button'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { Divider, Select, TextArea } from 'native-base'
import { CheckIcon } from 'lucide-react-native'
import { COLORS } from '../../../../constants'
import { Button as ButtonBase } from 'native-base'
import axios from 'axios'
import { API_BASE, actionController } from '../../../../constants/action'
import { ToastFail, ToastSuccess } from '../../../../constants/toastMessage'
import { useAuth } from '../../context/AuthContext'
import { ServiceChargeTotal } from '../../../../interface/serviceType'

const BillDetail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState('');
    const [bill, setBill] = useState<ServiceChargeTotal>();

    const item = useLocalSearchParams();
    const navigation = useNavigation();
    const { session } = useAuth();

    useEffect(() => {
        fetchBill();
    }, [])

    const fetchBill = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get-total/${item.id}`, {
                timeout: 10000,
            })
            console.log(response)
            if (response.data.statusCode === 200) {
                setBill(response.data.data[0]);
                setStatus(response.data.data[0]?.status);
            } else {
                ToastFail('Lấy thông tin hoá đơn thất bại');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to updating service charge data", error);
            ToastFail("Lỗi lấy thông tin hoá đơn");
        }
        finally {
            setIsLoading(false);
        }
    }

    const updateBill = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_BASE}/${actionController.SERVICE_CHARGE}/update/${item?.id}?description=${description}&status=${status}`, {}, {
                timeout: 10000,
                withCredentials: true, 
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            })
            console.log(response)
            if (response.data.statusCode === 200) {
                ToastSuccess('Cập nhập hoá đơn thành công')
            } else {
                ToastFail('Cập nhập hoá đơn thất bại');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to updating service charge data", error);
            ToastFail("Lỗi lấy thông tin hoá đơn");
        }
        finally {
            setIsLoading(false);
        }
    }
    const deleteBill = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${API_BASE}/${actionController.SERVICE_CHARGE}/delete/${item?.id}`, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            })
            if (response.data.statusCode === 200) {
                ToastSuccess('Xoá hoá đơn thành công')
            } else {
                ToastFail('Xoá hoá đơn thất bại');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to deleting service charge data", error);
            ToastFail("Lỗi xoá hoá đơn");
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleUpdateBill = () => {
        updateBill();
    }

    // const handleDeleteBill = () => {
    //     deleteBill();
    // }

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
                        onPress={() => router.push({
                            pathname: '/web/Receptionist/bills/'
                        })}

                    ></Button>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
                            Thông tin hoá đơn
                        </Text>
                        <Text>Thông tin chi tiết của hoá đơn</Text>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Căn hộ
                        </Text>
                        {/* {/* <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 10, }}>Họ và tên không được trống.</Text> */}
                        <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 10, }}>Số căn hộ không thể chỉnh sửa.</Text>
                        <Input
                            value={"Keme tao"}
                            style={[{ width: "100%", backgroundColor: COLORS.buttonDisable }]}
                            readOnly

                        ></Input>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                        <View style={{ width: '20%' }}>
                            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                Tháng
                            </Text>
                            <Input style={{ backgroundColor: COLORS.buttonDisable }} value={`${bill?.month}`}/>

                        </View>
                        <View style={{ width: '20%' }}>
                            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                Năm
                            </Text>
                            <Input style={{ backgroundColor: COLORS.buttonDisable }} value={`${bill?.year}`}
                            />

                        </View>
                        <View style={{ width: '56%' }}>
                            <Text style={{ marginBottom: 7, fontWeight: "600", fontSize: 16 }}>
                                Trạng thái hoá đơn
                            </Text>
                            <Select selectedValue={`${bill?.status}`} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setStatus(itemValue)}>
                                <Select.Item label="Hoạt động" value="6" />
                                <Select.Item label="Ngưng hoạt động" value="5" />
                            </Select>
                        </View>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Mô tả hoá đơn
                        </Text>
                        <TextArea
                            backgroundColor={'#fff'}
                            shadow={2}
                            totalLines={5}
                            autoCompleteType={""}
                            value={description}
                            onChangeText={text => setDescription(text)}
                            w="100%" maxW="100%" />
                    </View>
                    <Divider mt={4} />
                    <View style={{ flexDirection: 'row', marginTop: 10, gap: 8, justifyContent: 'center' }}>
                        <ButtonBase colorScheme="success" onPress={handleUpdateBill}>Cập nhập hoá đơn</ButtonBase>
                        {/* <ButtonBase colorScheme="danger" onPress={deleteBill}>Xoá hoá đơn</ButtonBase> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default BillDetail