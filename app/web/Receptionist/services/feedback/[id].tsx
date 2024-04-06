import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Image } from 'react-native'
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
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { statusForReceptionist } from '../../../../../constants/status';
import { useRoute } from '@react-navigation/native';
const StatusData = [
  { label: "Phê duyệt", value: 3 },
  { label: "Từ chối", value: 4 },
]
  
interface Feedback{
    id: string;
    roomId: string;
    serviceTypeId: string;
    title: string,
    content: string;
    createTime: Date;
    status: number;
    image:string;
    room:{
        roomNumber:string;
    }
    serviceType:{
        name:string;
    }
}
interface Room{
  roomNumber:string;
  id:string;
}

const page = () => {
  const item = useLocalSearchParams();
  const _editor:any = React.createRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [reply, setReply] = useState("");
  const [feedback, setFeedback] = useState<Feedback>();
  const {session} = useAuth();
  const disableBtn = reply=="";
  console.log(status);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 

      try {
        const replyAxios = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/feedback/getFeedbackById/${item.id}`, {
          timeout: 10000,
        });
        if (replyAxios.status === 200) {
          setFeedback(replyAxios.data.data)
          if(replyAxios.data.data.reply){
            setReply(replyAxios.data.data.reply);
          }
        }
        else {
          Toast.show({
            type: 'error',
            text1: 'Lỗi lấy thông tin phiếu phản ánh',
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
          text1: 'Lỗi lấy thông tin phiếu phản ánh',
          position: 'bottom'
        })
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or failure
      }
    };

    fetchData();
  }, [session]);
  const approveFeedback = async () => {
    try {
      console.log(session);
        setIsLoading(true); // Set loading state to true
        const replyAxios = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/feedback/manage/${item?.id}`,{
          response: reply,
          status:7
        }, {
            timeout: 10000,
            headers:{
              'Authorization': `Bearer ${session}`
          }
        });
        if (replyAxios.data.statusCode == 200) {
            Toast.show({
                type: 'success',
                text1: 'Phê duyệt phản hồi thành công',
                position:'bottom'
            })
            router.replace('/web/Receptionist/services/feedback/');
        }
        else {
            Toast.show({
                type: 'error',
                text1: 'Phê duyệt không thành công',
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
                text1: 'Lỗi cập nhật phiếu ! vui lòng thử lại sau',
                position:'bottom'
            })
        }
    } finally {
        setIsLoading(false);
    }
};
const handleDeleteFeedback = async () => {
  if (!item.id) {
    Toast.show({
      type:'error',
      text1:'Không tìm thấy phản ánh',
      position:'bottom'
    })
    return;
  }
  try {
    setIsLoading(true);
    const replyAxios = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/feedback/delete/${item.id}`, {
      timeout: 10000,
      withCredentials:true,
      headers:{
        'Authorization': `Bearer ${session}`
      }
  });
    if (replyAxios.data.statusCode == 200) {
      Toast.show({
        type:'success',
        text1:'Xóa yêu cầu thành công',
        position:'bottom'
      })
      router.replace('/web/Receptionist/services/feedback/');
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
    console.error('Error deleting feedback:', error);
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
            onPress={() => router.push(`/web/Receptionist/services/feedback/`)}
          ></Button>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
              Thông tin phiếu phản ánh
            </Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Thông tin căn hộ
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              
              placeholder={feedback?.room.roomNumber} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Loại phiếu phản ánh
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={feedback?.serviceType.name} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
            Tiêu đề
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={feedback?.title} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Ngày tạo
            </Text>
            <Input
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={'black'}
              placeholder={moment.utc(feedback?.createTime).format('DD-MM-YYYY')} style={[{ width: "100%", backgroundColor: '#E0E0E0' }]}
            ></Input>
          </View>
          <View style={{ marginBottom: 10,}}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginRight:5 }}>
              Nội dung phản ánh: 
            </Text>
            <Text>{feedback?.content}</Text>
          </View>
          {feedback?.image &&  <View style={{ marginBottom: 10,}}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginRight:5 }}>
              Ảnh: 
            </Text>
            <Image source={{uri:feedback?.image}} style={{width:100, height:100}}></Image>
          </View>}
         
          <View>
          <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
            Phản hồi
          </Text>
          <Input
            placeholderTextColor={'black'}
            value={reply}
            multiline
            onChangeText={setReply}
            placeholder="Nhập phản hồi" style={[{ width: "100%", backgroundColor: 'white', height:100 }]}
          ></Input>
        </View>
          
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Button
            onPress={approveFeedback}
            disabled={disableBtn}
            text="Phản hồi" style={[{ width: 100, marginRight: 10,
            opacity:disableBtn?0.7:1}]}></Button>
            {/* <Button 
            onPress={()=>{
              Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn có muốn xóa phiếu  này?',
                icon: 'warning',
                showCloseButton:true,
                confirmButtonText: 'Xóa',
                confirmButtonColor:'#9b2c2c',
              }).then((result) => {
                if(result.isConfirmed){
                  handleDeleteFeedback();
                }
              })
            }}
            text="Xóa" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button> */}
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
    padding: 5,
    borderWidth: 1,
    marginTop: 5
  },
})

export default page