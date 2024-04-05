import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ScrollView } from 'react-native';
import Button from '../../../../components/ui/button';
import Input from '../../../../components/ui/input';
import styles from './styles';
import { Select } from "native-base";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Avatar } from 'react-native-paper';
import * as Yup from 'yup'
import { validatePassword } from '../../../../utils/passwordValidate';
import { useAuth } from '../../context/AuthContext';
import { CheckIcon } from 'lucide-react-native';
import DatePicker from '../../../../components/ui/datepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { jwtDecode } from 'jwt-decode';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email không được trống'),
    phone: Yup.string().required('Số điện thoại không được trống').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
    user_name: Yup.string().required('Tên tài khoản không được trống').
        min(8, 'Tên tài khoản phải ít nhất 8 kí tự').
        max(20, 'Tên tài khoản không được nhiều hơn 20 kí tự'),
    full_name: Yup.string().required('Họ và tên không được trống').min(8, 'Họ và tên phải ít nhất 8 kí tự')
        .max(20, 'Họ và tên không được nhiều hơn 20 kí tự'),
    // password: Yup.string().required('Mật khẩu không được trống').test(
    //     'validate-password',
    //     'Mật khẩu cần có tối thiểu 8 kí tự bao gồm chữ thường, chữ viết hoa, chữ số và kí tự đặc biệt.',
    //     validatePassword,
    //   ),
    //   re_password: Yup.string()
    //   .required('Nhập lại mật khẩu không được trống')
    //   .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
});

