import { View, SafeAreaView, StyleSheet, ActivityIndicator, InteractionManager } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { ScrollView } from "react-native";
import styles from "./styles";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import * as Yup from 'yup';
import { Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AlertDialog,Text, VStack } from "native-base";


interface Account {
  id:string,
  buildingId?: string | null;
  phoneNumber: string;
  userName: string;
  email: string;
  fullName: string;
  role: number;
  avatar: string | null;
  createUser: string;
  createTime: string;
  modifyUser: string | null;
  modifyTime: string | null;
  status: number;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Email không được trống'),
  phone: Yup.string()
    .required('Số điện thoại không được trống')
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .max(10, 'Số điện thoại không được nhiều hơn 10 chữ số'),
    user_name: Yup.string().required('Tên tài khoản không được trống').
    min(8, 'Tên tài khoản phải ít nhất 8 kí tự').
    max(20, 'Tên tài khoản không được nhiều hơn 20 kí tự'),
  full_name: Yup.string().required('Họ và tên không được trống').min(8, 'Họ và tên phải ít nhất 8 kí tự')
  .max(20, 'Họ và tên không được nhiều hơn 20 kí tự')
});


interface User{
  BuildingId:string;
}

const page = () => {
  const navigation = useNavigation();
  const accountId = useLocalSearchParams();
  const [accountData, setAccountData] = useState<Account>();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone);
  };
  const handleEmailChange = (text: string) => {
    setEmail(text);
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true

      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/account/get/${accountId.accountDetail}`, {
          timeout: 10000,
        });
        console.log(response);
        if (response.data.statusCode  === 200) {
          setAccountData(response.data.data);
          setPhoneNumber(response.data.data.phoneNumber);
          setEmail(response.data.data.email);
          setUsername(response.data.data.userName);
          setFullName(response.data.data.fullName);
        }
        else {
          Toast.show({
            type: 'error',
            text1: 'Lỗi lấy thông tin tài khoản',
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
          text1: 'Lỗi lấy thông tin tài khoản',
          position: 'bottom'
        })
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or failure
      }
    };

    fetchData();
  }, []);

  const {session} = useAuth();
  const user:User = jwtDecode(session as string);
  const updateAccount = async () => {
    setError(null);
    setValidationErrors({});
    if(!user){
      Toast.show({
        type: 'error',
        text1: 'Không tìm thấy thông tin người dùng',
        position: 'bottom'
      })
      return;
    }
    const bodyData={
        building_id:user.BuildingId,
        phone:phoneNumber,
        full_name:fullName,
        user_name:username,
        role:2,
        email:email,
        avatar:""
    }
    try {
        setIsLoading(true); // Set loading state to true
        await validationSchema.validate(bodyData, { abortEarly: false });
        const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/account/update/${accountData?.id}`, bodyData, {
            timeout: 10000,
            withCredentials:true,
            headers:{
              'Authorization': `Bearer ${session}`
            }
        });
        console.log(response);
        if (response.data.statusCode == 200) {
            Toast.show({
                type: 'success',
                text1: 'Cập nhật tài khoản thành công',
                position:'bottom'
            })
            router.replace('/web/CMB/accounts/');
        }
        else {
            Toast.show({
                type: 'error',
                text1: 'Cập nhật tài khoản không thành công',
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
            Toast.show({
                type: 'error',
                text1: 'Lỗi cập nhật tài khoản',
                position:'bottom'
            })
        }
    } finally {
        setIsLoading(false);
    }
};

