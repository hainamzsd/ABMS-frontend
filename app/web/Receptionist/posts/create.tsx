import React, { useState } from 'react'
import { Box, Text, FormControl, Input, Divider, TextArea, Icon, Button as ButtonBase, Select, CheckIcon, WarningOutlineIcon, Image } from "native-base";
import { View, SafeAreaView, ScrollView, Button as ButtonNative, ActivityIndicator } from 'react-native';
import { SIZES } from '../../../../constants';
import Button from '../../../../components/ui/button';
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from 'expo-router';
import axios from 'axios';
import { API_BASE, actionController } from '../../../../constants/action';
import { useAuth } from '../../context/AuthContext';
import { user } from '../../../../interface/accountType';
import { jwtDecode } from 'jwt-decode';
import { ToastFail, ToastSuccess } from '../../../../constants/toastMessage';
import Toast from 'react-native-toast-message';
import { firebase } from '../../../../config';

const CreatePost = () => {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const { session } = useAuth();
    const user: user = jwtDecode(session as string)
    const navigation = useNavigation();

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
            console.log(downloadURL);
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


    const handleCreatePost = async () => {
        let uri = image;
        // Only attempt to upload if an image has been selected
        if (image && typeof image === 'string') {
            const uploadUri = await uploadImage(image);
            if (!uploadUri) {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Lỗi',
                    text2: 'Không thể thêm ảnh',
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
            const response = await axios.post(`${API_BASE}/${actionController.POST}/create`, bodyData, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            })
            if (response.data.statusCode === 200) {
                ToastSuccess('Tạo bài viết thành công')
                setTitle("");
                setContent("");
                setImage("");
                setType("");

            } else {
                ToastFail('Tạo bài viết không thành công');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
            }
            console.error('Error creating post:', error);
            ToastFail('Lỗi tạo bài viết')
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    const handleCancelPost = () => {
        setTitle("");
        setContent("");
        setImage("");
        setType("");
    }

    return (
        <View style={{ padding: SIZES.x30, flex: 1, backgroundColor: "#F9FAFB" }}>
            <SafeAreaView >
                <ScrollView>
                    {/* Header */}
                    <Button
                        style={{ width: 100, marginBottom: 20 }}
                        text="Quay Lại"
                        onPress={() => router.push(`/web/Receptionist/posts/`)}
                    ></Button>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
                            Tạo bài viết
                        </Text>
                        <Text>Thông tin chi tiết của bài viết</Text>
                    </View>

                    {/* Main content */}
                    <View>
                        <Box>
                            <FormControl mb="3" isRequired>
                                <FormControl.Label>Tiêu đề bài viết</FormControl.Label>
                                <Input shadow={1} value={title} onChangeText={(text) => setTitle(text)} />
                            </FormControl>
                            <FormControl mb="3" isRequired>
                                <FormControl.Label>Nội dung bài viết</FormControl.Label>
                                <TextArea
                                    shadow={1}
                                    totalLines={5}
                                    autoCompleteType={""}
                                    value={content}
                                    onChangeText={text => setContent(text)}
                                    w="100%" maxW="100%" />
                            </FormControl>
                            <FormControl mb="3" isRequired>
                                <FormControl.Label>Thể loại</FormControl.Label>
                                <Select selectedValue={type} onValueChange={itemValue => setType(itemValue)} minWidth="200" accessibilityLabel="Chọn thể loại" placeholder="Chọn thể loại" _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size={5} />
                                }} mt="1">
                                    <Select.Item label="Bài viết" value="1" />
                                    <Select.Item label="Thông báo" value="2" />
                                </Select>
                                {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Bắt buộc chọn thể loại
                                </FormControl.ErrorMessage> */}
                            </FormControl>
                            <FormControl mb="3">

                                <ButtonBase onPress={pickImage} leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}>
                                    Tải lên
                                </ButtonBase>
                                {image && <Image mt={2} source={{ uri: image }} size="md" />}
                            </FormControl>
                            <FormControl>
                                <Divider mt={1} />

                                {isLoading && <ActivityIndicator style={{ paddingVertical: SIZES.xSmall }} size={'small'} color={'#171717'}></ActivityIndicator>}

                                <ButtonBase.Group space={2} style={{ flexDirection: 'row', justifyContent: 'center' }} mt={3}>
                                    <ButtonBase colorScheme="danger" onPress={handleCancelPost}>Huỷ bỏ</ButtonBase>
                                    <ButtonBase colorScheme="success" onPress={handleCreatePost}> Tạo bài viết </ButtonBase>
                                </ButtonBase.Group>
                            </FormControl>
                        </Box>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default CreatePost