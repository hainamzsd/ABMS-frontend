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

interface Construction{
    id:string;
    roomId:string;
    name:string;
    constructionOrganization:string;
    phoneContact:string;
    startTime:Date;
    endTime:Date;
    description:string;
    createTime:Date;
    status:number;
}

interface Room{
    roomNumber:string;
    id:string;
}
const StatusData = [
  { label: "Yêu cầu chưa phê duyệt", value: 2 },
  { label: "Yêu cầu đã phê duyệt", value: 3 },
  { label: "Yêu cầu đã từ chối", value: 4 },
]

const index = () => {
    const headers = ['ID Căn hộ', 'Tên dự án', 'Đơn vị thi công', 'Ngày bắt đầu', 'Ngày kết thúc', 'Trạng thái',''];
    const [request, setRequest] = useState<Construction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [overlapError, setOverlapError] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7
    const [status, setStatus] = useState<number | null>(2) // null for approved, 2 for pending
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true)
        setError(null)
  
        try {
          let url = `https://abmscapstone2024.azurewebsites.net/api/v1/construction/get`
          if (status !== null) {
            url += `?status=${status}`
          }
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
                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách phiếu đăng kí thi công trong căn hộ</Text>
                <Text>Thông tin những phiếu đăng kí trong bảng</Text>
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
            {request.length==0 ? <Text style={{marginBottom:10, fontSize:18,fontWeight:'600'}}>Chưa có dữ liệu</Text>:
                  <TableComponent headers={headers}>
                    <FlatList data={currentItems}
                    renderItem={({ item }) => 
                    {
                      return( 
                        <TableRow>
                        <Cell>{item.roomId}</Cell>
                        <Cell>{item.name}</Cell>
                        <Cell>{item.constructionOrganization}</Cell>
                        <Cell>{moment.utc(item.startTime).format('YYYY-MM-DD')}</Cell>
                        <Cell>{moment.utc(item.endTime).format('YYYY-MM-DD')}</Cell>
                        <Cell>
                          {item.status && 
                           <Button text={statusForReceptionist?.[item.status as number].status}
                           style={{borderRadius:20, backgroundColor:statusForReceptionist?.[item.status as number].color}}
                           > </Button>}
                       
                        </Cell>
                        <Cell>
                                <Button text="Chi tiết"
                                 onPress={()=>router.push({
                                  pathname: `/web/Receptionist/services/construction/${item.id}`})}/>
                        </Cell>
                    </TableRow>
  
                      )
                }
                       
                      }
                    keyExtractor={(item: Construction) => item.id}
                /> 
                
              </TableComponent>  }
              <View style={{flexDirection:'row', alignItems:"center", justifyContent:'center', marginTop:20}}>
            <Button text="Trước"
            style={{width:50}}
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            <Text style={{marginHorizontal:10, fontWeight:"600"}}>
              Trang {currentPage} trên {totalPages}
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
    },
    comboBox: {
      backgroundColor: 'white',
      width:300,
      marginBottom:10,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      marginTop: 5
    },
});