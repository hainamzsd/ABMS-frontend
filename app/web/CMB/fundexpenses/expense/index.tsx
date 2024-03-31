import { Link, Redirect, router, useNavigation } from "expo-router";
import { SafeAreaView, Text, View, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import Button from "../../../../../components/ui/button";
import { Cell, TableComponent, TableRow } from "../../../../../components/ui/table";
import Input from "../../../../../components/ui/input";
import styles from "../../accounts/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { paginate } from "../../../../../utils/pagination";
import { useAuth } from "../../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

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
export default function ExpenseManagement() {
    const headers = ['Nguồn chi', 'Số tiền', 'Ngày tạo', ''];
    const [expenseData, setExpenseData] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {session} = useAuth();
    const user:User = jwtDecode(session as string);
    useEffect(() => {
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

        fetchData();
    }, []);
    
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

    
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1 }}>
                <Link href={"/web/CMB/fundexpenses/fund/"}>
                        <Button text="Quản lý khoản thu" style={{ width: 200,marginBottom:20 }}></Button>
                    </Link>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách khoản chi của tòa nhà</Text>
                        <Text>Thông tin khoản chi của tòa nhà</Text>
                    </View>
                    <Link href={"/web/CMB/fundexpenses/expense/create"}>
                        <Button text="Tạo khoản chi" style={{ width: 200 }}></Button>
                    </Link>
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
                        {/* <TouchableOpacity style={styles.searchBtn} onPress={() => { }}>
                            <Image
                                source={icons.search}
                                resizeMode="contain"
                                style={styles.searchBtnIcon}
                            ></Image>
                        </TouchableOpacity> */}
                    </View>
                    {isLoading && <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>}
                    {!filteredRequests.length ? <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: '600' }}>Chưa có dữ liệu</Text> :
                        <TableComponent headers={headers}>
                            <FlatList data={currentItems}
                                renderItem={({ item }) => <TableRow>
                                    <Cell>{item.expenseSource}</Cell>
                                    <Cell>{item.expense1}</Cell>
                                    <Cell>{moment.utc(item.createTime).format("DD-MM-YYYY")}</Cell>
                                    <Cell>
                                            <Button onPress={()=>router.push(`/web/CMB/fundexpenses/expense/${item.id}`)} text="Chi tiết" />
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
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
