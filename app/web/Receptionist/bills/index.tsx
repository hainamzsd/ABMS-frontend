import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, ScrollView, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import Button from '../../../../components/ui/button'
import Input from '../../../../components/ui/input'
import { Badge, CheckIcon, Modal, Select, Text as TextBase, Button as ButtonBase, TextArea } from 'native-base'
import { ServiceCharge } from '../../../../interface/serviceType'
import axios from 'axios'
import { paginate } from '../../../../utils/pagination'
import { API_BASE, actionController } from '../../../../constants/action'
import { ToastFail, ToastSuccess } from '../../../../constants/toastMessage'
import { moneyFormat } from '../../../../utils/moneyFormat'
import { router } from 'expo-router'
import { Cell, TableComponent, TableRow } from '../../../../components/ui/table'
import { COLORS, SIZES } from '../../../../constants'
import { ActivityIndicator } from 'react-native-paper'
import { useAuth } from '../../context/AuthContext'
import { user } from '../../../../interface/accountType'
import { jwtDecode } from 'jwt-decode'
import { filterBill } from "../../../../constants/filter"
import Toast from 'react-native-toast-message'

const BillDashboard = () => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const years = [2023, 2024];
    const headers = ['Căn hộ', 'Trạng thái hoá đơn', 'Thời gian', 'Ghi chú', 'Tổng tiền', ''];
    const { session } = useAuth();
    const user: user = jwtDecode(session as string);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    // State
    const [isLoading, setIsLoading] = useState(false);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRequest, setFilterRequest] = useState<ServiceCharge[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [numberOfRooms, setNumberOfRooms] = useState(0);
    const [filterQuery, setFilterQuery] = useState("");

    // Paging
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const { currentItems, totalPages } = paginate(filterRequest, currentPage, itemsPerPage)
    useEffect(() => {
      
        const checkFee = async () => {
            try {
                const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/CheckUnassignedRoomServicesInBuilding/${user.BuildingId}`, {
                timeout: 10000
                })
                const feeTotal = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/report/building-report/${user.BuildingId}`, {
                    timeout: 10000
                })
                console.log(response)
                if (response.data.statusCode === 200 && feeTotal.data.statusCode === 200) {
                if(response.data.data){
                    Toast.show({
                        type: 'info',
                        position: 'top',
                        text1: 'Thông báo',
                        text2: 'Chưa phòng nào được gán dịch vụ, vui lòng gán trước.',
                        visibilityTime: 4000,
                        autoHide: true, 
                        topOffset: 30,
                        bottomOffset: 40,
                        onShow: () => {},
                        onHide: () => {}
                    
                    })
                    router.replace("/web/Receptionist/fees/")
                }
                if(feeTotal.data.data.totalFee==0){
                    ToastFail('Chưa có dữ liệu phí, vui lòng tạo phí trước');
                    router.replace("/web/Receptionist/fees/")
                }
                } else {
                ToastFail('Lấy thông tin phí thất bại');
                }
            } catch (error) {
                if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
                }
                console.log("Fail to fetching service charge data", error);
                ToastFail("Lỗi lấy thông tin phí");
            }
            finally {
                setIsLoading(false);
            }
        }
        checkFee()
      }, [])
      
    // Search
    useEffect(() => {
        if (searchQuery.trim() !== '') {
            const filtered = serviceCharges?.filter(item =>
                item.room_number.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilterRequest(filtered);
        } else {
            setFilterRequest(serviceCharges);
        }
    }, [searchQuery, serviceCharges])

    // Filter
    useEffect(() => {
        if (filterQuery !== "") {
            let filtered: ServiceCharge[] = [];
            switch (filterQuery) {
                case '1':
                    filtered = [...serviceCharges].sort((a, b) => a.total_price - b.total_price);
                    break; // Add break statement to prevent fall-through
                case '2':
                    filtered = [...serviceCharges].sort((a, b) => b.total_price - a.total_price);
                    break; // Add break statement to prevent fall-through
                case '3':
                    filtered = serviceCharges.slice().sort((a, b) => {
                        if (a.year === b.year) {
                            return a.month - b.month;
                        } else {
                            return a.year - b.year;
                        }
                    });
                    break;
                case '4':
                    filtered = serviceCharges.slice().sort((a, b) => {
                        if (a.year === b.year) {
                            return b.month - a.month;
                        } else {
                            return b.year - a.year;
                        }
                    })
            }
            setFilterRequest(filtered);
        } else {
            setFilterRequest(serviceCharges);
        }
    }, [filterQuery, serviceCharges])

    // GET: All Service Charge
    const fetchServiceCharge = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get?buildingId=${user.BuildingId}`, {
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

    // GET: Number of room available
    const fetchAllRoom = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?buildingId=${user.BuildingId}`, {
                timeout: 10000
            })
            if (response.data.statusCode === 200) {
                setNumberOfRooms(response.data.data.length);
            } else {
                ToastFail('Lấy số lượng căn hộ thất bại');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to fetching service charge data", error);
            ToastFail("Lỗi lấy số lượng căn hộ");
        }
        finally {
            setIsLoading(false);
        }
    }

    // GET: Filter by Month
    const fetchServiceChargeByMonth = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get?buildingId=${user.BuildingId}&month=${month}`, {
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
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get?buildingId=${user.BuildingId}&year=${year}`, {
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
            const response = await axios.get(`${API_BASE}/${actionController.SERVICE_CHARGE}/get?buildingId=${user.BuildingId}&month=${month}&year=${year}`, {
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
        fetchAllRoom();
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

    // Create bill for almost rooms
    const createServiceCharge = async () => {
        setIsLoading(true);
        const bodyData = {
            building_id: user.BuildingId,
            month: currentMonth,
            year: currentYear
        }
        try {
            const response = await axios.post(`${API_BASE}/${actionController.SERVICE_CHARGE}/create`, bodyData, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            })
            if(response.data.count==0){
                Toast.show({
                    type:"info",
                    text1:"Không có hóa đơn nào được tạo",
                    position:'bottom',
                });
                return;
            }
            if (response.data.statusCode === 200) {
                ToastSuccess("Tạo hoá đơn cho các căn hộ thành công");
                fetchServiceCharge();
                const createPost = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/notification/create-for-resident',{
                    title: "Bạn có hóa đơn mới cần thanh toán, vui lòng kiểm tra tại mục hóa đơn.",
                    content: "Bill",
                    buildingId: user.BuildingId,
                    roomId: "Bill",
                    serviceId: "Bill"
                },  
                {
                    timeout: 10000, 
                    headers:{
                        'Authorization': `Bearer ${session}`
                    }
                  },)
            } 
            else {
                ToastFail('Tạo hoá đơn cho các căn hộ không thành công');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            }
            console.log("Fail to fetching service charge data", error);
            ToastFail("Lỗi lấy tạo hoá đơn");
        }
        finally {
            setIsLoading(false);
        }
    }

    // Cancel filter
    const handleCancelFilter = () => {
        setMonth("");
        setYear("");
        setFilterQuery("");
        fetchServiceCharge();
    }

    const renderItem = ({ item }: { item: ServiceCharge }) => {
        const dateTime = `${item.month}/${item.year}`;
        const statusTitle = item.status == 6 ? "Chưa thanh toán" : "Đã thanh toán";
        const moneyBadge = `${moneyFormat(item.total_price)} VNĐ`;
        return (
            <TableRow>
                <Cell>{item?.room_number ? <Badge variant="outline">{item.room_number}</Badge> : <Badge variant="outline" colorScheme="warning">Căn hộ mới</Badge>}</Cell>
                <Cell><Badge colorScheme={item.status === 6 ? "danger" : "success"}>{statusTitle}</Badge></Cell>
                <Cell> <Badge colorScheme="warning" alignSelf="flex-start">{dateTime}</Badge></Cell>
                {/* gioi han description */}
                <Cell>{item?.description}</Cell>
                <Cell> <Badge colorScheme="info" variant="solid" _text={{ fontSize: 14 }}>{moneyBadge}</Badge></Cell>
                <Cell>
                    <Button onPress={() => router.push({
                        pathname: `/web/Receptionist/bills/detail`, params: {
                            id: item.id,
                            roomId: item.room_id,
                            roomNumber: item.room_number,
                        }
                    })} text="Chi tiết" />
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
                            <Button text='Thêm hoá đơn' onPress={() => setIsOpenModal(true)} />
                        </View>
                    </View>
                    <View style={{ marginBottom: SIZES.medium }}>
                        <Input placeholder='Tìm kiếm số căn hộ' style={{ paddingVertical: 10 }} value={searchQuery} onChangeText={(text) => setSearchQuery(text)} />
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
                            <Select selectedValue={filterQuery} maxWidth={200} accessibilityLabel="Lọc" placeholder="Lọc" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} onValueChange={itemValue => setFilterQuery(itemValue)}>
                                {filterBill.map((item) => (
                                    <Select.Item key={item.value} label={item.name} value={item.value} />
                                ))}
                            </Select>
                            {(month !== "" || year !== "" || filterQuery !== "") && <ButtonBase onPress={handleCancelFilter} style={{ marginTop: 4 }} height="35">Huỷ lọc</ButtonBase>}
                        </View>
                    </View>
                    {isLoading ? <ActivityIndicator size="large" color={COLORS.primary} /> :
                        filterRequest.length > 0 ?
                            <TableComponent headers={headers}>
                                <FlatList
                                    data={currentItems}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                />
                            </TableComponent>
                            : <View><Text style={{ fontSize: SIZES.medium, color: COLORS.gray, fontStyle: 'italic', textAlign: 'center' }}>Hiện chưa có hoá đơn nào.</Text></View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
                        <Button text="Trước"
                            style={{ width: 50 }}
                            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        <Text style={{ marginHorizontal: 10, fontWeight: "600" }}>
                            Page {currentPage} of {totalPages}
                        </Text>
                        <Button text="Sau" onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />

                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* CREATE BILL */}
            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Tạo hoá đơn</Modal.Header>
                    <Modal.Body>
                        <TextBase fontSize="lg">
                            Bạn có chắc chắn tạo hoá đơn cho <TextBase bold>{numberOfRooms}</TextBase> căn hộ không?
                        </TextBase>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonBase.Group space={2}>
                            <ButtonBase variant="ghost" colorScheme="blueGray" onPress={() => {
                                setIsOpenModal(false);
                            }}>
                                Huỷ bỏ
                            </ButtonBase>
                            <ButtonBase onPress={() => {
                                createServiceCharge();
                                setIsOpenModal(false);
                            }}>
                                Xác nhận
                            </ButtonBase>
                        </ButtonBase.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </View >
    )
}

export default BillDashboard