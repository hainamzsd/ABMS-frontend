import { Link, Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView, Text, View, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import Button from "../../../components/ui/button";
import { Cell, TableComponent, TableRow } from "../../../components/ui/table";
import Input from "../../../components/ui/input";
import styles from "./styles";
import { useEffect, useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useSession } from "../../(mobile)/context/AuthContext";
import { paginate } from "../../../utils/pagination";
import { Building } from "../../../interface/roomType";
import { SIZES } from "../../../constants";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { accountStatus } from "../../../constants/status";

interface Account {
    id: string;
    buildingId?: string | null; // Optional field to allow null values
    phoneNumber: string;
    passwordSalt: string;
    passwordHash: string;
    userName: string;
    email: string;
    fullName: string;
    role: number;
    avatar: string | null; // Optional field to allow null values
    createUser: string;
    createTime: string; // Date string should be consistent with backend format
    modifyUser: string | null; // Optional field to allow null values
    modifyTime: string | null; // Optional field to allow null values
    status: number;
}
interface User{
    id: string;
    BuildingId:string;
  }
export default function AccountManagement() {
    const headers = ['Họ và tên', 'Số điện thoại', 'Email','Trạng thái', ''];
    const [accountData, setAccountData] = useState<Account[]>([]);
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
                const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/account/get?role=1`, {
                    timeout:100000
                });
                setAccountData(response.data.data); // Set account data
            } catch (error) {
                if (axios.isCancel(error)) {
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                        position: 'bottom'
                    })
                }
                console.error('Error fetching account data:', error);
                setError('Failed to fetch account data.'); // Set error message
            } finally {
                setIsLoading(false); // Set loading state to false regardless of success or failure
            }
        };

        fetchData();
    }, []);
    
        //search box
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequests, setFilteredRequests] = useState<Account[]>([]);
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = accountData.filter(item =>
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phoneNumber.includes(searchQuery) // Assuming phone numbers are stored as strings
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(accountData);
    }
  }, [searchQuery, accountData]);
   //paging
   const itemsPerPage = 5;
   const navigate = useNavigation();
   const [currentPage, setCurrentPage] = useState(1)
   const { currentItems, totalPages } = paginate(filteredRequests, currentPage, itemsPerPage);

    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{flex:1}}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30,flex:1 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách tài khoản</Text>
                        <Text>Thông tin tài khoản của quản lý chung cư</Text>
                    </View>
                    <Link href={`/web/Admin/create`}>
                    <Button text="Tạo tài khoản ban quản lý" style={{width:200}}></Button>
                    </Link>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchWrapper}>
                            <TextInput
                                      style={styles.searchInput}
                                      placeholderTextColor={'black'}
                                      placeholder="Tìm theo theo họ tên hoặc số điện thoại"
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
                    {!filteredRequests.length ? <Text style={{marginBottom:10, fontSize:18,fontWeight:'600'}}>Chưa có dữ liệu</Text>:
                          <TableComponent headers={headers}>
                            <FlatList data={currentItems}
                            renderItem={({ item }) =>
                            {
                                return(
                            <TableRow>
                                <Cell>{item.fullName}</Cell>
                                <Cell>{item.phoneNumber}</Cell>
                                <Cell>{item.email}</Cell>
                                <Cell><Button text={accountStatus[item?.status].status}
                                style={{backgroundColor:accountStatus[item?.status].color, width:100}}
                                ></Button> {}</Cell>
                                <Cell>
                                    <Link href={`/web/Admin/${item.id}`}
                                    >
                                        <Button text="Chi tiết" />
                                    </Link>
                                </Cell>
                            </TableRow>)}
                            }
                            keyExtractor={(item: Account) => item.id}
                        /> 
                        
                      </TableComponent>  }
                      <View style={{flexDirection:'row', alignItems:"center", justifyContent:'center', marginTop:20}}>
            <Button text="Trước"
            style={{width:50}}
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            <Text style={{marginHorizontal:10, fontWeight:"600"}}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button text="Sau" onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />

          </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
