import React, { useState } from 'react'
import { Box, Text, FormControl, Input, Divider, TextArea, Icon, Button as ButtonBase } from "native-base";
import { View, SafeAreaView, ScrollView, Button as ButtonNative } from 'react-native';
import { SIZES } from '../../../../constants';
import Button from '../../../../components/ui/button';
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons";

const CreatePost = () => {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);

    const handleChoosePhoto = () => {
        let result = ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        console.log(result);
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
                            Tạo bài viết
                        </Text>
                        <Divider mt={1} />
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
                                    onChangeText={text => setContent(text)}
                                    w="100%" maxW="100%" />
                            </FormControl>
                            <FormControl mb="3">
                                <ButtonBase leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                                    Upload
                                </ButtonBase>
                            </FormControl>
                        </Box>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default CreatePost