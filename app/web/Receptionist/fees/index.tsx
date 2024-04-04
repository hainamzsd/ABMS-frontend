import React, { useEffect, useState } from 'react'
import { View, Pressable, Text, SafeAreaView, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import Button from '../../../../components/ui/button'
import { indexStyle as styles } from './styles'
import { router } from 'expo-router'
import { MapPin } from 'lucide-react-native'
import { Fee } from '../../../../interface/feeType'
import { COLORS, ColorPalettes, SIZES } from '../../../../constants'
import { Modal, Button as ButtonNative, Input, VStack, Text as TextNative, FormControl, Divider, HStack } from "native-base";
import axios from 'axios'
import { ToastFail, ToastSuccess } from '../../../../constants/toastMessage'
import { API_BASE, actionController } from '../../../../constants/action'
import { useAuth } from '../../context/AuthContext'
import { user } from '../../../../interface/accountType'
import { jwtDecode } from 'jwt-decode'
import { SHADOW, SHADOWS } from '../../../../constants'
import { Bike } from 'lucide-react-native'
import moment from 'moment'

const FeeDashboard = () => {
    const { session } = useAuth();
    const user: user = jwtDecode(session as string);
    // STATE
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
    const [isViewModal, setIsViewModal] = useState(false)

    // GET: get-all fee information
    const fetchFee = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/${actionController.FEE}/get-all?buildingId=${user?.BuildingId}`, {
                timeout: 10000,
            });
            if (response.data.statusCode  === 200) {
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

    // PUT: update fee
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
            if (response.data.statusCode  === 200) {
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

    const handleOpenViewModal = (item: Fee) => {
        setIsViewModal(true);
        setName(item?.serviceName);
        setPrice(`${item?.price}`);
        setUnit(item?.unit);
        setEffectiveDate(item?.effectiveDate);
        setExpireDate(item?.expireDate ?? "");
        setDescription(item?.description ?? "");
    }

    useEffect(() => {
        fetchFee();
    }, [])

    const renderItem = ({ item }: { item: Fee }) => {

        return (
            <TouchableOpacity style={{ marginBottom: 20, padding: 10, width: '23%', alignSelf: 'flex-start', borderRadius: 15, alignItems: 'center', flexDirection: 'column', ...SHADOWS.small, backgroundColor: ColorPalettes.ocean.sub }}>
                <Pressable
                    onPress={() =>
                        handleOpenViewModal(item)
                    }
                >
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <View style={{ padding: 20, backgroundColor: ColorPalettes.ocean.primary, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', borderRadius: 50 }}>
                            {/* <Image source={icon} style={{ width: 48, height: 48 }} /> */}
                            <Bike color='white' strokeWidth={1} style={{ width: 60, height: 60 }} />

                        </View>
                        <Text style={{ fontSize: SIZES.large, marginTop: 8 }}>{item?.serviceName.toUpperCase()}</Text>
                        {/* <Divider /> */}
                        {isUpdate &&
                            <View style={{ flexDirection: 'row', gap: 8, paddingVertical: SIZES.small }}>
                                <Button text="Chỉnh sửa khoản phí" onPress={() => handleUpdateFee(item)} />
                                {/* <Button  style={{ backgroundColor: COLORS.buttonDisable }} text='Xoá khoản phí' /> */}
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
                        scrollEnabled
                    />

                </ScrollView>
            </SafeAreaView>

            {/* VIEW */}
            <Modal isOpen={isViewModal} onClose={() => setIsViewModal(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Thông tin khoản phí</Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <HStack alignItems="center" justifyContent="space-between">
                                <TextNative fontWeight="medium">Tên khoản phí</TextNative>
                                <TextNative color="blueGray.400">{name}</TextNative>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between">
                                <TextNative fontWeight="medium">Chi phí (vnd)</TextNative>
                                <TextNative color="blueGray.400">{price}</TextNative>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between">
                                <TextNative fontWeight="medium">Ngày có hiệu lực</TextNative>
                                <TextNative color="blueGray.400">{moment.utc(effectiveDate).format("DD-MM-YYYY")}</TextNative>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between">
                                <TextNative fontWeight="medium">Ngày hết hiệu lực</TextNative>
                                <TextNative color="blueGray.400">{expireDate === "" ? "..." : moment.utc(expireDate).format("DD-MM-YYYY")}</TextNative>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between">
                                <TextNative fontWeight="medium">Mô tả</TextNative>
                                <TextNative color="blueGray.400">{description === "" ? "..." : description}</TextNative>
                            </HStack>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative flex="1" onPress={() => {
                            setIsViewModal(false)
                        }}>
                            Xong
                        </ButtonNative>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {/* Update */}
            <Modal isOpen={isUpdateModal} onClose={() => setIsUpdateModal(false)} justifyContent="center" top="4" size="lg">
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
                            <FormControl.Label>Ngày có hiệu lực (mm/dd/yyyy)</FormControl.Label>
                            <Input value={effectiveDate} onChangeText={(text) => setEffectiveDate(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Ngày hết hiệu lực (mm/dd/yyyy)</FormControl.Label>
                            <Input value={expireDate} onChangeText={(text) => setExpireDate(text)} placeholder={expireDate === "" ? "Nhập ngày hết hiệu lực" : ""} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Mô tả</FormControl.Label>
                            <Input value={description} onChangeText={(text) => setDescription(text)} placeholder={description === "" ? "Nhập mô tả" : ""} />
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