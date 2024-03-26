import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { UtilityDetail } from '../../../../../interface/utilityType';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import SearchWithButton from '../../../../../components/ui/searchWithButton';
import SHADOW from '../../../../../constants/shadow';
import { Image } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, ColorPalettes, SIZES } from '../../../../../constants';
import Button from '../../../../../components/ui/button';
import { Modal, Button as ButtonNative, Input, VStack, Text as TextNative, FormControl, Center } from "native-base";
import { useAuth } from '../../../context/AuthContext';

const Place = () => {
    const params = useLocalSearchParams();
    const { session } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [utilityDetails, setUtilityDetails] = useState<UtilityDetail[]>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [newPlace, setNewPlace] = useState("");
    const [utilityDetailId, setUtilityDetailId] = useState("");

    console.log(session)


    useEffect(() => {
        fetchUtilityDetail();
    }, [])

    const createUtilityDetail = async () => {
        setIsLoading(true);
        const bodyData = {
            name: newPlace,
            utility_id: params?.id
        }
        try {
            const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/create-utility-detail`, bodyData, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Tạo địa điểm tiện ích thành công',
                    position: 'bottom'
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Tạo địa điểm tiện ích thất bại',
                    position: 'bottom'
                })
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi tạo địa điểm tiện ích mới, vui lòng thử lại sau!',
                position: 'bottom'
            })
        } finally {
            fetchUtilityDetail();
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    const updateUtilityDetail = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/update-utility-detail/${utilityDetailId}?name=S%C3%A2n%20%C4%90%C3%A0%20N%E1%BA%B5ng`, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Cập nhập địa điểm tiện ích thành công',
                    position: 'bottom'
                })
                setNewPlace("");
                fetchUtilityDetail();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Cập nhập địa điểm tiện ích thất bại',
                    position: 'bottom'
                })
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi cập nhập địa điểm tiện ích mới, vui lòng thử lại sau!',
                position: 'bottom'
            })
        } finally {
            
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    const deleteUtilityDetail = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/delete-utility-detail/${utilityDetailId}`, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Xóa địa điểm tiện ích thành công',
                    position: 'bottom'
                })
                setNewPlace("");
                fetchUtilityDetail();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Xóa địa điểm tiện ích thất bại',
                    position: 'bottom'
                })
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi xóa địa điểm tiện ích mới, vui lòng thử lại sau!',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    const fetchUtilityDetail = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-utility-detail?utilityId=${params?.id}`, {
                timeout: 10000,
            });
            if (response.status === 200) {
                setUtilityDetails(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi lấy thông tin tiện ích chi tiết',
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
            console.error('Error fetching utility detail data:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin tiện ích chi tiết',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    const renderItem = ({ item }: { item: UtilityDetail }) => {
        return (
            <Pressable onPress={() => {
                router.push({
                    pathname: '../utilities/reservation', params: {
                        id: item.id
                    }
                })
            }}>
                <View style={styles.container}>
                    <MapPin strokeWidth={2} color={'#fff'}></MapPin>
                    <View style={styles.textContainer}>
                        <View >
                            <Text numberOfLines={1} style={styles.title}>{item?.name}</Text>
                            <Text numberOfLines={2} style={styles.content}>{params?.location}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: SIZES.small }}>
                            <Button text="Chỉnh sửa" onPress={() => {
                                setUtilityDetailId(item?.id)
                                setNewPlace(item?.name)
                                setModalUpdate(!modalUpdate)
                            }} />
                            <Button text="Xoá" onPress={() => {
                                setUtilityDetailId(item?.id)
                                setNewPlace(item?.name)
                                setModalDelete(!modalDelete)
                            }} />
                        </View>
                    </View>
                </View >
            </Pressable>

        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách vị trí tiện ích</Text>
                        <Text>Thông tin các vị trí tiện ích</Text>
                    </View>
                    <SearchWithButton placeholder="Tìm kiếm tên vị trí tiện ích" />
                    <View>
                        <Button text="Thêm địa điểm tiện ích" onPress={() =>
                            setModalVisible(!modalVisible)} />
                    </View>
                </View>
                {isLoading && <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>}
                <FlatList
                    style={{ paddingHorizontal: 30, paddingTop: 30 }}
                    data={utilityDetails}
                    renderItem={renderItem}
                    keyExtractor={item => item?.id}
                />
            </SafeAreaView>

            {/* Create */}
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Tạo địa điểm tiện ích</Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <FormControl.Label>Tên địa điểm</FormControl.Label>
                            <Input value={newPlace} onChangeText={(text) => setNewPlace(text)} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative flex="1" onPress={() => {
                            createUtilityDetail();
                            setModalVisible(false);
                        }}>
                            Create
                        </ButtonNative>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {/* UPDATE */}
            <Modal isOpen={modalUpdate} onClose={() => setModalUpdate(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Chỉnh sửa địa điểm tiện ích</Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <FormControl.Label>Tên địa điểm</FormControl.Label>
                            <Input value={newPlace} onChangeText={(text) => setNewPlace(text)} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative flex="1" onPress={() => {
                            updateUtilityDetail();
                            setModalUpdate(false);
                        }}>
                            Cập nhập
                        </ButtonNative>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {/* DELETE */}
            <Modal isOpen={modalDelete} onClose={() => setModalDelete(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Xác nhận xóa địa điểm tiện ích</Modal.Header>
                    <Modal.Body>
                        <Text style={{ fontSize: SIZES.large, color: COLORS.primary, fontWeight: 'bold' }}>{newPlace}</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative.Group space={2}>
                            <ButtonNative variant="ghost" colorScheme="blueGray" onPress={() => {
                                setModalDelete(false);
                                setNewPlace("");
                            }}>
                                Hủy bỏ
                            </ButtonNative>
                            <ButtonNative onPress={() => {
                                deleteUtilityDetail();
                                setModalDelete(false);

                            }}>
                                Xóa
                            </ButtonNative>
                        </ButtonNative.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </View>
    )
}

export default Place
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomColor: '#cccccc',
        alignItems: 'center',
        ...SHADOW,
        backgroundColor: ColorPalettes.summer.primary,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10, // Adjust for rounded corners
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: '#333333',
        overflow: 'hidden',
    },
    content: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: '#999999',
    },
});