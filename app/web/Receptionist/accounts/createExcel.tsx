import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useNavigation } from 'expo-router';
import { ScrollView,Platform  } from 'react-native';
import Button from '../../../../components/ui/button';
import Input from '../../../../components/ui/input';
import styles from './styles';
import { Box, HStack, Icon, Select, VStack } from "native-base";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Avatar } from 'react-native-paper';
import * as Yup from 'yup'
import { validatePassword } from '../../../../utils/passwordValidate';
import { useAuth } from '../../context/AuthContext';
import { CheckIcon, Download, Upload } from 'lucide-react-native';
import DatePicker from '../../../../components/ui/datepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { jwtDecode } from 'jwt-decode';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system'; 
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';

  interface User{
    id: string;
    BuildingId:string;
  }

  interface File {
    name: string;
    uri: string;
    type?: string | null;
    size?: number;
  }

  
const page = () => {
    const navigation = useNavigation();
    const { session } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState();
    const [dob, setDob] = useState(new Date());
    const user:User = jwtDecode(session as string);
  
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
      setDownloading(true);
  
      try {
        const fileUrl = 'https://firebasestorage.googleapis.com/v0/b/abms-47299.appspot.com/o/import-account.xlsx?alt=media&token=c3c6a100-aecf-4935-8fb1-3f467c3589dd';
  
          const response = await Linking.openURL(fileUrl);
          console.log(response);
      } catch (error) {
        console.error(error);
        Toast.show({
            type: 'error',
            text1: 'Lỗi hệ thống',
            text2: 'Không thể tải xuống file',
        }); 
      } finally {
        setDownloading(false);
      }
    };

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [fileInfo, setFileInfo] = React.useState();

    const pickDocument = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({type: "*/*"});
        console.log(result);
        return result;
      } catch (err) {
          console.log('User canceled the picker' + err);
      }
       
        // const formData = new FormData();
        // formData.append('file', blob, fileName);
        // formData.append('role', "3");
        // formData.append('buildingId', user.BuildingId);
      
        // Axios call to your backend
        // try {
        //   const response = await axios.post('https://abmscapstone2024.azurewebsites.net/api/v1/account/import-data', formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   });
        //   console.log('File uploaded successfully:', response.data);
        // } catch (error) {
        //   console.error('File upload failed:', error);
        // }
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
            {downloading && <ActivityIndicator size={'large'} color={"#171717"}></ActivityIndicator>} 
            <SafeAreaView style={{flex:1}}>
                <ScrollView style={{flex:1}}>
                    <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Quay Lại"
                        onPress={() => router.push('/web/Receptionist/accounts/')}
                    ></Button>
                        <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
                            Tạo thông tin tài khoản
                        </Text>
                        <Text>Thông tin tài khoản của chủ căn hộ</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={handleDownload}>
                            <HStack space={2} alignItems={'center'}
                                backgroundColor={'#191919'} width={150} borderRadius={10}
                                padding={2}>
                                <Download color="white" />
                                <Text style={{ color: 'white' }}>Tải xuống file template</Text>
                            </HStack>
                        </TouchableOpacity>
                        <VStack space={4} alignItems="flex-start" marginY={5}>
                        <Text>Lễ tân tải xuống file template để chỉnh sửa, thông tin phải được ghi đúng dòng</Text>
                            <HStack space={2} alignItems="center">
                                <Icon as={<MaterialIcons name="phone" />} size="sm" />
                                <Text>Phone Number: số điện thoại của cư dân</Text>
                            </HStack>

                            <HStack space={2} alignItems="center">
                                <Icon as={<MaterialIcons name="lock" />} size="sm" />
                                <Text>Password: mật khẩu của cư dân</Text>
                            </HStack>

                            <HStack space={2} alignItems="center">
                                <Icon as={<MaterialIcons name="account-circle" />} size="sm" />
                                <Text>User Name: Tên người dùng của cư dân</Text>
                            </HStack>

                            <HStack space={2} alignItems="center">
                                <Icon as={<MaterialIcons name="email" />} size="sm" />
                                <Text>Email: Địa chỉ email của cư dân</Text>
                            </HStack>

                            <HStack space={2} alignItems="center">
                                <Icon as={<MaterialIcons name="person" />} size="sm" />
                                <Text>Full Name: Họ tên đầy đủ của cư dân</Text>
                            </HStack>
                            <TouchableOpacity onPress={pickDocument}>
                            <HStack space={2} alignItems={'center'}
                                backgroundColor={'#191919'} width={150} borderRadius={10}
                                padding={2}>
                                <Upload color="white" />
                                <Text style={{ color: 'white' }}>Tải lên file excel</Text>
                            </HStack>
                        </TouchableOpacity>
                        </VStack>
                    </View>

                     <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Button text="Tạo tài khoản" style={[{ width: 130, backgroundColor: '#276749' },
                        ]}
                            onPress={()=>{}}
                        ></Button>
                    </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
    );
};

export default page