import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Input,
  Select,
  CheckIcon,
  Center,
  Divider,
  Pressable,
  FormControl,
  ScrollView,
} from 'native-base';

import * as ImagePicker from "expo-image-picker";
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { Key, KeySquare, Settings, Upload, User } from 'lucide-react-native';
import { SHADOWS } from '../../../constants';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {firebase} from '../../../config';
import * as yup from 'yup';
import { router } from 'expo-router';
interface User{
  Id: string;
  BuildingId:string;
}
interface FetchUser{
  id: string;
  userName: string;
  fullName: string;
  email: string;
  avatar: string;
  buildingId:string;
  phoneNumber:string;
  role:number;
}
const formSchema = yup.object().shape({
  userName: yup.string().required('Tên người dùng là bắt buộc'),
  fullName: yup.string().required('Họ và tên là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
});
const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState('accountDetails');

  const {session} = useAuth();
  const userInfo:User = jwtDecode(session as string);
  const [user, setUser] = useState<FetchUser>();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading]=useState(false); 
  const [image, setImage]= useState<any>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/account/get/${userInfo.Id}`);
        if(response.data.statusCode==200){
          setUser(response.data.data);
          setUserName(response.data.data.userName);
          setEmail(response.data.data.email);
          setFullName(response.data.data.fullName);
          setImage(response.data.data.avatar);
        }
        else{
          Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Lỗi',
              text2: 'Không thể lấy thông tin người dùng',
              autoHide: true,
          })
        }
      } catch (error) {
          Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Lỗi',
              text2: 'Không thể lấy thông tin người dùng',
              autoHide: true,
          })
        console.error("Error fetching user info:", error);
      }
    }
  fetchUser();
    
  }, [session])
  //pick image
  const pickImage = async () => {
    const options: any = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowEditing: true,
      aspect: [4, 3],
      quality: 1,
    };

    try {
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        // uploadImage(result.assets[0].uri);
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể chọn ảnh',
        autoHide: true,
      })
    } finally {
    }
  };
  const uploadImage = async (uri:string) => {
    try {
    setLoading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `avatars/${userInfo.Id}_${new Date().getTime()}`;
      const ref = firebase.storage().ref().child(fileName);
      const snapshot = await ref.put(blob);
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
    }catch(error){
      console.error('Error uploading image:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể tải ảnh lên',
        autoHide: true,
      });
    }finally{
      setLoading(false);
    }
};
  const updateUser = async () => {
    let uri = image;
  
  // Only attempt to upload if an image has been selected
  if (image && typeof image === 'string' && image !== user?.avatar) {
    const uploadUri = await uploadImage(image);
    if (!uploadUri) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể cập nhật ảnh đại diện',
        autoHide: true,
      });
      return;
    }
    uri = uploadUri;
  }
    try {
      await formSchema.validate({
        userName: userName,
        fullName: fullName,
        email: email
      }, { abortEarly: false });
      setErrors({});
      console.log({
        userName: userName,
        fullName: fullName,
        email: email,
        avatar: uri,
        building_id: userInfo.BuildingId,
        phone: user?.phoneNumber,
        role: 2,
      })
      console.log(userInfo.Id)
      const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/account/update/${userInfo.Id}`, {
        user_name: userName,
        full_name: fullName,
        email: email,
        avatar: uri,
        building_id: userInfo.BuildingId,
        phone: user?.phoneNumber,
        role: 2,
      },{
        headers: {
          'Authorization': `Bearer ${session}`
        }
      });
      console.log(response);
      if(response.data.statusCode==200){
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Thành công',
          text2: 'Cập nhật thông tin thành công',
          autoHide: true,
        });
        router.replace('/web/Receptionist/profile')
      }
      else{
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Lỗi',
          text2: 'Không thể cập nhật thông tin',
          autoHide: true,
        });
      }
    } catch (error:any) {
      if (error.name === 'ValidationError') {
        const errors:any = {};
        error.inner.forEach((err: any) => {
          errors[err.path] = err.message;
        });
        setErrors(errors);
      }
      console.error('Error updating user:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể cập nhật thông tin',
        autoHide: true,
      });
    }
  }

  const renderContent = () => {
    switch (selectedTab) {
      case 'accountDetails':
        return (
          <VStack space={4} alignItems="start" p={5}>
             <HStack space={2} alignItems={'center'}>
              <Settings size={25} color={'green'}></Settings>
              <Text fontSize={22}>Thông tin chung</Text>
            </HStack>
            <HStack alignItems={'center'} marginY={5}>
              <Avatar
                borderWidth={3}
                borderColor={'#6B7280'}
                size="xl"
                source={image ? { uri: image } : require('../../../assets/images/icon.png')}>
                <Button size="sm" onPress={() => { }}>Upload Avatar</Button>
              </Avatar>
              <VStack marginLeft={5}>
                <TouchableOpacity onPress={pickImage}>
                  <HStack space={1} borderColor={'#191919'}
                    borderWidth={1}
                    padding={2}
                    alignItems={'center'}
                    borderRadius={'lg'}>
                    <Upload color={'#191919'} size={15}></Upload>
                    <Text fontSize={14} color={'191919'}>Tải avatar</Text>
                  </HStack>
                </TouchableOpacity>
                <Text fontWeight={'medium'} color={'muted.400'} fontSize={10}>
                  Định dạng ảnh: JPG, PNG.
                </Text>
              </VStack>
            </HStack>
            <HStack space={3} alignItems="center" width="100%">
              <FormControl isRequired width="50%">
                <FormControl.Label>Tên người dùng</FormControl.Label>
                <Input
                  value={userName || ""}
                  onChangeText={setUserName}
                />
                {errors.userName  && (
                            <Text style={styles.errorText}>{errors.userName}</Text>
                        )}
              </FormControl>
              <FormControl isRequired width="50%">
                <FormControl.Label>Họ và tên</FormControl.Label>
                <Input
                  value={fullName || ""}
                  onChangeText={setFullName}
                />

                {errors.fullName && (
                            <Text style={styles.errorText}>{errors.fullName}</Text>
                        )}
              </FormControl>
            </HStack>
            <HStack space={3} alignItems="center" width="100%">
            <FormControl isRequired width="50%">
              <FormControl.Label>Địa chỉ email</FormControl.Label>
              <Input
  value={email || ""}
  onChangeText={setEmail}
/>
               {errors.email  && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
            </FormControl>
            <FormControl isReadOnly width="50%">
              <FormControl.Label>Số điện thoại</FormControl.Label>
              <Input
                isReadOnly
                placeholder="Phone Number"
              value={user?.phoneNumber}
              />
            </FormControl>
            </HStack>
            <Button 
            onPress={updateUser}
            marginTop={5}
            bgColor={'#191919'}>Lưu thay đổi</Button>
            {loading && <ActivityIndicator size={'large'}
            color={'#191919'}
            ></ActivityIndicator>}
          </VStack>
        );
      case 'changePassword':
        return (
          <VStack space={4} alignItems="start" p={5}>
             <HStack space={2} alignItems={'center'}>
              <KeySquare size={25} color={'green'}></KeySquare>
              <Text fontSize={22}>Đổi mật khẩu</Text>
            </HStack>
            <FormControl isRequired>
              <FormControl.Label>Mật khẩu hiện tại</FormControl.Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                // value={userInfo.currentPassword}
                // onChangeText={(value) => setUserInfo({ ...userInfo, currentPassword: value })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>Mật khẩu mới</FormControl.Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                // value={userInfo.newPassword}
                // onChangeText={(value) => setUserInfo({ ...userInfo, newPassword: value })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>Nhập lại mật khẩu</FormControl.Label>
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                // value={userInfo.newPassword}
                // onChangeText={(value) => setUserInfo({ ...userInfo, newPassword: value })}
              />
            </FormControl>
            <Button marginTop={5} bgColor={'#191919'} onPress={() => {/* Handle password change */}}>
              Đổi mật khẩu
            </Button>
          </VStack>
        );
      default:
        return null;
    }
  };

  return (
    
    <Center
      style={styles.container}>
      <HStack space={10} alignItems="start" style={[styles.content]}
      >
        {/* Left Side Tab Selection */}
        <Box width="30%" borderRadius="md" style={SHADOWS.medium}
          padding={10} backgroundColor={'white'}>
          <HStack space={2} paddingBottom={2} alignItems={'center'}>
            <Settings size={20} color={'#191919'} />
            <Text fontWeight={'600'} fontSize={20}>Thông tin tài khoản</Text>
          </HStack>
          <Divider my="1"></Divider>
          <VStack space={4} paddingTop={5}>
            <HStack alignItems="center">
              {/* <User size={30} color={selectedTab === 'accountDetails' ? '#333' : '#6B7280'}/> */}
              <Pressable onPress={() => setSelectedTab('accountDetails')} flexDirection="row" alignItems="center">
                <Text paddingLeft={2}
                  fontWeight={'medium'}
                  fontSize={18}
                  color={selectedTab === 'accountDetails' ? '#333' : '#6B7280'}>Chi tiết tài khoản</Text>
              </Pressable>
            </HStack>
            <Pressable onPress={() => setSelectedTab('changePassword')} flexDirection="row" alignItems="center">
              <Text
                fontWeight={'medium'}
                fontSize={18}
                paddingLeft={2} color={selectedTab === 'changePassword' ? '#333' : '#6B7280'}>Đổi mật khẩu</Text>
            </Pressable>
          </VStack>
        </Box>

        {/* Right Side Content */}
        <Box flex={1} borderRadius="md" style={SHADOWS.medium}
          backgroundColor={'white'} padding={5}>
          {renderContent()}
        </Box>
      </HStack>
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 50
  },
  content: {
    width: '80%', // Ensure the HStack takes up the full width
  },
  errorText: {
    color: 'red',
    fontSize: 14,
},
});

export default ProfilePage;
