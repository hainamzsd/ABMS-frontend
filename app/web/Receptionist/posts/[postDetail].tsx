import React, { useEffect, useState } from 'react'
import { Box, Text, FormControl, Input, Divider, TextArea, Image, Button as ButtonBase, Icon, Select, CheckIcon } from "native-base";
import { View, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { SIZES, icons } from '../../../../constants';
import Button from '../../../../components/ui/button';
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_BASE, actionController } from '../../../../constants/action';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { user } from '../../../../interface/accountType';
import { ToastFail, ToastSuccess } from '../../../../constants/toastMessage';

const PostDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");

  const navigation = useNavigation();
  const item = useLocalSearchParams();
  const { session } = useAuth();
  const user: user = jwtDecode(session as string)

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/post/getPostId/${item?.postDetail}`, {
        timeout: 10000,
      });
      if (response.status === 200) {
        console.log(response.data.data);
        setContent(response.data.data.content);
        setTitle(response.data.data.title);
        setImage(response.data.data.image);
        setType(response.data.data.type);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi lấy thông tin bài viết',
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
      console.error('Error fetching post data:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi lấy thông tin bài viết',
        position: 'bottom'
      })
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  // UPDATE: Post
  const handleUpdatePost = async () => {
    setIsLoading(true);
    const bodyData = {
      title: title,
      buildingId: user?.BuildingId,
      content: content,
      image: image,
      type: type
    }
    try {
      const response = await axios.put(`${API_BASE}/${actionController.POST}/update/${item?.postDetail}`, bodyData, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      });
      if (response.status === 200) {
        ToastSuccess('Cập nhập bài viết thành công')
      } else {
        ToastFail('Cập nhập bài viết không thành công')
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
      }
      console.error('Error updating post data:', error);
      ToastFail('Lỗi cập nhập bài viết')
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  // DELETE: POST
  const handleDeletePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${API_BASE}/${actionController.POST}/delete/${item?.postDetail}`, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      });
      if (response.status === 200) {
        ToastSuccess('Xoá bài viết thành công')
        router.push({ pathname: `/web/Receptionist/posts/` })
      } else {
        ToastFail('Xoá bài viết không thành công')
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
      }
      console.error('Error deleting post data:', error);
      ToastFail('Lỗi xoá bài viết')
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }

  }

  useEffect(() => {
    fetchPost();
  }, [])

  const handleChoosePhoto = () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
  }

  return (
    <View style={{ padding: SIZES.x30, flex: 1, backgroundColor: "#F9FAFB" }}>
      <SafeAreaView >
        <ScrollView>
          {/* Header */}
          <Button
            style={{ width: 100, marginBottom: 20 }}
            text="Quay Lại"
            onPress={() => navigation.goBack()}
          ></Button>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 30, marginBottom: 5 }}>
              Thông tin bài viết
            </Text>
            <Text>Thông tin chi tiết về bài viết <Text fontSize="md" italic>"{title}"</Text></Text>
          </View>

          {/* Main content */}
          <View>
            <Box>
              <FormControl mb="3">
                <FormControl.Label>Tiêu đề bài viết</FormControl.Label>
                <Input shadow={1} value={title} onChangeText={(text) => setTitle(text)} />
              </FormControl>
              <FormControl mb="3">
                <FormControl.Label>Nội dung bài viết</FormControl.Label>
                <TextArea
                  shadow={1}
                  totalLines={5}
                  autoCompleteType={""}
                  value={content}
                  onChangeText={text => setContent(text)} // for android and ios
                  w="100%" maxW="100%" />
              </FormControl>
              <FormControl mb="3" isRequired>
                <FormControl.Label>Thể loại</FormControl.Label>
                <Select selectedValue={`${type}`} onValueChange={itemValue => setType(itemValue)} minWidth="200" accessibilityLabel="Chọn thể loại" placeholder="Chọn thể loại" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />
                }} mt="1" >
                  <Select.Item label="UX Research" value="1" />
                  <Select.Item label="Web Development" value="2" />
                  <Select.Item label="Cross Platform Development" value="3" />
                </Select>
                {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Bắt buộc chọn thể loại
                                </FormControl.ErrorMessage> */}
              </FormControl>
              {/* {image ? <> <ButtonBase onPress={handleChoosePhoto} leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                Upload
              </ButtonBase>
                <Image mt={2} source={{ uri: image }} size="md" /></> :
                <FormControl mb="3">
                  <ButtonBase onPress={handleChoosePhoto} leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                    Tải lên
                  </ButtonBase>
                </FormControl>
              } */}
              <FormControl mb="3">
                <ButtonBase onPress={handleChoosePhoto} leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                  Upload
                </ButtonBase>
                <Image mt={2} source={{ uri: image }} size="md" />
              </FormControl>
              <FormControl>
                <Divider mt={1} />

                {isLoading && <ActivityIndicator style={{ paddingVertical: SIZES.xSmall }} size={'small'} color={'#171717'}></ActivityIndicator>}

                <ButtonBase.Group space={2} style={{ flexDirection: 'row', justifyContent: 'center' }} mt={3}>
                  <ButtonBase colorScheme="danger" onPress={handleDeletePost}>Xoá bài viết</ButtonBase>
                  <ButtonBase colorScheme="success" onPress={handleUpdatePost}> Cập nhập bài viết </ButtonBase>
                </ButtonBase.Group>
              </FormControl>
            </Box>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View >
  )
}

export default PostDetail