import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import userAvatarStyles from "./styles/userAvatarScreen";
import Header from "../../../components/resident/header";
import { useTheme } from "../context/ThemeContext";
import { useSession } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../../../components/resident/loading";
import AlertWithButton from "../../../components/resident/AlertWithButton";
import {firebase} from '../../../config';
import 'firebase/compat/storage'; 
import { Type } from "lucide-react-native";
interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  roomId: string;
  avatar: string;
  buildingId:string;
  email:string;
  userName:string;
}
const UserAvatar = () => {
  const { theme } = useTheme();

  const { session } = useSession();
  const userId: any = jwtDecode(session as string);
  const { t } = useTranslation();
  const [user, setUser] = useState<User>();
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
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [success,setSuccess]= useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setError("");
      if (userId.Id) {
        setIsLoading(true);
        try {
          const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/account/get/${userId.Id}`, {
            timeout: 10000
          });
          if (response.data.statusCode == 200) {
            setUser(response.data.data);
          }
          else {
            setShowError(true);
            setError(t("Failed to return requests") + ".");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setShowError(true);
            setError(t("System error please try again later") + ".");
            return;
          }
          console.error('Error fetching reservations:', error);
          setShowError(true);
          setError(t('Failed to return requests') + ".");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchItems();
  }, [session]);

  const [uploading, setUploading] = useState(false);
  const uploadImage = async (uri:string) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `avatars/${userId.Id}_${new Date().getTime()}`;
      const ref = firebase.storage().ref().child(fileName);
      const snapshot = await ref.put(blob);
      const downloadURL = await snapshot.ref.getDownloadURL();
      updateUserAvatar(downloadURL); 
    }catch(error){
      console.error('Error uploading image:', error);
      setShowError(true);
      setError(t("System error please try again later") + ".");
    }finally{
      setUploading(false);
      setSuccess(true);
    }
};
  const updateUserAvatar = async (url: string) => {
    try {
      const updateResponse = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/account/update/${user?.id}`, {
        building_id: user?.buildingId,
        phone: user?.phoneNumber,
        email: user?.email,
        user_name: user?.userName,
        role: 3,
        full_name: user?.fullName,
        avatar: url
      },{
        timeout: 10000,
      headers:{
        'Authorization': `Bearer ${session}`,
      }
      });
        if (updateResponse.data.statusCode === 200) {
        setUser(updateResponse.data.data);
      } else {
        setShowError(true);
        setError(t("System error please try again later") + ".");
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred. Please try again.');
    } 
    finally{
    }
  };
  return (
    <>
      <LoadingComponent loading={isLoading}></LoadingComponent>
      <LoadingComponent loading={uploading}></LoadingComponent>
      <AlertWithButton 
      title={t("Success")}
      visible={success}
      content={t("Update avatar successfully")}
      onClose={() => setSuccess(false)}
      ></AlertWithButton>
      <AlertWithButton
        title={t("Error")}
        visible={showError}
        content={error} onClose={() => setShowError(false)}></AlertWithButton>
      <Header headerTitle="Thông tin người dùng"></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ 
                uri: user && user.avatar ? user.avatar : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Atlantic_near_Faroe_Islands.jpg/800px-Atlantic_near_Faroe_Islands.jpg" }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 65,
                }}
              />
            </TouchableOpacity>
            <Text style={{ marginTop: 10 }}>Đổi ảnh đại diện</Text>
          </View>
          <View style={userAvatarStyles.personalInformation}>
            <Text style={userAvatarStyles.headerText}>Thông tin cá nhân</Text>
            <View style={userAvatarStyles.informationBox}>
              <View style={userAvatarStyles.informationContainer}>
                <Text>Họ và tên</Text>
                <Text style={userAvatarStyles.userName}>{user?.fullName}</Text>
              </View>
              <View style={userAvatarStyles.informationContainer}>
                <Text>Ngày sinh</Text>
                <Text style={userAvatarStyles.userName}>21/02/1992</Text>
              </View>
              <View style={userAvatarStyles.informationContainer}>
                <Text>Số điện thoại</Text>
                <Text style={userAvatarStyles.userName}>{user?.phoneNumber}</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default UserAvatar;