interface User {
    id: string;
    BuildingId: string;
}
const page = () => {
    const navigation = useNavigation();
    const { session } = useAuth();
    // Only for add Owner again
    const params = useLocalSearchParams();
    // const [password, setPassword] = useState("");
    // const [reEnterPassword, setReEnterPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState();
    const [dob, setDob] = useState(new Date());
    const user: User = jwtDecode(session as string);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const handlePhoneChange = (phone: string) => {
        setPhoneNumber(phone);
    };
    const handleEmailChange = (text: string) => {
        setEmail(text);
    };
    const [isLoading, setIsLoading] = useState(false);

    const createRoom = async (accountId: string) => {
        if (!user) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống! vui lòng thử lại sau',
            });
            return;
        }
        try {
            const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/create', {
                accountId: accountId,
                buildingId: user.BuildingId
            }, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            console.log(response.data)
            return response.data.data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi tạo tòa nhà! vui lòng thử lại sau',
                position: 'bottom'
            })
        }

    }

    // Update existed Room
    const updateRoom = async (accountId: string) => {
        if (!user) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống! vui lòng thử lại sau',
            });
            return;
        }
        try {
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/update/${params.roomId}`, {
                accountId: accountId,
                buildingId: user.BuildingId,
                roomNumber: params.roomNumber,
                roomArea: params.roomArea,
                numberOfResident: 0
            }, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            return response.data.data;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi cập nhập căn hộ! vui lòng thử lại sau',
                position: 'bottom'
            })
        }
    }

    // Create owner account for Existed Room
    const createAccountOwner = async () => {
        setError(null);
        setValidationErrors({});
        if (!user) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống! vui lòng thử lại sau',
            });
            return;
        }
        const bodyData = {
            building_id: user.BuildingId,
            phone: phoneNumber,
            full_name: fullName,
            user_name: username,
            role: 3,
            password: "String123@",
            email: email,
            avatar: ""
        }
        try {
            setIsLoading(true); // Set loading state to true
            await validationSchema.validate({
                phone: phoneNumber,
                full_name: fullName,
                user_name: username,
                email: email,
                gender: gender,
                dob: dob
            }, { abortEarly: false });
            const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/account/register', bodyData, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Thêm chủ căn hộ mới thành công',
                    position: 'bottom'
                })
                updateRoom(response.data.data);
                router.replace('/web/Receptionist/rooms/');
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Thêm chủ căn hộ mới không thành công',
                    position: 'bottom'
                })
            }
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: any = {};
                error.inner.forEach((err: any) => {
                    errors[err.path] = err.message;
                });
                setValidationErrors(errors);
            }
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            else {
                console.error('Error creating owner account:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi thêm tài khoản chủ căn hộ',
                    position: 'bottom'
                })
            }
        } finally {
            setIsLoading(false);
        }
    }
    // CREATE Account with Create Room
    const createAccount = async () => {
        setError(null);
        setValidationErrors({});
        if (!user) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống! vui lòng thử lại sau',
            });
            return;
        }
        const bodyData = {
            building_id: user.BuildingId,
            phone: phoneNumber,
            full_name: fullName,
            user_name: username,
            role: 3,
            password: "String123@",
            email: email,
            avatar: ""
        }
        console.log(bodyData)
        try {
            setIsLoading(true); // Set loading state to true
            await validationSchema.validate({
                phone: phoneNumber,
                full_name: fullName,
                user_name: username,
                // password:password,
                // re_password:reEnterPassword,
                email: email,
                gender: gender,
                dob: dob
            }, { abortEarly: false });
            const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/account/register', bodyData, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Tạo tài khoản thành công',
                    position: 'bottom'
                })
                createRoom(response.data.data);
                router.replace('/web/Receptionist/accounts/');
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Tạo tài khoản không thành công',
                    position: 'bottom'
                })
            }
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: any = {};
                error.inner.forEach((err: any) => {
                    errors[err.path] = err.message;
                });
                setValidationErrors(errors);
            }
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            else {
                console.error('Error creating account:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi tạo tài khoản',
                    position: 'bottom'
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
            {isLoading && <ActivityIndicator size={'large'} color={"#171717"}></ActivityIndicator>}
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Quay Lại"
                        onPress={() => router.back}
                    ></Button>
                    {/* <Button
                        style={{ width: 150, marginBottom: 20 }}
                        text="Tạo tài khoản bằng file excel"
                        onPress={() => router.push('/web/Receptionist/accounts/createExcel')}
                    ></Button> */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
                            Tạo thông tin tài khoản
                        </Text>
                        <Text>Thông tin tài khoản của chủ căn hộ</Text>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Tên
                        </Text>
                        <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 10, }}>Họ và tên không được trống.</Text>
                        <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 10, }}>Họ và tên tối thiểu 8 kí tự, tối đa 20 kí tự.</Text>
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
                        <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 10, }}>Tên tài khoản không được trống.</Text>
                        <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 10, }}>Tên tài khoản tối thiểu 8 kí tự, tối đa 20 kí tự.</Text>
                        <Input placeholder="Tên tài khoản" style={[{ width: "100%" }]}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                            }}></Input>
                        {validationErrors.user_name && (
                            <Text style={styles.errorText}>{validationErrors.user_name}</Text>
                        )}
                    </View>
                    {/* <View>
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
                    </View> */}
                    {/* <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Ngày, tháng, năm sinh
                        </Text>
                        <DatePicker
                selectedDate={dob}
                onDateChange={setDob}
            />    {validationErrors.dob && (
                            <Text style={styles.errorText}>{validationErrors.dob}</Text>
                        )}
                    </View>
                    <View>
                        <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                            Giới tính
                        </Text>
                        <Dropdown
                            style={styles.customInput}
                            placeholderStyle={{ fontSize: 14, }}
                            placeholder={"Chọn giới tính"}
                            data={Gender}
                            value={gender}
                            search={false}
                            labelField="label"
                            valueField="value"
                            onChange={(item: any) => {
                                setGender(item.value);
                            }}
                        ></Dropdown>
                            {validationErrors.gender && (
                            <Text style={styles.errorText}>{validationErrors.gender}</Text>
                        )}
                    </View> */}
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
                            placeholder="Số điện thoại"
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
                            onPress={params.roomId ? createAccountOwner : createAccount}
                        ></Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default page