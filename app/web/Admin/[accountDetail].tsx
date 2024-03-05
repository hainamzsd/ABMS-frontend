import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, InteractionManager } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import { ScrollView } from "react-native";
import { isValidPhoneNumber } from "../../../utils/phoneValidate";
import styles from "./styles";
import { isValidEmail } from "../../../utils/emailValidate";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import LoadingComponent from "../../../components/resident/loading";
import { validateFullName, validateUsername } from "../../../utils/usernameValidate";
import Toast from "react-native-toast-message";
import * as Yup from 'yup';
import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";


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
        const response = await axios.get(`http://localhost:5108/api/v1/account/get/${accountId.accountDetail}`, {
          timeout: 10000,
        });
        console.log(response);
        if (response.status === 200) {
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
  const updateAccount = async () => {
    setError(null);
    setValidationErrors({});

    const bodyData={
        building_id:"1",
        phone:phoneNumber,
        full_name:fullName,
        user_name:username,
        role:1,
        email:email,
        avatar:""
    }
    try {
        setIsLoading(true); // Set loading state to true
        await validationSchema.validate(bodyData, { abortEarly: false });
        const response = await axios.put(`http://localhost:5108/api/v1/account/update/${accountData?.id}`, bodyData, {
            timeout: 10000,
            withCredentials:true,
            // headers:{
            //   'Authorization': `Bearer ${session}`
            // }
        });
        console.log(response);
        if (response.data.statusCode == 200) {
            Toast.show({
                type: 'success',
                text1: 'Cập nhật tài khoản thành công',
                position:'bottom'
            })
            router.replace('/web/Admin/');
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
            console.error('Error creating account:', error);
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
const handleDeleteConfirm = async () => {
  Alert.alert(
    'Xác nhận xóa',
    'Bạn có muốn xóa tài khoản này không?',
    [
      { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      { text: 'Xóa', onPress: () => handleDeleteAccount(), style: 'destructive' },
    ],
    { cancelable: true },
  );
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
    const response = await fetch(`http://localhost:5108/api/v1/account/delete/${accountId}`, {
      method: 'DELETE',
      headers: {
        // Set authorization headers if your API requires them
        // 'Authorization': 'Bearer <your_token>',
      },
    });
    console.log(response);
    if (response.ok) {
      Toast.show({
        type:'success',
        text1:'Xóa tài khoản thành công',
        position:'bottom'
      })
      // router.replace('/web/Admin/');
    } else {
      const errorMessage = await response.text();
      Toast.show({
        type:'error',
        text1:'Xóa tài khoản không thành công' + errorMessage,
        position:'bottom'
      })
      setError(`Error deleting account: ${errorMessage}`);
    }
  } catch (error) {
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
            onPress={() => navigation.goBack()}
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

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Button
            onPress={updateAccount}
            text="Cập nhật" style={[{ width: 100, marginRight: 10,
            }]}></Button>
            <Button 
            onPress={handleDeleteAccount}
            text="Xóa" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default page;
