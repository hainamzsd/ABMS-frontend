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
import { AlertDialog, CheckIcon, FormControl, Input, Modal, Select } from 'native-base'
import * as Yup from "yup"
interface User {
    id: string;
    BuildingId: string;
}
interface Hotline {
    id: string;
    buildingId: string;
    phoneNumber: string;
    name: string;
    status: number;
}


const validationSchema = Yup.object().shape({
    phone:  Yup.string().required('Số điện thoại không được trống').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
      name: Yup.string()
  });
const index = () => {
    const headers = ['Tên', 'Số điện thoại', 'Trạng thái', ''];
    const [request, setRequest] = useState<Hotline[]>([]);
    const { session } = useAuth();
    const User: User = jwtDecode(session as string);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7;
    const [showModal, setShowModal] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Hotline>();
    const [selectedValue, setSelectedValue] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let url = `https://abmscapstone2024.azurewebsites.net/api/v1/hotline/get-all?buildingId=${User.BuildingId}`;
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
    const [phoneCreate, setPhoneCreate]= useState("");
    const handleCreate = async () => {
        setValidationErrors({});
        try {
            await validationSchema.validate({ phone: phoneCreate, name: nameCreate }, { abortEarly: false });
            const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/hotline/create`, {
                phoneNumber: phoneCreate,
                name: selectedValue!=="Other"? selectedValue : nameCreate,
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
                setNameCreate("");
                setPhoneCreate("");
                setShowModalCreate(false);
                setValidationErrors({});
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Tạo  đường dây nóng không thành công',
                    position: 'bottom',
                })
            }
        } catch (error:any) {
            if (error.name === 'ValidationError') {
                const errors:any = {};
                error.inner.forEach((err: any) => {
                  errors[err.path] = err.message;
                });
                setValidationErrors(errors);
              }
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
    const [phoneUpdate, setPhoneUpdate]= useState("");
    const handleUpdate = async () => {
        setValidationErrors({});
        try {
            await validationSchema.validate({ phone: phoneUpdate, name: nameUpdate }, { abortEarly: false });
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/hotline/update/${selectedItem?.id}`, {
                name: nameUpdate,
                phoneNumber: phoneUpdate,
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
                    text1: 'Cập nhật đường dây nóng không thành công',
                    position: 'bottom',
                    
                })
            }
        } catch (error:any) {
            if (error.name === 'ValidationError') {
                const errors:any = {};
                error.inner.forEach((err: any) => {
                  errors[err.path] = err.message;
                });
                setValidationErrors(errors);
              }
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
            const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/hotline/delete/${selectedItem?.id}`, 
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
                    text1: 'Xóa  đường dây nóng không thành công',
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
    const [filteredRequests, setFilteredRequests] = useState<Hotline[]>([]);
    useEffect(() => {
        if (searchQuery.trim() !== '') {
            const filtered = request.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())||
                item.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <Modal.Header>Sửa loại đường dây nóng</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>Tên</FormControl.Label>
                            <Input value={nameUpdate} onChangeText={setNameUpdate} isRequired/>
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Số điện thoại</FormControl.Label>
                            <Input value={phoneUpdate} onChangeText={setPhoneUpdate} isRequired/>
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
                    <Modal.CloseButton onPress={() => setShowModalCreate(false)} />
                    <Modal.Header>Tạo mới loại đường dây nóng</Modal.Header>
                    <Modal.Body>
                        <Select
                            selectedValue={selectedValue}
                            minWidth="200"
                            accessibilityLabel="Choose Service"
                            placeholder="Choose Service"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="2" color={'#191919'}/>,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                        >
                            <Select.Item label="Bộ phận CSKH" value="Bộ phận CSKH" />
                            <Select.Item label="Bảo vệ" value="Bảo vệ" />
                            <Select.Item label="Khác" value="Other" />
                        </Select>
                        {selectedValue === 'Other' && (
                            <FormControl>
                            <FormControl.Label>Tên</FormControl.Label>
                            <Input value={nameCreate}
                                onChangeText={setNameCreate}
                                isRequired />
                                {validationErrors.name  && (
                            <Text style={styles.errorText}>{validationErrors.name}</Text>
                        )}
                        </FormControl>
                        )}
                        <FormControl>
                            <FormControl.Label>Số điện thoại</FormControl.Label>
                            <Input value={phoneCreate}
                                onChangeText={setPhoneCreate}
                                isRequired />
                                 {validationErrors.phone  && (
                            <Text style={styles.errorText}>{validationErrors.phone}</Text>
                        )}
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
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách đường dây nóng</Text>
                        <Text>Thông tin hotline trong bảng</Text>
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
                            placeholder="Tìm theo tên hoặc số điện thoại"
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
                                            <Cell>{item.phoneNumber}</Cell>
                                            <Cell>{statusForReceptionist[item?.status as number].status}</Cell>
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
                                keyExtractor={(item: Hotline) => item.id}
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




export default index
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