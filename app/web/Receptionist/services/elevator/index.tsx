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

interface Elevator{
    id:string;
    roomId:string;
    startTime:Date;
    endTime:Date;
    status:Number;
}

const index = () => {
    const headers = ['Căn hộ', 'Thời gian bắt đầu', 'Thời gian kết thúc', 'Trạng thái',''];
    const [request, setRequest] = useState<Elevator[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7
    const [status, setStatus] = useState<number | null>(2) // null for approved, 2 for pending

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true)
        setError(null)
  
        try {
          let url = `https://abmscapstone2024.azurewebsites.net/api/v1/elevator/get`
          if (status !== null) {
            url += `?status=${status}`
          }
          console.log(url);
          const response = await axios.get(url, { timeout: 100000 })
          if (response.data.statusCode === 200) {
            setRequest(response.data.data)
          } else {
            Toast.show({
              type: 'error',
              text1: 'Lỗi hệ thống! vui lòng thử lại sau',
              position: 'bottom',
            })
          }
        } catch (error) {
            if(axios.isCancel(error)){
                Toast.show({
                    type: 'error',
                    text1:'Hệ thống không phản hồi, thử lại sau',
                    position:'bottom'
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
  
      fetchData()
    }, [status])
  
    const handleShowPending = () => {
      setStatus(2)
    }
  
    const handleShowApproved = () => {
      setStatus(null)
    }
  

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true)
        setError(null)
  
        try {
          let url = `https://abmscapstone2024.azurewebsites.net/api/v1/elevator/get`
          if (status !== null) {
            url += `?status=${status}`
          }
          console.log(url);
          const response = await axios.get(url, { timeout: 100000 })
          if (response.data.statusCode === 200) {
            setRequest(response.data.data)
          } else {
            Toast.show({
              type: 'error',
              text1: 'Lỗi hệ thống! vui lòng thử lại sau',
              position: 'bottom',
            })
          }
        } catch (error) {
            if(axios.isCancel(error)){
                Toast.show({
                    type: 'error',
                    text1:'Hệ thống không phản hồi, thử lại sau',
                    position:'bottom'
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
  
      fetchData()
    }, [status])

    const navigate = useNavigation();
    const { currentItems, totalPages } = paginate(request, currentPage, itemsPerPage)
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
    <SafeAreaView style={{flex:1}}>
        <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30,flex:1 }}>
        <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Quay Lại"
                        onPress={() => navigate.goBack()}
                    ></Button>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách phiếu đăng kí sử dụng thang máy chưa phê duyệt</Text>
                <Text>Phê duyệt những phiếu đăng kí trong bảng</Text>
            </View>
            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm theo tên căn hộ"
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
            {status === null && (
            <Button text="Đổi sang yêu cầu chưa phê duyệt"
            style={{width:300, marginBottom:10}}
            onPress={handleShowPending} />
          )}
          {status === 2 && (
            <Button text="Đổi sang yêu cầu đã phê duyệt"
            style={{width:300, marginBottom:10}}
            onPress={handleShowApproved} />
          )}
            {isLoading && <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>}
            {!request ? <Text style={{marginBottom:10, fontSize:18,fontWeight:'600'}}>Chưa có dữ liệu</Text>:
                  <TableComponent headers={headers}>
                    <FlatList data={currentItems}
                    renderItem={({ item }) => <TableRow>
                        <Cell>{item.roomId}</Cell>
                        <Cell>{moment(item.startTime).format('YYYY-MM-DD')}</Cell>
                        <Cell>{moment(item.endTime).format('YYYY-MM-DD')}</Cell>
                        <Cell>{statusForReceptionist?.[item.status as number].status}</Cell>
                        <Cell>
                                <Button text="Chi tiết"
                                 onPress={()=>router.push(`/web/Receptionist/services/elevator/${item.id}`)}/>
                        </Cell>
                    </TableRow>
                    }
                    keyExtractor={(item: Elevator) => item.id}
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
        borderColor:'#9c9c9c'
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
    }
});