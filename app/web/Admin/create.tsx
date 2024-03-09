import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { router, useNavigation } from 'expo-router';
import { isValidPhoneNumber } from '../../../utils/phoneValidate';
import { isValidEmail } from '../../../utils/emailValidate';
import { ScrollView } from 'react-native';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import styles from './styles';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import LoadingComponent from '../../../components/resident/loading';
import { Avatar } from 'react-native-paper';
import { validatePassword } from '../../../utils/passwordValidate';
import { validateFullName, validateUsername } from '../../../utils/usernameValidate';
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext';

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
    .max(20, 'Họ và tên không được nhiều hơn 20 kí tự'),
    password: Yup.string().required('Mật khẩu không được trống').test(
        'validate-password',
        'Mật khẩu cần có tối thiểu 8 kí tự bao gồm chữ thường, chữ viết hoa, chữ số và kí tự đặc biệt.',
        validatePassword,
      ),
      re_password: Yup.string()
      .required('Nhập lại mật khẩu không được trống')
      .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
  });
  


const page = () => {
    const navigation = useNavigation();
    const { session } = useAuth();
    const [password, setPassword] = useState("");
    const [reEnterPassword, setReEnterPassword] = useState("");
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
    const [isLoading, setIsLoading] = useState(false);

    const createAccount = async () => {
        setError(null);
        setValidationErrors({});

        const bodyData={
            building_id:"1",
            phone:phoneNumber,
            full_name:fullName,
            user_name:username,
            role:1,
            password:password,
            email:email,
            avatar:""
        }
        console.log(bodyData)
        try {
            setIsLoading(true); // Set loading state to true
            await validationSchema.validate({
                phone:phoneNumber,
                full_name:fullName,
                user_name:username,
                password:password,
                re_password:reEnterPassword,
                email:email,
            }, { abortEarly: false });
            const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/account/register', bodyData, {
                timeout: 10000,
                headers:{
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Tạo tài khoản thành công',
                    position:'bottom'
                })
                router.replace('/web/Admin/');
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Tạo tài khoản không thành công',
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
                    text1: 'Lỗi tạo tài khoản',
                    position:'bottom'
                })
            }
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
            {isLoading && <ActivityIndicator size={'large'} ></ActivityIndicator>} 
            <SafeAreaView style={{flex:1}}>
                <ScrollView style={{flex:1}}>
                    <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Quay Lại"
                        onPress={() => router.back}
                    ></Button>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
                            Tạo thông tin tài khoản
                        </Text>
                        <Text>Thông tin tài khoản của ban quản lý</Text>
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
                        {validationErrors.full_name  && (
                            <Text style={styles.errorText}>{validationErrors.full_name}</Text>
                        )}
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Tên tài khoản
                        </Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Tên tài khoản không được trống.</Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Tên tài khoản tối thiểu 8 kí tự, tối đa 20 kí tự.</Text>
                        <Input placeholder="Tên tài khoản"  style={[{ width: "100%" }]}
                        value={username}
                        onChangeText={(text)=>{
                            setUsername(text);
                        }}></Input>
                        {validationErrors.user_name  && (
                            <Text style={styles.errorText}>{validationErrors.user_name}</Text>
                        )}
                    </View>
                    <View>
                        <Text style={{ fontWeight: "600", fontSize: 16 }}>
                            Mật khẩu
                        </Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Mật khẩu cần có tối thiểu 8 kí tự bao gồm chữ thường, chữ viết hoa, chữ số và kí tự đặc biệt.</Text>
                        <Input secureTextEntry placeholder="Mật khẩu" style={[{ width: "100%" },  
                    ]}
                        value={password} onChangeText={(text) => {
                            setPassword(text);
                          }}></Input>
                          {validationErrors.password  && (
                            <Text style={styles.errorText}>{validationErrors.password}</Text>
                        )}
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Nhập lại Mật khẩu
                        </Text>
                        <Text style={{color:'#9c9c9c', fontSize:12,marginBottom: 10,}}>Mật khẩu nhập lại phải trùng với mật khẩu đã nhập.</Text>
                        <Input secureTextEntry placeholder="Nhập lại mật khẩu" 
                        onChangeText={setReEnterPassword}
                        style={[{ width: "100%" }, 
                    ]}></Input>
                     {validationErrors.re_password  && (
                            <Text style={styles.errorText}>{validationErrors.re_password}</Text>
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
                        <Button text="Tạo tài khoản" style={[{ width: 130, backgroundColor: '#276749' },
                    ]}
                        onPress={createAccount}
                        ></Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default page