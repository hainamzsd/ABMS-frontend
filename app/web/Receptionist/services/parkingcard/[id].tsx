import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, SectionList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../../../../../components/ui/button'
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Input from '../../../../../components/ui/input';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import 'firebase/storage';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import Swal from 'sweetalert2'
import { statusForReceptionist } from '../../../../../constants/status';
import { useRoute } from '@react-navigation/native';
import { AlertDialog, FlatList } from 'native-base';
import {firebase} from '../../../../../config'
import * as Yup from 'yup';
import { jwtDecode } from 'jwt-decode';
const StatusData = [
  { label: "Phê duyệt", value: 1 },
  { label: "Từ chối", value: 4 },
]
  



interface ParkingCard{
  id: string;
  residentId: string;
  licensePlate: string;
  brand: string;
  color: string;
  type: number,
  image: string,
  expireDate: string,
  note: string;
  createUser: string;
  createTime: Date,
  modifyUser: string;
  modifyTime: string;
  response: string;
  status: number,
  resident: {
    id: string;
    fullName:string;
    room:{
      roomNumber:string;
      id:string;
    }
}
}

const vehicleType: { [key: number]: string } ={
  1: "Xe máy",
  2: "Ô tô",
  3: "Xe đạp",
  4:"Xe đạp điện"
}

const validationSchema = Yup.object().shape({
  Color: Yup.string().required("Trường này không được để trống"),
    Brand: Yup.string().required('Trường này không được để trống'),
});

