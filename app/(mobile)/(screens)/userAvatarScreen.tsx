import React, { useState } from "react";
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

const UserAvatar = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | undefined>(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiGAdWpsJQwrcEtjaAxG-aci3VxO7n2qYey0tI9Syx4Ai9ziAUea6-dAjlaGmRUNQW-Lo&usqp=CAU",
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result?.assets[0]?.uri);
    }
  };

  return (
    <>
      <Header headerTitle="Thông tin người dùng"></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <TouchableOpacity onPress={pickImage}>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 65,
                  }}
                />
              )}
            </TouchableOpacity>
            <Text style={{ marginTop: 10 }}>Đổi ảnh đại diện</Text>
          </View>
          <View style={userAvatarStyles.personalInformation}>
            <Text style={userAvatarStyles.headerText}>Thông tin cá nhân</Text>
            <View style={userAvatarStyles.informationBox}>
              <View style={userAvatarStyles.informationContainer}>
                <Text>Họ và tên</Text>
                <Text style={userAvatarStyles.userName}>Hoa La Canh</Text>
              </View>
              <View style={userAvatarStyles.informationContainer}>
                <Text>Ngày sinh</Text>
                <Text style={userAvatarStyles.userName}>21/02/1992</Text>
              </View>
              <View style={userAvatarStyles.informationContainer}>
                <Text>Số điện thoại</Text>
                <Text style={userAvatarStyles.userName}>1023425324</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default UserAvatar;
