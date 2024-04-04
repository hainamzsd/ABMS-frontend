import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, ScrollView, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import Button from '../../../../components/ui/button'
import Input from '../../../../components/ui/input'
import { CheckIcon, Select } from 'native-base'
import { ServiceCharge } from '../../../../interface/serviceType'
import axios from 'axios'
import { API_BASE, actionController } from '../../../../constants/action'
import { ToastFail } from '../../../../constants/toastMessage'
import styles from './styles'
import { moneyFormat } from '../../../../utils/moneyFormat'
import { router } from 'expo-router'

const BillDashboard = () => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const years = [2023, 2024];

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);

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

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    router.push({
                        pathname: `/web/Receptionist/bills/${item?.id}`,
                    })
                }}
            >
                <Text style={styles.roomMaster} numberOfLines={1}>
                    E1011
                </Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.total} numberOfLines={1}>
                        {moneyFormat(item?.totalPrice)} VNĐ
                    </Text>
                    <Text style={styles.date} numberOfLines={1}>
                        {item?.month}/{item?.year}
                    </Text>
                </View>
            </TouchableOpacity>
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
                    <View>
                        <Input placeholder='Tìm kiếm số căn hộ' style={{ paddingVertical: 10 }} />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Select selectedValue={month} maxWidth={150} style={{ alignSelf: 'flex-start' }} accessibilityLabel="Tháng" placeholder="Tháng" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setMonth(itemValue)}>
                                {months.map((item) => (
                                    <Select.Item label={`Tháng ${item}`} value={`${item}`} />
                                ))}
                            </Select>
                            <Select selectedValue={year} maxWidth={100} accessibilityLabel="Năm" placeholder="Năm" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setYear(itemValue)}>
                                {years.map((item) => (
                                    <Select.Item label={`${item}`} value={`${item}`} />
                                ))}
                            </Select>
                        </View>
                    </View>
                    <FlatList
                        data={serviceCharges}
                        renderItem={renderItem}
                        keyExtractor={(item) => item?.id}
                        numColumns={5}
                        columnWrapperStyle={{ gap: 30 }}
                    />

                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default BillDashboard