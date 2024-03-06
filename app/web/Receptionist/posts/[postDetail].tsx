import React, { useState } from 'react'
import { Box, Text, FormControl, Input, Divider, TextArea, Image, Button as ButtonBase, Icon } from "native-base";
import { View, SafeAreaView, ScrollView } from 'react-native';
import { SIZES, icons } from '../../../../constants';
import Button from '../../../../components/ui/button';
import * as ImagePicker from "expo-image-picker"
import { usePathname, useGlobalSearchParams } from 'expo-router';
import { posts } from '../../../../constants/fakeData';
import { Ionicons } from "@expo/vector-icons";

const PostDetail = () => {
  const [content, setContent] = useState(posts[0].content);
  const [title, setTitle] = useState(posts[0].title);
  const [image, setImage] = useState(posts[0].imageUrl ? posts[0].imageUrl : null);
  const { postDetail } = useGlobalSearchParams();

  const handleChoosePhoto = () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    console.log(result);
    // console.log(postDetail)
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
            <Text>Thông tin chi tiết về bài viết <Text fontSize="md" italic>{title}</Text></Text>
            <Divider mt={2} />
          </View>

          {/* Main content */}
          <View>
            <Box>
              <FormControl mb="3">
                <FormControl.Label>Project Title</FormControl.Label>
                <Input shadow={1} value={title} />
              </FormControl>
              <FormControl mb="3">
                <FormControl.Label>Content</FormControl.Label>
                <TextArea
                  shadow={1}
                  totalLines={5}
                  autoCompleteType={""}
                  value={content}
                  onChangeText={text => setContent(text)} // for android and ios
                  w="100%" maxW="100%" />
              </FormControl>
              {image ? <> <ButtonBase leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                Upload
              </ButtonBase>
                <Image mt={2} source={{ uri: image }} size="md" /></> :
                <FormControl mb="3">
                  <ButtonBase leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                    Upload
                  </ButtonBase>
                </FormControl>
              }
            </Box>
          </View>

          {/* Footer */}

        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default PostDetail