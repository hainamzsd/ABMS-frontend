import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, SafeAreaView, ScrollView, Text, FlatList } from 'react-native'
import Input from '../../../../components/ui/input'
import Button from '../../../../components/ui/button'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { Badge, Divider, Select, TextArea } from 'native-base'
import { CheckIcon } from 'lucide-react-native'
import { COLORS, SIZES } from '../../../../constants'
import { Button as ButtonBase } from 'native-base'
import axios from 'axios'
import { API_BASE, actionController } from '../../../../constants/action'
import { ToastFail, ToastSuccess } from '../../../../constants/toastMessage'
import { useAuth } from '../../context/AuthContext'
import { ServiceCharge, ServiceChargeTotal } from '../../../../interface/serviceType'
import { moneyFormat } from '../../../../utils/moneyFormat'
import { Cell, TableComponent, TableRow } from '../../../../components/ui/table'
import { billSchema } from '../../../../constants/schema'

const BillDetail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState('');
    const [bill, setBill] = useState<ServiceChargeTotal>();
    const [generalBill, setGeneralBill] = useState<ServiceCharge>();
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const headers = ["Tên chi phí", "Chi phí", "Số lượng", "Thành tiền"]
    const { session } = useAuth();

    useEffect(() => {
        fetchGeneralBill();
        fetchBill();
    }, [])

    // GET: total of room
    const fetchBill = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get-total/${params.roomId}`, {
                timeout: 10000,
            })
            console.log(response)
            if (response.data.statusCode === 200) {
                setBill(response.data.data[0]);
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

    const fetchGeneralBill = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get/${params.id}`, {
                timeout: 10000,
            })
            console.log(response);
            if (response.data.statusCode === 200) {
                setGeneralBill(response.data.data);
                setStatus(response.data.data.status)
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

    // PUT: update service charge
    const updateBill = async () => {
        setValidationErrors({});
        try {
            setIsLoading(true);
            await billSchema.validate({ description: description }, { abortEarly: false })
            const response = await axios.put(`${API_BASE}/${actionController.SERVICE_CHARGE}/update/${params?.id}?description=${description}&status=${status}`, {}, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            })

            if (response.data.statusCode === 200) {
                ToastSuccess('Cập nhập hoá đơn thành công')
            } else {
                ToastFail('Cập nhập hoá đơn thất bại');
            }
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: any = {};
                error.inner.forEach((err: any) => {
                    errors[err.path] = err.message;
                });
                setValidationErrors(errors);
            }
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            } else {
                console.log("Fail to updating service charge data", error);
                ToastFail("Lỗi lấy thông tin hoá đơn");
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    // const deleteBill = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.delete(`${API_BASE}/${actionController.SERVICE_CHARGE}/delete/${params?.id}`, {
    //             timeout: 10000,
    //             headers: {
    //                 'Authorization': `Bearer ${session}`
    //             }
    //         })
    //         if (response.data.statusCode === 200) {
    //             ToastSuccess('Xoá hoá đơn thành công')
    //         } else {
    //             ToastFail('Xoá hoá đơn thất bại');
    //         }
    //     } catch (error) {
    //         if (axios.isCancel(error)) {
    //             ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
    //         }
    //         console.log("Fail to deleting service charge data", error);
    //         ToastFail("Lỗi xoá hoá đơn");
    //     }
    //     finally {
    //         setIsLoading(false);
    //     }
    // }

    // const handleDeleteBill = () => {
    //     deleteBill();
    // }

    const handleUpdateBill = () => {
        updateBill();
    }

    const renderItem = ({ item }: { item: any, index: number }) => {
        const feeBadge = `${moneyFormat(item.fee)} VNĐ`;
        const totalBadge = `${moneyFormat(item.total)} VNĐ`
        return (
            <TableRow>
                <Cell><Badge variant="outline" colorScheme="info">{item.service_name}</Badge></Cell>
                <Cell><Badge variant="outline">{feeBadge}</Badge></Cell>
                <Cell><Badge variant="outline" colorScheme="danger">{item.amount}</Badge></Cell>
                <Cell><Badge variant="outline" colorScheme="success">{totalBadge}</Badge></Cell>
            </TableRow>
        )
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
                            value={`${params?.roomNumber}`}
                            style={[{ width: "100%", backgroundColor: COLORS.buttonDisable }]}
                            readOnly
                        ></Input>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                        <View style={{ width: '20%' }}>
                            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                Tháng
                            </Text>
                            <Input style={{ backgroundColor: COLORS.buttonDisable }} value={`${generalBill?.month}`} />

                        </View>
                        <View style={{ width: '20%' }}>
                            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                Năm
                            </Text>
                            <Input style={{ backgroundColor: COLORS.buttonDisable }} value={`${generalBill?.year}`}
                            />

                        </View>
                        <View style={{ width: '56%' }}>
                            <Text style={{ marginBottom: 7, fontWeight: "600", fontSize: 16 }}>
                                Trạng thái hoá đơn
                            </Text>
                            <Select selectedValue={`${status}`} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setStatus(itemValue)}>
                                <Select.Item label="Chưa thanh toán" value="6" />
                                <Select.Item label="Đã thanh toán" value="5" />
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
                        {validationErrors.description && (
                            <Text style={{
                                color: 'red',
                                fontSize: 14
                            }}>{validationErrors.description}</Text>
                        )}
                    </View>

                    <View style={{ marginVertical: 12 }}>
                        <Text style={{ fontWeight: "600", fontSize: 16 }}>Chi tiết hoá đơn</Text>
                    </View>
                    {bill?.detail.length || 0 > 0 ?
                        <TableComponent headers={headers}>
                            <FlatList
                                data={bill?.detail}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.service_name}
                            />
                            <TableRow>
                                <Cell>Tổng hoá đơn</Cell>
                                <Cell>...</Cell>
                                <Cell>...</Cell>
                                <Cell><Badge variant="outline" colorScheme="success" _text={{ fontSize: 14 }}>{`${moneyFormat(bill?.total || 0)} VNĐ`}</Badge></Cell>
                            </TableRow>
                        </TableComponent> : <View><Text style={{ fontSize: SIZES.medium, color: COLORS.gray, fontStyle: 'italic', textAlign: 'center' }}>Hiện chưa có chi phí nào.</Text></View>}
                    {/* <Divider mt={4} /> */}
                    <View style={{ flexDirection: 'row', marginTop: 10, gap: 8, justifyContent: 'center' }}>
                        <ButtonBase colorScheme="success" onPress={handleUpdateBill}>Cập nhập hoá đơn</ButtonBase>
                        {/* <ButtonBase colorScheme="danger" onPress={handleDeleteBill}>Xoá hoá đơn</ButtonBase> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default BillDetail