import { Link, Redirect, router, useNavigation } from "expo-router";
import { SafeAreaView, Text, View, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator, Platform } from "react-native";
import Button from "../../../../../components/ui/button";
import { Cell, TableComponent, TableRow } from "../../../../../components/ui/table";
import styles from "../../accounts/styles";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { paginate } from "../../../../../utils/pagination";
import { useAuth } from "../../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { AlertDialog, FormControl, HStack, Input, Modal } from "native-base";
import * as Yup from "yup"
import { formatVND, moneyFormat } from "../../../../../utils/moneyFormat";
import { Download } from "lucide-react-native";
import * as FileSystem from 'expo-file-system';
interface Expense {
    id: string;
    buildingId: string;
    expense1: number;
    expenseSource: string;
    description: string;
    createUser: string;
    createTime: Date;
    modifyUser: string;
    modifyTime: string;
    status: number;
}
interface User{
    id: string;
    BuildingId:string;
  }

  const validationSchema = Yup.object().shape({
    expenseSource:  Yup.string().required('Nguồn thu không được để trống'),
    description:Yup.string(),
    money: Yup.number().required('Số tiền không được để trống'),
      
  });
export default function ExpenseManagement() {
    const headers = ['Nguồn chi', 'Số tiền', 'Ngày tạo', ''];
    const [expenseData, setExpenseData] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {session} = useAuth();
    const user:User = jwtDecode(session as string);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [selectedItem, setSelectedItem] = useState<Expense>();
    const fetchData = async () => {
        setIsLoading(true); // Set loading state to true
        setError(null); // Clear any previous errors
        if(!user.BuildingId) {
            Toast.show({type:'danger',position:"top",text1:"Lỗi hệ thống",text2:"Không tìm thấy thông tin tòa nhà"})
           return;
           }
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/expense/get-all?building_Id=${user.BuildingId}`, {
                timeout:100000
            });
            setExpenseData(response.data.data); // Set expense data
        } catch (error) {
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            console.error('Error fetching expense data:', error);
            setError('Failed to fetch expense data.'); // Set error message
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    };
    useEffect(() => {
      

        fetchData();
    }, []);
    const handleDownload = async () => {
        try {
          const apiUrl = `https://abmscapstone2024.azurewebsites.net/api/v1/expense/export-data/${user.BuildingId}`;
          if (Platform.OS === 'web') {
            window.open(apiUrl, '_self');
          } else {
            const fileInfo = await FileSystem.downloadAsync(
              apiUrl,
              FileSystem.documentDirectory + 'accounts.xlsx',
              {
                headers: {
                },
              }
            );}
        } catch (error) {
          console.error('Failed to download the file:', error);
        }
  };

    //search box
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRequests, setFilteredRequests] = useState<Expense[]>([]);
    useEffect(() => {
        if (searchQuery.trim() !== '') {
            const filtered = expenseData.filter(item =>
                item.expenseSource.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRequests(filtered);
        } else {
            setFilteredRequests(expenseData);
        }
    }, [searchQuery, expenseData]);
    //paging
    const itemsPerPage = 5;
    const navigate = useNavigation();
    const [currentPage, setCurrentPage] = useState(1)
    const { currentItems, totalPages } = paginate(filteredRequests, currentPage, itemsPerPage);

    const [showModalCreate, setShowModalCreate] = useState(false);
    const [expenseSourceCreate, setExpenseSourceCreate] = useState("");
    const [descriptionCreate, setDescriptionCreate] = useState("");
    const [moneyCreate, setMoneyCreate] = useState(0);
    const [displayMoneyCreate, setDisplayMoneyCreate] = useState('');
    const handleTextChangeMoneyCreate = (text:any) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setMoneyCreate(Number(numericValue));
        setDisplayMoneyCreate(formatVND(numericValue));
    };
    const handleCreate = async () => {
        setValidationErrors({});
        try {
            await validationSchema.validate({ expenseSource:expenseSourceCreate,
                description: descriptionCreate, money: moneyCreate
            }, { abortEarly: false });
            const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/expense/create`, {
                building_Id: user?.BuildingId,
                money: moneyCreate,
                expenseSource: expenseSourceCreate,
                description: descriptionCreate
            }, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
            } })
            console.log(response);
            if (response.data.statusCode === 200) {
               fetchData();
                Toast.show({
                    type: 'success',
                    text1: 'Tạo mới thành công',
                    position: 'bottom',
                })
                setExpenseSourceCreate("");
                setDescriptionCreate("");
                setMoneyCreate(0);
                setShowModalCreate(false);
                setValidationErrors({});
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Tạo nguồn chi không thành công',
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
            setIsLoading(false);
            setShowModalCreate(false);
        }
    }
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [expenseSourceUpdate, setExpenseSourceUpdate] = useState("");
    const [descriptionUpdate, setDescriptionUpdate] = useState("");
    const [moneyUpdate, setMoneyUpdate] = useState(0);
    const [displayMoneyUpdate, setDisplayMoneyUpdate] = useState('');
    const handleTextChange = (text:any) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setMoneyUpdate(Number(numericValue));
        setDisplayMoneyUpdate(formatVND(numericValue));
    };

    const handleUpdate = async () => {
        setValidationErrors({});
        try {
            await validationSchema.validate({ expenseSource:expenseSourceUpdate,
                description: descriptionUpdate, money: moneyUpdate
            }, { abortEarly: false });
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/expense/update/${selectedItem?.id}`, {
                building_Id: user?.BuildingId,
                money: moneyUpdate,
                expenseSource: expenseSourceUpdate,
                description: descriptionUpdate
            }, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
            } })
            console.log(response);
            if (response.data.statusCode === 200) {
               fetchData();
                Toast.show({
                    type: 'success',
                    text1: 'Cập nhật thành công',
                    position: 'bottom',
                })
                setExpenseSourceCreate("");
                setDescriptionCreate("");
                setMoneyCreate(0);
                setShowModalCreate(false);
                setValidationErrors({});
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Cập nhật không thành công',
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
            setShowModalUpdate(false);
            setSelectedItem(undefined);
        }
    }
    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => setIsOpen(false);
  
    const cancelRef = React.useRef(null);
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/expense/delete/${selectedItem?.id}`, 
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
                    text1: 'Xóa đường dây nóng không thành công',
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
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
              <Modal isOpen={showModalCreate} onClose={() => setShowModalCreate(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton onPress={() => setShowModalCreate(false)} />
                    <Modal.Header>Tạo nguồn chi mới</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>Nguồn chi</FormControl.Label>
                            <Input value={expenseSourceCreate}
                                onChangeText={setExpenseSourceCreate}
                                isRequired
                                />
                                 {validationErrors.expenseSource  && (
                            <Text style={styles.errorText}>{validationErrors.expenseSource}</Text>
                        )}
                        </FormControl>
                        <FormControl>
            <FormControl.Label>Số tiền</FormControl.Label>
            <Input 
                isRequired
                value={displayMoneyCreate}
                onChangeText={handleTextChangeMoneyCreate}
                keyboardType="numeric"
            />
            {validationErrors.fundSource && (
                <Text style={styles.errorText}>{validationErrors.fundSource}</Text>
            )}
        </FormControl>
                        <FormControl>
                            <FormControl.Label>Mô tả</FormControl.Label>
                            <Input value={descriptionCreate}
                                onChangeText={setDescriptionCreate}
                                />
                                 {validationErrors.expenseSource  && (
                            <Text style={styles.errorText}>{validationErrors.expenseSource}</Text>
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
            <Modal isOpen={showModalUpdate} onClose={() => setShowModalUpdate(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton onPress={() => setShowModalUpdate(false)} />
                    <Modal.Header>Cập nhật nguồn chi</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>Nguồn chi</FormControl.Label>
                            <Input value={expenseSourceUpdate}
                                onChangeText={setExpenseSourceUpdate}
                                isRequired
                                />
                                 {validationErrors.expenseSource  && (
                            <Text style={styles.errorText}>{validationErrors.expenseSource}</Text>
                        )}
                        </FormControl>
                        <FormControl>
            <FormControl.Label>Số tiền</FormControl.Label>
            <Input 
                isRequired
                value={displayMoneyUpdate}
                onChangeText={handleTextChange}
                keyboardType="numeric"
            />
            {validationErrors.fundSource && (
                <Text style={styles.errorText}>{validationErrors.fundSource}</Text>
            )}
        </FormControl>
                        <FormControl>
                            <FormControl.Label>Mô tả</FormControl.Label>
                            <Input value={descriptionUpdate}
                                onChangeText={setDescriptionUpdate}
                                />
                                 {validationErrors.expenseSource  && (
                            <Text style={styles.errorText}>{validationErrors.expenseSource}</Text>
                        )}
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button text='Cập nhật'
                            onPress={handleUpdate}>
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1 }}>
                <Link href={"/web/CMB/fundexpenses/fund"}>
                        <Button text="Quản lý khoản thu" style={{ width: 200,marginBottom:20 }}></Button>
                    </Link>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách khoản chi của tòa nhà</Text>
                        <Text>Thông tin khoản chi của tòa nhà</Text>
                    </View>
                        <Button text="Tạo khoản chi" style={{ width: 200 }}
                         onPress={() => setShowModalCreate(true)}></Button>
                   
                    <View style={styles.searchContainer}>
                        <View style={styles.searchWrapper}>
                            <TextInput
                                style={styles.searchInput}
                                placeholderTextColor={'black'}
                                placeholder="Tìm theo theo tên nguồn chi"
                                value={searchQuery}
                                onChangeText={(text) => setSearchQuery(text)}
                            />
                        </View>
                        <TouchableOpacity onPress={handleDownload}>
                            <HStack space={2} alignItems={'center'}
                                backgroundColor={'#191919'} borderRadius={10}
                                padding={2}>
                                <Download color="white" />
                                <Text style={{ color: 'white' }}>Xuất dữ liệu</Text>
                            </HStack>
                        </TouchableOpacity>
                    </View>
                    {isLoading && <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>}
                    {!filteredRequests.length ? <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: '600' }}>Chưa có dữ liệu</Text> :
                        <TableComponent headers={headers}>
                            <FlatList data={currentItems}
                                renderItem={({ item }) => <TableRow>
                                    <Cell>{item.expenseSource}</Cell>
                                    <Cell>{formatVND(item.expense1)}</Cell>
                                    <Cell>{moment.utc(item.createTime).format("DD-MM-YYYY")}</Cell>
                                    <Cell>
                                                <Button
                                                    text="Sửa"
                                                    style={{ marginRight: 5 }}
                                                    onPress={() => {
                                                        setSelectedItem(item);
                                                        setShowModalUpdate(true)
                                                        setExpenseSourceUpdate(item.expenseSource)
                                                        setDescriptionUpdate(item.description)
                                                        setMoneyUpdate(item.expense1)
                                                        setDisplayMoneyUpdate(moneyFormat(item.expense1))
                                                    }
                                                    }
                                                        
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
                                }
                                keyExtractor={(item: Expense) => item.id}
                            />

                        </TableComponent>}
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
                        <Button text="Trước"
                            style={{ width: 50 }}
                            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                        <Text style={{ marginHorizontal: 10, fontWeight: "600" }}>
                            Page {currentPage} of {totalPages}
                        </Text>
                        <Button text="Sau" onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />

                    </View>
                    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Xóa loại nguồn chi</AlertDialog.Header>
                        <AlertDialog.Body>
                            Hành động này sẽ xóa nguồn chi đã chọn. Bạn có xác nhận xóa không?
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                                <Button text='Hủy' style={{marginRight:5}} onPress={onClose}>
                                </Button>
                                <Button text='Xóa' color='#9b2c2c'  onPress={handleDelete}>
                                </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
