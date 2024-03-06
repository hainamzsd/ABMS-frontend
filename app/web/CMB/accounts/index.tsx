import { Link, Redirect } from "expo-router";
import { SafeAreaView, Text, View, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import Button from "../../../../components/ui/button";
import { Cell, TableComponent, TableRow } from "../../../../components/ui/table";
import Input from "../../../../components/ui/input";
import styles from "./styles";
import { icons } from "../../../../constants"
import { useEffect, useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";

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

export default function AccountManagement() {
    const headers = ['Họ và tên', 'Số điện thoại', 'Email', ''];
    const [accountData, setAccountData] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
   
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading state to true
            setError(null); // Clear any previous errors

            try {
                const response = await axios.get(`http://localhost:5108/api/v1/account/get?role=2`, {
                    timeout:100000
                });
                setAccountData(response.data.data); // Set account data
            } catch (error) {
                if (axios.isCancel(error)) {
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                        position:'bottom'
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
    console.log(accountData);
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{flex:1}}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30,flex:1 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách tài khoản</Text>
                        <Text>Thông tin tài khoản của lễ tân</Text>
                    </View>
                    <Link href={"/web/CMB/accounts/create"}>
                    <Button text="Tạo tài khoản lễ tân" style={{width:200}}></Button>
                    </Link>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchWrapper}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Tìm tên tài khoản"
                                value=""
                                onChange={() => { }}
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
                    {accountData?.length==0 ? <Text style={{marginBottom:10, fontSize:18,fontWeight:'600'}}>Chưa có dữ liệu</Text>:
                          <TableComponent headers={headers}>
                            <FlatList data={accountData}
                            renderItem={({ item }) => <TableRow>
                                <Cell>{item.fullName}</Cell>
                                <Cell>{item.phoneNumber}</Cell>
                                <Cell>{item.email}</Cell>
                                <Cell>
                                    <Link href={`/web/CMB/accounts/${item.id}`}
                                    >
                                        <Button text="Chi tiết" />
                                    </Link>
                                </Cell>
                            </TableRow>
                            }
                            keyExtractor={(item: Account) => item.id}
                        /> 
                        
                      </TableComponent>  }
                 
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