const handleDeleteAccount = async () => {
  if (!accountId.accountDetail) {
    Toast.show({
      type:'error',
      text1:'Không tìm thấy tài khoản',
      position:'bottom'
    })
    return;
  }
  setIsLoading(true);
  setError(null); 

  try {
  
    const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/account/delete/${accountId.accountDetail}`, {
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
        text1:'Vô hiệu hóa thành công',
        position:'bottom'
      })
      router.replace('/web/CMB/accounts/');
    } else {
      Toast.show({
        type:'error',
        text1:'Vô hiệu hóa không thành công' ,
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
    console.error('Error deleting account:', error);
    setError('An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

const handleActiveAccount = async () => {
  if (!accountId.accountDetail) {
    Toast.show({
      type:'error',
      text1:'Không tìm thấy tài khoản',
      position:'bottom'
    })
    return;
  }
  setIsLoading(true);
  setError(null); 

  try {
  
    const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/account/active/${accountId.accountDetail}?status=1`,{}, {
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
        text1:'Cập nhật tài khoản thành công',
        position:'bottom'
      })
      router.replace('/web/CMB/accounts/');
    } else {
      Toast.show({
        type:'error',
        text1:'Cập nhật tài khoản không thành công' ,
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
    console.error('Error update account:', error);
    setError('An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

//handleRemoveAccount

const [isOpen, setIsOpen] = useState(false);

const onClose = () => setIsOpen(false);

const cancelRef = React.useRef(null);
const handleRemove = async () => {
  if (!accountId.accountDetail) {
    Toast.show({
      type:'error',
      text1:'Không tìm thấy tài khoản',
      position:'bottom'
    })
    return;
  }
  setIsLoading(true);
  setError(null); 

  try {
  
    const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/${accountId.accountDetail}`, {
      timeout: 10000,
      withCredentials:true,
      headers:{
        'Authorization': `Bearer ${session}`
      }
  });
    console.log(response);
    if (response.status == 200) {
      Toast.show({
        type:'success',
        text1:'Xóa tài khoản thành công',
        position:'bottom'
      })
      router.replace('/web/CMB/accounts/');
    } else {
      Toast.show({
        type:'error',
        text1:'Xóa tài khoản không thành công' ,
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
    console.error('Error deleting account:', error);
    setError('An error occurred. Please try again.');
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
            onPress={() => router.push(`/web/CMB/accounts/`)}
          ></Button>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
              Thông tin tài khoản
            </Text>
            <Text>Thông tin chi tiết tài khoản của CMB</Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Tên
            </Text>
            <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text>
            <Input
              value={fullName} onChangeText={(text) => {
                setFullName(text);
              }}
              placeholder="Họ và tên" style={[{ width: "100%" }]}

            ></Input>
            {validationErrors.full_name && (
              <Text style={styles.errorText}>{validationErrors.full_name}</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Tên tài khoản
            </Text>
            <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Tên tài khoản không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Tên tài khoản tối thiểu 8 kí tự, tối đa 20 kí tự.</Text>
            <Input placeholder="Tên tài khoản" style={[{ width: "100%" }]}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
              }}></Input>
            {validationErrors.user_name && (
              <Text style={styles.errorText}>{validationErrors.user_name}</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Email
            </Text>
            <Input
              placeholder="Email"
              style={[styles.input]}
              keyboardType="email-address"
              value={email}
              onChangeText={handleEmailChange}
            ></Input>
            {validationErrors.email && (
              <Text style={styles.errorText}>{validationErrors.email}</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Số điện thoại
            </Text>
            <Input
              placeholder="Phone"
              style={[styles.input]}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
            ></Input>
            {validationErrors.phone && (
              <Text style={styles.errorText}>{validationErrors.phone}</Text>
            )}
          </View>

            <VStack space={2}>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Button
            onPress={updateAccount}
            text="Cập nhật" style={[{ width: 100, marginRight: 10,
            }]}></Button>
           {accountData?.status === 0 ? 
             <Button 
             onPress={handleActiveAccount}
             text="Kích hoạt" style={{ width: 100, backgroundColor: '#276749' }}></Button>
            : 
            <Button 
            onPress={handleDeleteAccount}
            text="Vô hiệu hóa" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button>
            }
           
          </View>
          {accountData?.status === 0 && 
            <Button 
            onPress={()=>setIsOpen(true)}
            text="Xóa tài khoản" style={{ width: 120, backgroundColor: '#9b2c2c' }}></Button>
            }
            </VStack>
        </ScrollView>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Xóa tài khoản</AlertDialog.Header>
                        <AlertDialog.Body>
                        <Text>
                            Hành động này sẽ xóa tài khoản và tất cả thông tin liên quan.
                            Bạn sẽ <Text fontWeight={'bold'}>không thể</Text> khôi phục hành động này. Bạn có xác nhận không?
                            </Text>
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                                <Button text='Hủy' style={{marginRight:5}} onPress={onClose}>
                                </Button>
                                <Button text='Xóa' color='#9b2c2c'  onPress={handleRemove}>
                                </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
      </SafeAreaView>
    </View>
  );
};

export default page;
