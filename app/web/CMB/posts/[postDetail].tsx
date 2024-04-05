import React, { useEffect, useState } from 'react'
import { Box, Text, FormControl, Input, Divider, TextArea, Image, Button as ButtonBase, Icon, Select, CheckIcon } from "native-base";
import { View, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, icons } from '../../../../constants';
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

const PostDetail = () => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<any>();
  const [type, setType] = useState("");
  const [firstImage, setFirstImage] = useState("");

  // Others
  const navigation = useNavigation();
  const item = useLocalSearchParams();
  const { session } = useAuth();
  const user: user = jwtDecode(session as string)

  // GET: Post Detail
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


  // PUT: Approve Post
  const handleApprovePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${API_BASE}/${actionController.POST}/approve/${item?.postDetail}?status=1`, {}, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      });
      if (response.data.statusCode === 200) {
        ToastSuccess('Phê duyệt bài viết thành công')
        router.push({ pathname: `/web/CMB/posts/` })
      } else {
        ToastFail('Phê duyệt bài viết không thành công')
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
      }
      console.error('Error deleting post data:', error);
      ToastFail('Lỗi phê duyệt bài viết')
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  // PUT: Approve Post
  const handleDisapprovePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${API_BASE}/${actionController.POST}/approve/${item?.postDetail}?status=4`, {}, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      });
      if (response.data.statusCode === 200) {
        ToastSuccess('Từ chối phê duyệt bài viết thành công')
        router.push({ pathname: `/web/CMB/posts/` })
      } else {
        ToastFail('Từ chối phê duyệt bài viết không thành công')
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
      }
      console.error('Error deleting post data:', error);
      ToastFail('Lỗi từ chối phê duyệt bài viết')
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
              pathname: '/web/CMB/posts/'
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
                <Input backgroundColor={COLORS.buttonDisable}
                  isReadOnly shadow={1} value={title} />
              </FormControl>
              <FormControl mb="3">
                <FormControl.Label>Nội dung bài viết</FormControl.Label>
                <TextArea
                  backgroundColor={COLORS.buttonDisable}
                  isReadOnly
                  shadow={1}
                  totalLines={5}
                  autoCompleteType={""}
                  value={content}
                  w="100%" maxW="100%" />
              </FormControl>
              <FormControl mb="3" isRequired>
                <FormControl.Label>Thể loại</FormControl.Label>
                <Input backgroundColor={COLORS.buttonDisable}
                  isReadOnly shadow={1} value={`${type}` === '1' ? "Bài viết" : "Thông báo"} />
              </FormControl>
              <Image mt={2} mb={1} source={{ uri: image }} size="xl" />
              <FormControl>
                <Divider mt={1} />

                {isLoading && <ActivityIndicator style={{ paddingVertical: SIZES.xSmall }} size={'small'} color={'#171717'}></ActivityIndicator>}

                <ButtonBase.Group space={2} style={{ flexDirection: 'row', justifyContent: 'center' }} mt={3}>
                  <ButtonBase colorScheme="danger" onPress={handleDisapprovePost}>Từ chối phê duyệt</ButtonBase>
                  <ButtonBase colorScheme="success" onPress={handleApprovePost}> Phê duyệt </ButtonBase>
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