const page = () => {
  const item = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [status, setStatus] = useState();
  const [parkingcard, setParkingCard] = useState<ParkingCard>();
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const {session} = useAuth();
  const user:any = jwtDecode(session as string);
  const [reply, setReply] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const disableBtn = status===undefined || status==4 && reply=="";
  console.log(reply)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 

      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/parking-card/get/${item.id}`, {
          timeout: 10000,
        });
        if (response.data.statusCode  === 200) {
          setParkingCard(response.data.data)
          setColor(response.data.data.color);
          setBrand(response.data.data.brand);
          if(response.data.data.response){
            setReply(response.data.data.response);
          }
        }
        else {
          console.error(response);
          Toast.show({
            type: 'error',
            text1: 'Lỗi lấy thông tin phiếu đăng ký vé xe',
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
          return;
        }
        console.error('Error fetching account data:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi lấy thông tin phiếu đăng ký vé xe',
          position: 'bottom'
        })
        return;
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or failure
      }
    };
    fetchData();
  }, []);
  const approveParkingCard = async () => {
    setIsLoading(true);
    const feeId = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/GetFeesByNames?names=${vehicleType[parkingcard?.type as any]}&buildingId=${user.BuildingId}`)
    console.log(vehicleType[parkingcard?.type as any]);
    try {
      await validationSchema.validate({
        Color: color,
        Brand: brand,
      }, { abortEarly: false });
      console.log({
        resident_id: parkingcard?.residentId,
        license_plate: parkingcard?.licensePlate,
        brand: brand,
        color: color,
        type: parkingcard?.type,
        image: parkingcard?.image,
        expire_date: parkingcard?.expireDate,
        status: status,
        note: parkingcard?.note
      })
      const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/parking-card/update/${parkingcard?.id}`, {
        resident_id: parkingcard?.residentId,
        license_plate: parkingcard?.licensePlate,
        brand: brand,
        color: color,
        type: parkingcard?.type,
        image: parkingcard?.image,
        expire_date: parkingcard?.expireDate,
        status: status,
        note: parkingcard?.note,
        response: reply
      }, {
        timeout: 10000,
        headers: {
              'Authorization': `Bearer ${session}`
          }
        });
        if(status==1){
          const createRoomService = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/room-service/create', {
            room_id: parkingcard?.resident?.room?.id,
            fee_id: feeId.data.data[0].id,
            amount: 1,
            description: ""
          },{ timeout: 10000, 
            headers:{
                'Authorization': `Bearer ${session}`
            }})
        if(createRoomService.data.statusCode!=200){
          Toast.show({
            type: 'error',
            text1: 'Lỗi gán phí cho phòng.',
            position: 'bottom'
          })
        }
        }
        if(status==4){
          const deleteRoomService = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/room-service/delete-by-roomfee?feeId=${feeId.data.data[0].id}&roomId=${parkingcard?.resident?.room?.id}`,
          { timeout: 10000, 
            headers:{
                'Authorization': `Bearer ${session}`
            }})
            console.log(deleteRoomService);
          }
        if (response.data.statusCode == 200) {
          const createNotification = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/notification/create-for-resident',{
            title: `Đơn đăng kí thẻ gửi xe đã ${status==3?'phê duyệt':'từ chối'}`,
            buildingId: user.BuildingId,
            content: `Đơn đăng kí thẻ gửi xe đã ${status==3?'phê duyệt':'từ chối'}`,
            roomId: parkingcard?.resident.room.id
        },
        {
            timeout: 10000, 
            headers:{
                'Authorization': `Bearer ${session}`
            }
          },)
            Toast.show({
                type: 'success',
                text1: 'Cập nhật phiếu đăng ký thành công',
                position:'bottom'
            })
            router.replace('/web/Receptionist/services/parkingcard/');
        }
        else {
          console.error(response);
            Toast.show({
                type: 'error',
                text1: 'Cập nhật không thành công',
                position:'bottom'
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
const handleDeleteParkingCard = async () => {
  if (!item.id) {
    Toast.show({
      type:'error',
      text1:'Không tìm thấy vé xe',
      position:'bottom'
    })
    return;
  }
  try {
    setIsLoading(true);
    const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/parking-card/removee/${item.id}`, {
      timeout: 10000,
      withCredentials:true,
      headers:{
        'Authorization': `Bearer ${session}`
      }
  });
    console.log(response);
    if (response.data.statusCode == 200) {
      const deleteNotification = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/deleteByServiceId/${item?.id}`)
     
      Toast.show({
        type:'success',
        text1:'Xóa yêu cầu thành công',
        position:'bottom'
      })
      router.replace('/web/Receptionist/services/parkingcard/');
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
    console.error('Error deleting parkingcard:', error);
  } finally {
    setIsLoading(false);
  }
};

const [imageUrls, setImageUrls] = useState([]);
const [loadingImage, setLoadingImage] = useState(false);
useEffect(() => {
    const fetchImage = async () => {
      const reference = firebase.database().ref(parkingcard?.image);
      try {
        setLoadingImage(true);
        setIsLoading(true);
        const snapshot = await reference.once('value');
        const images = snapshot.val();
        const urls = Object.values(images); 
        setImageUrls(urls as any);
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi lấy ảnh',
          position: 'bottom'
        })
      }
      finally{
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, [parkingcard]);

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        backgroundColor: "#F9FAFB",
      }}
    >
      {/* {isLoading &&
        <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>
      } */}
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Button
            style={{ width: 100, marginBottom: 20 }}
            text="Quay Lại"
            onPress={() => router.push(`/web/Receptionist/services/parkingcard/`)}
          ></Button>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
              Thông tin phiếu đăng kí vé xe
            </Text>
            <Text>Lễ tân xem xét yêu cầu đăng kí của cư dân về đăng kí vé xe</Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Thông tin căn hộ
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
              editable={false}
              placeholderTextColor={'black'}
              placeholder={parkingcard?.resident?.room?.roomNumber} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Họ tên chủ thẻ
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
              editable={false}
              placeholderTextColor={'black'}
              placeholder={parkingcard?.resident?.fullName} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Ngày tạo
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
              editable={false}
              placeholderTextColor={'black'}
              placeholder={moment.utc(parkingcard?.createTime).format("M/DD/YYYY")} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Ngày hết hạn
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
              editable={false}
              placeholderTextColor={'black'}
              placeholder={parkingcard?.expireDate} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Loại xe
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
             editable={false}
              placeholderTextColor={'black'}
              placeholder={vehicleType[parkingcard?.type as number]} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Hãng hiệu xe
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
              value={brand}
              onChangeText={setBrand}
              placeholderTextColor={'black'}
              style={[{ width: "100%", backgroundColor: 'white' }]}
            ></Input>
            {validationErrors.Brand && (
              <Text style={{color:'red'}}>{validationErrors.Brand}</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Màu xe
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
            value={color}
            onChangeText={setColor}
              placeholderTextColor={'black'}
              style={[{ width: "100%", backgroundColor: 'white' }]}
            ></Input>
            {validationErrors.Color && (
              <Text style={{color:'red'}}>{validationErrors.Color}</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Biển xe
            </Text>
            {/* <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text> */}
            <Input
            editable={false}
              placeholderTextColor={'black'}
              placeholder={parkingcard?.licensePlate}
              style={[{ width: "100%", backgroundColor: '#e0e0e0' }]}
            ></Input>
            {validationErrors.LicensePlate && (
              <Text style={{color:'red'}}>{validationErrors.LicensePlate}</Text>
            )}
          </View>
            {loadingImage && <ActivityIndicator size={'small'} color={'#171717'}></ActivityIndicator>}
            <View style={{flex:1, flexDirection:'row'}}>
            {imageUrls.length>0 && 
              <FlatList 
              data={imageUrls}
              numColumns={3}
              renderItem={({item})=>(
                <Image
              key={item}
              style={{ width: 150, height: 150, margin:5 }}
              source={{ uri: item }}
            />
              )}
              ></FlatList>
            }
          </View>
          <View style={{ marginBottom: 10,flexDirection:'row', alignItems:'center'}}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginRight:5 }}>
              Ghi chú: 
            </Text>
            <Text>{parkingcard?.note}</Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Trạng thái
            </Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text>Trạng thái hiện tại:</Text>
              {parkingcard?.status &&
                 <Button text={statusForReceptionist?.[parkingcard?.status].status}
                 style={{borderRadius:20, 
                  marginLeft:10,
                  backgroundColor:statusForReceptionist?.[parkingcard?.status as any].color}}
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
            value={reply}
            onChangeText={setReply}
            placeholder="Nhập phản hồi" style={[{ width: "100%", backgroundColor: 'white' }]}
          ></Input>
        </View>
          }
          
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Button
            onPress={approveParkingCard}
            disabled={disableBtn}
            text="Cập nhật" style={[{ width: 100, marginRight: 10,
            opacity:disableBtn?0.7:1}]}></Button>
            {parkingcard?.status==0 && <Button 
            onPress={()=>{setIsOpen(true)
          }}
            text="Xóa" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button>}
           
          </View>
          <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Xóa thẻ gửi xe</AlertDialog.Header>
                        <AlertDialog.Body>
                            Hành động này sẽ xóa vĩnh viễn thẻ gửi xe này. Bạn có xác nhận xóa không?
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                                <Button text='Hủy' style={{marginRight:5}} onPress={onClose}>
                                </Button>
                                <Button text='Xóa' color='#9b2c2c'  onPress={handleDeleteParkingCard}>
                                </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
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