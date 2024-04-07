import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, FlatList, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, useLocalSearchParams, useNavigation } from 'expo-router'
import Button from '../../../../../components/ui/button'
import { Cell, TableComponent, TableRow } from '../../../../../components/ui/table'
import { SIZES, COLORS } from '../../../../../constants'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import moment from 'moment'
import { paginate } from '../../../../../utils/pagination'
import { statusForReceptionist, statusUtility } from '../../../../../constants/status'
import { Dropdown } from 'react-native-element-dropdown'
import { Reservation, Utility } from '../../../../../interface/utilityType';
import SearchWithButton from '../../../../../components/ui/searchWithButton'
import { useAuth } from '../../../context/AuthContext'

const StatusData = [
    { label: "Phiếu đã được kiểm duyệt", value: 3 },
    { label: "Phiếu phiếu chưa được kiểm duyệt", value: 4 },
    { label: "Phiếu đang chờ được kiểm duyệt", value: 2 }
]

const ReservationUtility = () => {
    const item = useLocalSearchParams();
    const headers = ['Căn hộ', 'Tên sân', 'Khung giờ', 'Ngày đặt', 'Tổng tiền', 'Trạng thái', ''];
    //   STATE
    const [isLoading, setIsLoading] = useState(false);
    const [utilityReservation, setUtilityReservation] = useState<Reservation[]>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [status, setStatus] = useState<number | null>(2);
    const navigate = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRequests, setFilteredRequests] = useState<Reservation[]>([]);
    const { currentItems, totalPages } = paginate(filteredRequests, currentPage, 5);
    useEffect(() => {
      if (searchQuery.trim() !== '') {
        const filtered = utilityReservation.filter(item =>
          item.room_number.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRequests(filtered);
      } else {
        setFilteredRequests(utilityReservation);
      }
    }, [searchQuery, utilityReservation]);
    useEffect(() => {
        fetchData();
    }, [status])



    const fetchData = async () => {
        setIsLoading(true);
        try {
            let url = `https://abmscapstone2024.azurewebsites.net/api/v1/reservation/get?utilityDetailId=${item?.id}`;
            if (status !== null) {
                url += `&status=${status}`
            }
            const response = await axios.get(url, { timeout: 10000 })
            if (response.data.statusCode  === 200) {
                setUtilityReservation(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi lấy thông tin quản lý tiện ích',
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
            console.error('Error fetching utility management data:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin quản lý tiện ích',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1 }}>
                    <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Quay Lại"
                        onPress={() => navigate.goBack()}
                    ></Button>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách phiếu đặt chỗ tiện ích trong căn hộ</Text>
                        <Text>Thông tin những phiếu đặt chỗ trong bảng</Text>
                    </View>
                    <SearchWithButton placeholder="Tìm theo tên căn hộ" />
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


                    {isLoading && <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>}
                    {utilityReservation != null ?
                        <TableComponent headers={headers}>
                            <FlatList data={currentItems}
                                renderItem={({ item }: { item: Reservation }) => {
                                    return (
                                        <TableRow>
                                            <Cell>{item?.room_number}</Cell>
                                            <Cell>{item?.utility_detail_name}</Cell>
                                            <Cell>{item?.slot}</Cell>
                                            <Cell>{item?.booking_date}</Cell>
                                            <Cell>{item?.total_price}</Cell>
                                            <Cell>
                                                {item.status &&
                                                    <Button text={statusForReceptionist?.[item.status as number].status}
                                                        style={{ borderRadius: 20, backgroundColor: statusForReceptionist?.[item.status as number].color }}
                                                    > </Button>}

                                            </Cell>
                                            <Cell>
                                                <Button text="Chi tiết"
                                                    onPress={() => router.push({
                                                        pathname: `./reservation/${item?.id}`
                                                    })} />
                                            </Cell>
                                        </TableRow>
                                    )
                                }}
                                keyExtractor={(item: Reservation) => item?.id}
                            />

                        </TableComponent> : <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: '600' }}>Chưa có dữ liệu</Text>}
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
                        <Button text="Trước"
                            style={{ width: 50 }}
                            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        <Text style={{ marginHorizontal: 10, fontWeight: "600" }}>
                            Trang {currentPage} trên {totalPages}
                        </Text>
                        <Button text="Sau" onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default ReservationUtility;
const styles = StyleSheet.create({
    input: {
        width: '100%'
    },
    invalid: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
    overlap: {
        backgroundColor: '#ffcccc'
    },
    searchContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginVertical: SIZES.medium,
        height: 50,
    },
    searchWrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginRight: SIZES.small,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    searchInput: {
        width: "100%",
        height: "100%",
        paddingHorizontal: SIZES.medium,
        borderWidth: 1,
        borderRadius: 10,
        color: COLORS.gray2,
        borderColor: '#9c9c9c'
    },
    searchBtn: {
        width: 50,
        height: "100%",
        backgroundColor: COLORS.tertiary,
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
    },
    searchBtnIcon: {
        width: "50%",
        height: "50%",
        tintColor: COLORS.white,
    },
    comboBox: {
        backgroundColor: 'white',
        width: 300,
        marginBottom: 10,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        marginTop: 5
    },
});