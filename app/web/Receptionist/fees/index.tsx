import React, { useEffect, useState } from 'react'
import { View, Pressable, Text, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import Button from '../../../../components/ui/button'
import { indexStyle as styles } from './styles'
import { router } from 'expo-router'
import { MapPin } from 'lucide-react-native'
import { Fee } from '../../../../interface/feeType'
import { COLORS, ColorPalettes, SIZES } from '../../../../constants'
import { Modal, Button as ButtonNative, Input, VStack, Text as TextNative, FormControl, Divider } from "native-base";
import axios from 'axios'
import { ToastFail, ToastSuccess } from '../../../../constants/toastMessage'
import { API_BASE, actionController } from '../../../../constants/action'
import { useAuth } from '../../context/AuthContext'
import { user } from '../../../../interface/accountType'
import { jwtDecode } from 'jwt-decode'
import { SHADOW, SHADOWS } from '../../../../constants'
import { Bike } from 'lucide-react-native'

const FeeDashboard = () => {
    const { session } = useAuth();
    const user: user = jwtDecode(session as string);

    const [isLoading, setIsLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [fees, setFees] = useState<Fee[]>([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [unit, setUnit] = useState("vnd");
    const [effectiveDate, setEffectiveDate] = useState("");
    const [expireDate, setExpireDate] = useState("");
    const [description, setDescription] = useState("");
    const [feeId, setFeeId] = useState("");
    const [isUpdateModal, setIsUpdateModal] = useState(false);

    const fetchFee = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.FEE}/get-all?buildingId=${user?.BuildingId}`, {
                timeout: 10000,
            });
            if (response.status === 200) {
                setFees(response.data.data);
            } else {
                ToastFail('Lỗi lấy thông tin các khoản phí');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
            }
            console.error('Error fetching posts data:', error);
            ToastFail('Lỗi lấy thông tin các khoản phí')
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    const updateFee = async () => {
        setIsLoading(true);
        const bodyData = {
            feeName: name,
            buildingId: user?.BuildingId,
            price: price,
            unit: unit,
            effectiveDate: effectiveDate,
            expireDate: expireDate,
            description: description
        }
        try {
            const response = await axios.put(`${API_BASE}/${actionController.FEE}/update/${feeId}`, bodyData, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.status === 200) {
                ToastSuccess('Cập nhập thông tin khoản phí thành công')
            } else {
                ToastFail('Lỗi lấy cập nhập thông tin khoản phí');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
            }
            console.error('Error updating fees data:', error);
            ToastFail('Lỗi lấy cập nhập thông tin các khoản phí')
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    }

    const toggleUpdateMode = () => {
        setIsUpdate(!isUpdate);
    }

    const handleUpdateFee = (item: Fee) => {
        setIsUpdateModal(true);
        setName(item?.serviceName);
        setPrice(`${item?.price}`);
        setUnit(item?.unit);
        setEffectiveDate(item?.effectiveDate);
        setExpireDate(item?.expireDate ?? "");
        setDescription(item?.description ?? "");
        setFeeId(item?.id);
    }

    useEffect(() => {
        fetchFee();
    }, [])

    const renderItem = ({ item }: { item: Fee }) => {
        
        return (
            <TouchableOpacity style={{ marginBottom: 20, padding: 10, width: '23%', alignSelf: 'flex-start', borderRadius: 15, alignItems: 'center', flexDirection: 'column', ...SHADOWS.small, backgroundColor: ColorPalettes.ocean.sub }}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: `./fees/${item?.id}`,
                        })}
                >
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <View style={{ padding: 20, backgroundColor: ColorPalettes.ocean.primary, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', borderRadius: 50 }}>
                            {/* <Image source={icon} style={{ width: 48, height: 48 }} /> */}
                            <Bike color='white' strokeWidth={1} style={{width: 60, height: 60}}/>

                        </View>
                        <Text style={{ fontSize: SIZES.large, marginTop: 8 }}>{item?.serviceName.toUpperCase()}</Text>
                        {/* <Divider /> */}
                        {isUpdate &&
                            <View style={{ flexDirection: 'row', gap: 8, paddingVertical: SIZES.small }}>
                                <Button style={{ backgroundColor: ColorPalettes.summer.primary }} text="Chỉnh sửa khoản phí" onPress={() => handleUpdateFee(item)} />
                                <Button style={{ backgroundColor: COLORS.buttonDisable }} disabled text='Xoá khoản phí' />
                            </View>
                        }
                    </View>
                </Pressable>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1, width: '100%' }}>
                    <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Quản lý chi phí</Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Button text={isUpdate ? "Huỷ bỏ" : "Chỉnh sửa"} onPress={toggleUpdateMode} />
                        </View>
                    </View>
                    <FlatList
                        data={fees}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={4}
                        columnWrapperStyle={{ gap: 20 }}
                    />

                </ScrollView>
            </SafeAreaView>

            {/* Create
            <Modal isOpen={isCreateModal} onClose={() => setIsCreateModal(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Tạo địa điểm tiện ích</Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <FormControl.Label>Tên tiện ích</FormControl.Label>
                            <Input value={name} onChangeText={(text) => setName(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Thời gian bắt đầu (h:mm AM/PM)</FormControl.Label>
                            <Input value={openTime} onChangeText={(text) => setOpenTime(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Thời gian kết thúc (h: mm AM/PM)</FormControl.Label>
                            <Input value={closeTime} onChangeText={(text) => setCloseTime(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Số lượng khung giờ</FormControl.Label>
                            <Input value={slots} onChangeText={(text) => setSlots(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Giá thuê (mỗi khung giờ)</FormControl.Label>
                            <Input value={price} onChangeText={(text) => setPrice(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Mô tả tiện ích</FormControl.Label>
                            <Input value={description} onChangeText={(text) => setDescription(text)} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative flex="1" onPress={() => {
                            createUtility();
                            setIsCreateModal(false);
                        }}>
                            Create
                        </ButtonNative>
                    </Modal.Footer>
                </Modal.Content>
            </Modal> */}

            {/* Update */}
            <Modal isOpen={isUpdateModal} onClose={() => setIsUpdateModal(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Cập nhập thông tin khoản phí</Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3">
                            <FormControl.Label>Tên khoản phí</FormControl.Label>
                            <Input value={name} onChangeText={(text) => setName(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Chi phí {unit}</FormControl.Label>
                            <Input value={price} onChangeText={(text) => setPrice(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Đơn vị: </FormControl.Label>
                            <Input value={unit} onChangeText={(text) => setUnit(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Ngày có hiệu lực (h: mm AM/PM)</FormControl.Label>
                            <Input value={effectiveDate} onChangeText={(text) => setEffectiveDate(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Ngày hết hiệu lực ()</FormControl.Label>
                            <Input value={expireDate} onChangeText={(text) => setExpireDate(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Mô tả</FormControl.Label>
                            <Input value={description} onChangeText={(text) => setDescription(text)} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative.Group space={2}>
                            <ButtonNative variant="ghost" colorScheme="blueGray" onPress={() => {
                                setIsUpdateModal(false);
                            }}>
                                Hủy bỏ
                            </ButtonNative>
                            <ButtonNative onPress={() => {
                                updateFee();
                                setIsUpdateModal(false);
                            }}>
                                Cập nhập
                            </ButtonNative>
                        </ButtonNative.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </View >
    )
}

export default FeeDashboard