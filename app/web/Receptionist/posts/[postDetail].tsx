import React, { useEffect, useState } from 'react'
import { Box, Text, FormControl, Input, Divider, TextArea, Image, Button as ButtonBase, Icon } from "native-base";
import { View, SafeAreaView, ScrollView } from 'react-native';
import { SIZES, icons } from '../../../../constants';
import Button from '../../../../components/ui/button';
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const PostDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const item = useLocalSearchParams();

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/post/getPostId/${item?.postDetail}`, {
        timeout: 10000,
      });
      if (response.status === 200) {
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
          // onPress={() => console.log(navigation.canGoBack())}
          ></Button>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 30, marginBottom: 5 }}>
              Thông tin bài viết
            </Text>
            <Text>Thông tin chi tiết về bài viết <Text fontSize="md" italic>"{title}"</Text></Text>
            <Divider mt={2} />
          </View>

          {/* Main content */}
          <View>
            <Box>
              <FormControl mb="3">
                <FormControl.Label>Tiêu đề bài viết</FormControl.Label>
                <Input shadow={1} value={title} />
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
              {image ? <> <ButtonBase onPress={handleChoosePhoto} leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                Upload
              </ButtonBase>
                <Image mt={2} source={{ uri: image }} size="md" /></> :
                <FormControl mb="3">
                  <ButtonBase onPress={handleChoosePhoto} leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                    Tải lên
                  </ButtonBase>
                </FormControl>
              }
            </Box>
          </View>

          <View style={{ borderWidth: 1, marginVertical: SIZES.medium, opacity: 0.5}}></View>
          <View style={{ flexDirection: 'row', gap: SIZES.medium, justifyContent: 'center', alignItems: 'center' }}>
            <ButtonBase colorScheme="success">Cập nhập bài viết</ButtonBase>
            <ButtonBase colorScheme="danger">Huỷ bỏ</ButtonBase>
          </View>
          {/* Footer */}

        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default PostDetail