import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, ScrollView, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import Button from '../../../../components/ui/button'
import Input from '../../../../components/ui/input'
import { Badge, CheckIcon, Select } from 'native-base'
import { ServiceCharge } from '../../../../interface/serviceType'
import axios from 'axios'
import { API_BASE, actionController } from '../../../../constants/action'
import { ToastFail } from '../../../../constants/toastMessage'
import styles from './styles'
import { moneyFormat } from '../../../../utils/moneyFormat'
import { router } from 'expo-router'
import { Cell, TableComponent, TableRow } from '../../../../components/ui/table'
import { COLORS, SIZES } from '../../../../constants'
import { ActivityIndicator } from 'react-native-paper'

const BillDashboard = () => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const years = [2023, 2024];
    const headers = ['Căn hộ', 'Trạng thái hoá đơn', 'Thời gian', 'Ghi chú', 'Tổng tiền', ''];

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRequest, setFilterRequest] = useState<ServiceCharge[]>([]);

    // Search
    // useEffect(() => {
    //     if (searchQuery.trim() !== '') {
    //         const filtered = serviceCharges?.filter(item =>
    //             item.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
    //         )
    //         setFilterRequest(filtered);
    //     } else {
    //         setFilterRequest(serviceCharges);
    //     }
    // }, [searchQuery, serviceCharges])

    // GET: All Service Charge
    const fetchServiceCharge = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get`, {
                timeout: 10000
            })
            if (response.data.statusCode === 200) {
                setServiceCharges(response.data.data);
            } else {
                ToastFail('Lấy thông tin các hoá đơn thất bại');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to fetching service charge data", error);
            ToastFail("Lỗi lấy thông tin các hoá đơn");
        }
        finally {
            setIsLoading(false);
        }
    }

    // GET: Filter by Month
    const fetchServiceChargeByMonth = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get?month=${month}`, {
                timeout: 10000
            })
            if (response.data.statusCode === 200) {
                setServiceCharges(response.data.data);
            } else {
                ToastFail('Lấy thông tin các hoá đơn thất bại');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to fetching service charge data", error);
            ToastFail("Lỗi lấy thông tin các hoá đơn");
        }
        finally {
            setIsLoading(false);
        }
    }

    // GET: Filter by Year
    const fetchServiceChargeByYear = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get?year=${year}`, {
                timeout: 10000
            })
            if (response.data.statusCode === 200) {
                setServiceCharges(response.data.data);
            } else {
                ToastFail('Lấy thông tin các hoá đơn thất bại');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to fetching service charge data", error);
            ToastFail("Lỗi lấy thông tin các hoá đơn");
        }
        finally {
            setIsLoading(false);
        }
    }

    // GET: Filter by Month and Year
    const fetchServiceChargeByMonthAndYear = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get?month=${month}&year=${year}`, {
                timeout: 10000
            })
            if (response.data.statusCode === 200) {
                setServiceCharges(response.data.data);
            } else {
                ToastFail('Lấy thông tin các hoá đơn thất bại');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to fetching service charge data", error);
            ToastFail("Lỗi lấy thông tin các hoá đơn");
        }
        finally {
            setIsLoading(false);
        }
    }

    // UseEffect: GET
    useEffect(() => {
        fetchServiceCharge();
    }, [])

    // UseEffect: GET
    useEffect(() => {
        if (year !== "" && month !== "") {
            fetchServiceChargeByMonthAndYear();
        } else if (month !== "" && year === "") {
            fetchServiceChargeByMonth();
        } else if (year !== "" && month === "") {
            fetchServiceChargeByYear();
        }
    }, [month, year])

    const renderItem = ({ item }: { item: ServiceCharge }) => {
        const dateTime = `${item.month}/${item.year}`;
        const statusTitle = item.status == 6 ? "Chưa thanh toán" : "Đã thanh toán";
        const moneyBadge = `${moneyFormat(item.totalPrice)} VNĐ`;
        return (
            <TableRow>
                <Cell>{item.roomId}</Cell>
                <Cell><Badge colorScheme={item.status === 6 ? "danger" : "success"}>{statusTitle}</Badge></Cell>
                <Cell> <Badge colorScheme="warning" alignSelf="flex-start">{dateTime}</Badge></Cell>
                {/* gioi han description */}
                <Cell>{item.description}</Cell>
                <Cell> <Badge colorScheme="info" variant="solid" _text={{ fontSize: 14 }}>{moneyBadge}</Badge></Cell>
                <Cell>
                    <Button onPress={() => router.push(`/web/CMB/bills/${item.id}`)} text="Chi tiết" />
                </Cell>
            </TableRow>
        )
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1, width: '100%' }}>
                    <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Quản lý hoá đơn</Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Button text='Thêm hoá đơn' />
                        </View>
                    </View>
                    <View style={{ marginBottom: SIZES.medium }}>
                        <Input placeholder='Tìm kiếm số căn hộ' style={{ paddingVertical: 10 }} />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Select selectedValue={month} maxWidth={150} style={{ alignSelf: 'flex-start' }} accessibilityLabel="Tháng" placeholder="Tháng" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setMonth(itemValue)}>
                                {months.map((item) => (
                                    <Select.Item key={item} label={`Tháng ${item}`} value={`${item}`} />
                                ))}
                            </Select>
                            <Select selectedValue={year} maxWidth={100} accessibilityLabel="Năm" placeholder="Năm" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setYear(itemValue)}>
                                {years.map((item) => (
                                    <Select.Item key={item} label={`${item}`} value={`${item}`} />
                                ))}
                            </Select>
                        </View>
                    </View>
                    {isLoading ? <ActivityIndicator size="large" color={COLORS.primary} /> :
                        <TableComponent headers={headers}>
                            <FlatList
                                data={serviceCharges}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        </TableComponent>
                    }
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default BillDashboard