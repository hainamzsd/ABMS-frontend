import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../../../../../components/ui/button'
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Input from '../../../../../components/ui/input';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import Swal from 'sweetalert2'
import { statusForReceptionist } from '../../../../../constants/status';
import { useRoute } from '@react-navigation/native';
const StatusData = [
  { label: "Phê duyệt", value: 3 },
  { label: "Từ chối", value: 4 },
]
  
interface Elevator{
  id:string;
  roomId:string;
  startTime:Date;
  endTime:Date;
  status:Number;
  description:string
}
interface Room{
  roomNumber:string;
  id:string;
}

const page = () => {
  const item = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [status, setStatus] = useState();
  const [elevator, setElevator] = useState<Elevator>();
  const {session} = useAuth();
  const disableBtn = status===undefined;
  console.log(status);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 

      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/elevator/get/${item.id}`, {
          timeout: 10000,
        });
        console.log(response);
        if (response.status === 200) {
          setElevator(response.data.data)
        }
        else {
          console.error(response);
          Toast.show({
            type: 'error',
            text1: 'Lỗi lấy thông tin phiếu đăng ký thang máy',
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
        console.error('Error fetching account data:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi lấy thông tin phiếu đăng ký thang máy',
          position: 'bottom'
        })
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or failure
      }
    };

    fetchData();
  }, [session]);
  const approveElevator = async () => {
    try {
      console.log(session);
        setIsLoading(true); // Set loading state to true
        const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/elevator/manage/${elevator?.id}?status=${status}`,{}, {
            timeout: 10000,
            headers:{
              'Authorization': `Bearer ${session}`
          }
        });
        console.log(response);
        if(response.data.statusCode == 409){
          Toast.show({
            type: 'error',
            text1: 'Không thể phê duyệt yêu cầu này',
            text2:'Đã có lịch trùng với yêu cầu này trong hệ thống',
            position:'bottom'
          })
          return;
        }
        if (response.data.statusCode == 200) {
            Toast.show({
                type: 'success',
                text1: 'Phê duyệt phiếu đăng ký thành công',
                position:'bottom'
            })
            router.replace('/web/Receptionist/services/elevator/');
        }
        else {
          console.error(response);
            Toast.show({
                type: 'error',
                text1: 'Phê duyệt tài khoản không thành công',
                position:'bottom'
            })
        }
    } catch (error:any) {
        if (axios.isCancel(error)) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                position:'bottom'
            })
        }
        else{
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi cập nhật phiếu đăng ký! vui lòng thử lại sau',
                position:'bottom'
            })
        }
    } finally {
        setIsLoading(false);
    }
};
const handleDeleteElevator = async () => {
  if (!item.id) {
    Toast.show({
      type:'error',
      text1:'Không tìm thấy thang máy',
      position:'bottom'
    })
    return;
  }
  try {
    setIsLoading(true);
    const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/elevator/delete/${item.id}`, {
      timeout: 10000,
      withCredentials:true,
      headers:{
        'Authorization': `Bearer ${session}`
      }
  });
    console.log(response);
    if (response.data.statusCode == 200) {
      Toast.show({
        type:'success',
        text1:'Xóa yêu cầu thành công',
        position:'bottom'
      })
      router.replace('/web/Receptionist/services/elevator/');
    } else {
      Toast.show({
        type:'error',
        text1:'Xóa yêu cầu không thành công' ,
        position:'bottom'
      })
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      Toast.show({
          type: 'error',
          text1: 'Lỗi hệ thống! vui lòng thử lại sau',
          position:'bottom'
      })
  }
    console.error('Error deleting elevator:', error);
  } finally {
    setIsLoading(false);
  }
};

const [room, setRoom] = useState<Room>();
useEffect(() => {
  if(elevator?.roomId === undefined){
      return;
  }
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get/${elevator?.roomId}`, { timeout: 100000 })
      if (response.data.statusCode === 200) {
        setRoom(response.data.data)
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
}, [elevator])

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        backgroundColor: "#F9FAFB",
      }}
    >
      {isLoading &&
        <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>
      }
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Button
            style={{ width: 100, marginBottom: 20 }}
            text="Quay Lại"
            onPress={() => navigation.goBack()}
          ></Button>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
              Thông tin phiếu đăng kí sử dụng thang máy
            </Text>
            <Text>Lễ tân xem xét yêu cầu đăng kí của cư dân về phiếu đăng kí</Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Thông tin căn hộ
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              
              placeholder={room?.roomNumber} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Ngày bắt đầu
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={moment.utc(elevator?.startTime).format('YYYY-MM-DD')} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Giờ bắt đầu
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={moment.utc(elevator?.startTime).format('HH:mm')} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Giờ kết thúc
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={moment.utc(elevator?.endTime).format('HH:mm')} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View style={{ marginBottom: 10,flexDirection:'row', alignItems:'center'}}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginRight:5 }}>
              Ghi chú: 
            </Text>
            <Text>{elevator?.description}</Text>
          </View>
          <View>
            
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Trạng thái
            </Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text>Trạng thái hiện tại:</Text>
              {elevator?.status &&
                 <Button text={statusForReceptionist?.[elevator?.status as any].status}
                 style={{borderRadius:20, 
                  marginLeft:10,
                  backgroundColor:statusForReceptionist?.[elevator?.status as any].color}}
                 > </Button>
              }
           
            </View>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
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
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Button
            onPress={approveElevator}
            disabled={disableBtn}
            text="Phê duyệt" style={[{ width: 100, marginRight: 10,
            opacity:disableBtn?0.7:1}]}></Button>
            <Button 
            onPress={()=>{
              Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn có muốn xóa phiếu đăng ký này?',
                icon: 'warning',
                showCloseButton:true,
                confirmButtonText: 'Xóa',
                confirmButtonColor:'#9b2c2c',
              }).then((result) => {
                if(result.isConfirmed){
                  handleDeleteElevator();
                }
              })
            }}
            text="Xóa" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
const styles = StyleSheet.create({
  comboBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    marginTop: 5
  },
})

export default page