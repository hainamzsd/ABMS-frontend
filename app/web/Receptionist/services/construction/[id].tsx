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
    response:string;
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
  const [response,setResponse] = useState("");
  const [construction, setConstruction] = useState<Construction>();
  const {session} = useAuth();
  const disableBtn = status===undefined || status==4 && response=="";
  console.log(status);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 

      try {
        const responseAxios = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/construction/get/${item.id}`, {
          timeout: 10000,
        });
        console.log(responseAxios);
        if (responseAxios.status === 200) {
          setConstruction(responseAxios.data.data)
          if(responseAxios.data.data.response){
            setResponse(responseAxios.data.data.response);
          }
        }
        else {
          console.error(responseAxios);
          Toast.show({
            type: 'error',
            text1: 'Lỗi lấy thông tin phiếu đăng ký thi công',
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
          text1: 'Lỗi lấy thông tin phiếu đăng ký thi công',
          position: 'bottom'
        })
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or failure
      }
    };

    fetchData();
  }, [session]);

  const [room, setRoom] = useState<Room>();
  useEffect(() => {
    if(construction?.roomId === undefined){
        return;
    }
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const responseAxios = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get/${construction?.roomId}`, { timeout: 100000 })
        if (responseAxios.data.statusCode === 200) {
          setRoom(responseAxios.data.data)
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
  }, [construction])


  const approveConstruction = async () => {
    try {
      console.log(session);
        setIsLoading(true); // Set loading state to true
        const responseAxios = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/construction/manage/${construction?.id}`,{
          status: status,
          response: response
        }, {
            timeout: 10000,
            headers:{
              'Authorization': `Bearer ${session}`
          }
        });
        console.log(responseAxios);
       
        if (responseAxios.data.statusCode == 200) {
            Toast.show({
                type: 'success',
                text1: 'Phê duyệt phiếu đăng ký thành công',
                position:'bottom'
            })
            router.replace('/web/Receptionist/services/construction/');
        }
        else {
          console.error(responseAxios);
            Toast.show({
                type: 'error',
                text1: 'Phê duyệt yêu cầu không thành công',
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
const handleDeleteConstruction = async () => {
  if (!item.id) {
    Toast.show({
      type:'error',
      text1:'Không tìm thấy thi công',
      position:'bottom'
    })
    return;
  }
  try {
    setIsLoading(true);
    const responseAxios = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/construction/delete/${item.id}`, {
      timeout: 10000,
      withCredentials:true,
      headers:{
        'Authorization': `Bearer ${session}`
      }
  });
    console.log(responseAxios);
    if (responseAxios.data.statusCode == 200) {
      Toast.show({
        type:'success',
        text1:'Xóa yêu cầu thành công',
        position:'bottom'
      })
      router.replace('/web/Receptionist/services/construction/');
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
    console.error('Error deleting construction:', error);
  } finally {
    setIsLoading(false);
  }
};
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
              Thông tin phiếu đăng kí thi công
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
              Tên dự án
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={construction?.name} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Tên đơn vị thi công
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={construction?.constructionOrganization} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Số điện thoại liên lạc
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={construction?.phoneContact} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Ngày bắt đầu
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={moment.utc(construction?.startTime).format('YYYY-MM-DD')} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Ngày kết thúc
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={moment.utc(construction?.endTime).format('YYYY-MM-DD')} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View style={{ marginBottom: 10,flexDirection:'row', alignItems:'center'}}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginRight:5 }}>
              Ghi chú: 
            </Text>
            <Text>{construction?.description}</Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Trạng thái
            </Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text>Trạng thái hiện tại:</Text>
              {construction?.status &&
                 <Button text={statusForReceptionist?.[construction?.status as any].status}
                 style={{borderRadius:20, 
                  marginLeft:10,
                  backgroundColor:statusForReceptionist?.[construction?.status as any].color}}
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
          {status==4 &&
          <View>
          <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
            Phản hồi
          </Text>
          <Input
            placeholderTextColor={'black'}
            value={response}
            onChangeText={setResponse}
            placeholder="Nhập phản hồi" style={[{ width: "100%", backgroundColor: 'white' }]}
          ></Input>
        </View>
          }
          
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Button
            onPress={approveConstruction}
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
                  handleDeleteConstruction();
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