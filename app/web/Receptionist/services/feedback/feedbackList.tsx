import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, FlatList, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, useNavigation } from 'expo-router'
import Button from '../../../../../components/ui/button'
import { Cell, TableComponent, TableRow } from '../../../../../components/ui/table'
import { COLORS, SIZES } from '../../../../../constants'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import moment from 'moment'
import { paginate } from '../../../../../utils/pagination'
import { statusForReceptionist, statusUtility } from '../../../../../constants/status'
import { Dropdown } from 'react-native-element-dropdown'
import { checkForOverlaps, checkOverlaps } from '../../../../../utils/checkOverlap'
import { AlertCircle } from 'lucide-react-native'
import { useAuth } from '../../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { AlertDialog, FormControl, Input, Modal } from 'native-base'


interface User {
    id: string;
    BuildingId: string;
}
interface FeedbackType {
    id: string;
    name: string;
    createUser: string;
    createTime: Date,
    modifyUser: string;
    modifyTime: Date,
    status: number,
    buildingId: string;
}
const feedbackList = () => {
    const headers = ['Loại phản ánh', 'Ngày tạo', 'Người tạo', ''];
    const [request, setRequest] = useState<FeedbackType[]>([]);
    const { session } = useAuth();
    const User: User = jwtDecode(session as string);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7;
    const [showModal, setShowModal] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [selectedItem, setSelectedItem] = useState<FeedbackType>();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let url = `https://abmscapstone2024.azurewebsites.net/api/v1/service-type/get-all?buildingId=${User.BuildingId}`;
            const response = await axios.get(url, { timeout: 100000 });
            if (response.data.statusCode === 200) {
                setRequest(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! Vui lòng thử lại sau',
                    position: 'bottom',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống! Vui lòng thử lại sau',
                position: 'bottom',
            });
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
       
        fetchData()
    }, [session])

    const [nameCreate, setNameCreate]= useState("");
    const handleCreate = async () => {
        try {
            const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/service-type/create`, {
                name: nameCreate,
                buildingId: User.BuildingId
            }, { timeout: 10000,
            headers:{
                'Authorization': `Bearer ${session}`
            } })
            console.log(response);
            if (response.data.statusCode === 200) {
                setRequest([...request, response.data.data])
                Toast.show({
                    type: 'success',
                    text1: 'Tạo mới thành công',
                    position: 'bottom',
                })
                setShowModalCreate(false);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Tạo phiếu phản ánh không thành công',
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
    const [nameUpdate, setNameUpdate]= useState("");
    const handleUpdate = async () => {
        try {
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/service-type/update/${selectedItem?.id}`, {
                name: nameUpdate,
                buildingId: User.BuildingId
            }, { timeout: 10000,
            headers:{
                'Authorization': `Bearer ${session}`
            } })
            console.log(response)
            if (response.data.statusCode === 200) {
                fetchData();
                Toast.show({
                    type: 'success',
                    text1: 'Cập nhật thành công',
                    position: 'bottom',
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Cập nhật phiếu phản ánh không thành công',
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
            setSelectedItem(undefined);
            setShowModal(false);

        }
    }

    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => setIsOpen(false);
  
    const cancelRef = React.useRef(null);
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/service-type/delete/${selectedItem?.id}`, 
             { timeout: 10000,
            headers:{
                'Authorization': `Bearer ${session}`
            } })
            console.log(response)
            if (response.data.statusCode === 200) {
                fetchData();
                Toast.show({
                    type: 'success',
                    text1: 'Xóa thành công',
                    position: 'bottom',
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Xóa phiếu phản ánh không thành công',
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
            setSelectedItem(undefined);
            setIsOpen(false);

        }
    }
    //search box
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRequests, setFilteredRequests] = useState<FeedbackType[]>([]);
    useEffect(() => {
        if (searchQuery.trim() !== '') {
            const filtered = request.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRequests(filtered);
        } else {
            setFilteredRequests(request);
        }
    }, [searchQuery, request]);
    //paging
    const navigate = useNavigation();
    const { currentItems, totalPages } = paginate(filteredRequests, currentPage, itemsPerPage);

    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton onPress={() => setShowModal(false)} />
                    <Modal.Header>Sửa loại phản ánh</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>Tên</FormControl.Label>
                            <Input value={nameUpdate} onChangeText={setNameUpdate} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button text='Lưu'
                            onPress={handleUpdate}>
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModalCreate} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton onPress={() => setShowModalCreate(false)}/>
                    <Modal.Header>Tạo mới loại phản ánh</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>Tên</FormControl.Label>
                            <Input value={nameCreate}
                            onChangeText={setNameCreate}
                            isRequired/>
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button text='Tạo'
                            onPress={handleCreate}>
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1 }}>
                    <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Quay Lại"
                        onPress={() => navigate.goBack()}
                    ></Button>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách phiếu phản ánh</Text>
                        <Text>Thông tin những phiếu trong bảng</Text>
                    </View>
                    <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Tạo mới"
                        onPress={() => setShowModalCreate(true)}
                    ></Button>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholderTextColor={'black'}
                            placeholder="Tìm theo tên loại"
                            value={searchQuery}
                            onChangeText={(text) => setSearchQuery(text)}
                        />
                    </View>
                  
                    {isLoading && <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>}
                    {!filteredRequests.length ? (
                        <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: '600' }}>Chưa có dữ liệu</Text>
                    ) : (
                        <TableComponent headers={headers}>
                            <FlatList
                                data={currentItems}
                                renderItem={({ item }) => {

                                    return (
                                        <TableRow >
                                            <Cell>{item.name}</Cell>
                                            <Cell>{moment.utc(item.createTime).format("DD-MM-YYYY")}</Cell>
                                            <Cell>{item.createUser}</Cell>
                                            <Cell>
                                                <Button
                                                    text="Sửa"
                                                    style={{ marginRight: 5 }}
                                                    onPress={() => {
                                                        setSelectedItem(item);
                                                        setShowModal(true)}}
                                                />
                                                <Button
                                                    text="Xóa"
                                                    color='#9b2c2c'
                                                    onPress={() => {
                                                        setSelectedItem(item);
                                                        setIsOpen(true)}}
                                                />
                                            </Cell>
                                        </TableRow>
                                    );
                                }}
                                keyExtractor={(item: FeedbackType) => item.id}
                            />
                        </TableComponent>
                    )}
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
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Xóa loại tiện ích</AlertDialog.Header>
                        <AlertDialog.Body>
                            Hành động này sẽ xóa tiện ích đã chọn. Bạn có xác nhận xóa không?
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                                <Button text='Hủy' style={{marginRight:5}} onPress={onClose}>
                                </Button>
                                <Button text='Xóa' color='#9b2c2c'  onPress={handleDelete}>
                                </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </SafeAreaView>
        </View>
    )
}




export default feedbackList
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