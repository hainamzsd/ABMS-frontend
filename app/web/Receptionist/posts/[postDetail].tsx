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
import { firebase } from '../../../../config';
import { postSchema } from '../../../../constants/schema';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import 'firebase/storage';
const PostDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<any>();
  const [firstImage, setFirstImage] = useState<any>();
  const [type, setType] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const navigation = useNavigation();
  const item = useLocalSearchParams();
  const { session } = useAuth();
  const user: user = jwtDecode(session as string)

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

  const uploadImage = async (uri: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `posts/${title}_${new Date().getTime()}`;
      const ref = firebase.storage().ref().child(fileName);
      const snapshot = await ref.put(blob);
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể tải ảnh lên',
        autoHide: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/post/getPostId/${item?.postDetail}`, {
        timeout: 10000,
      });
      if (response.data.statusCode === 200) {
        setContent(response.data.data.content);
        setTitle(response.data.data.title);
        setImage(response.data.data.image);
        setType(response.data.data.type);
        setFirstImage(response.data.data.image);
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
    let uri = image;
    // console.log(uri);

    // Check if image is different from the default URI
    const isNewImage = uri !== firstImage;

    // Only attempt to upload if an image has been selected
    if (isNewImage) {
      const uploadUri = await uploadImage(image);
      if (!uploadUri) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Lỗi',
          text2: 'Không thể cập nhật ảnh',
          autoHide: true,
        });
        return;
      }
      uri = uploadUri;
    }
    setIsLoading(true);
    const bodyData = {
      title: title,
      buildingId: user?.BuildingId,
      content: content,
      image: uri,
      type: type
    }
    try {
      await postSchema.validate({ title: title, content: content, image: uri, type: type }, { abortEarly: false })
      const response = await axios.put(`${API_BASE}/${actionController.POST}/update/${item?.postDetail}`, bodyData, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      });
      if (response.data.statusCode === 200) {
        ToastSuccess('Cập nhật bài viết thành công')
      } else {
        ToastFail('Cập nhật bài viết không thành công')
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
        ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
      } else {
        console.error('Error updating post data:', error);
        ToastFail('Lỗi Cập nhật bài viết')
      }
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
      if (response.data.statusCode === 200) {
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

  return (
    <View style={{ padding: SIZES.x30, flex: 1, backgroundColor: "#F9FAFB" }}>
      <SafeAreaView >
        <ScrollView>
          {/* Header */}
          <Button
            style={{ width: 100, marginBottom: 20 }}
            text="Quay Lại"
            onPress={() => router.push({
              pathname: '/web/Receptionist/posts/'
            })}
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
                {validationErrors.title && (
                  <Text style={{
                    color: 'red',
                    fontSize: 14
                  }}>{validationErrors.title}</Text>
                )}
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
                {validationErrors.content && (
                  <Text style={{
                    color: 'red',
                    fontSize: 14
                  }}>{validationErrors.content}</Text>
                )}
              </FormControl>
              <FormControl mb="3" isRequired>
                <FormControl.Label>Thể loại</FormControl.Label>
                <Select selectedValue={`${type}`} onValueChange={itemValue => setType(itemValue)} minWidth="200" accessibilityLabel="Chọn thể loại" placeholder="Chọn thể loại" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />
                }} mt="1" >
                  <Select.Item label="Bài viết" value="1" />
                  <Select.Item label="Thông báo" value="2" />
                </Select>
                {validationErrors.type && (
                  <Text style={{
                    color: 'red',
                    fontSize: 14
                  }}>{validationErrors.type}</Text>
                )}
                {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Bắt buộc chọn thể loại
                                </FormControl.ErrorMessage> */}
              </FormControl>
              <FormControl mb="3">
                <ButtonBase onPress={pickImage} leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                  Tải lên
                </ButtonBase>
                <Image mt={2} source={{ uri: image }} size="md" />
              </FormControl>

              <FormControl>
                <Divider mt={1} />

                {isLoading && <ActivityIndicator style={{ paddingVertical: SIZES.xSmall }} size={'small'} color={'#171717'}></ActivityIndicator>}

                <ButtonBase.Group space={2} style={{ flexDirection: 'row', justifyContent: 'center' }} mt={3}>
                  <ButtonBase colorScheme="danger" onPress={handleDeletePost}>Xoá bài viết</ButtonBase>
                  <ButtonBase colorScheme="success" onPress={handleUpdatePost}> Cập nhật bài viết </ButtonBase>
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