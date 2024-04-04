import React, { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Pressable } from 'react-native'
import { COLORS, ColorPalettes, SIZES } from '../../../../constants'
import { useTheme } from '../../../(mobile)/context/ThemeContext'
import {ICON_MAP} from '../../../../constants/iconUtility'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { Utility } from '../../../../interface/utilityType'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { user } from '../../../../interface/accountType'
import { jwtDecode } from 'jwt-decode'
import { SHADOWS } from '../../../../constants'
import Button from '../../../../components/ui/button'
import { Modal, Button as ButtonNative, Input, VStack, Text as TextNative, FormControl } from "native-base";
import { ToastFail } from '../../../../constants/toastMessage'

const Utilities = () => {
  const { theme } = useTheme();
  const { session } = useAuth();
  const user: user = jwtDecode(session as string);

  // STATE
  const [isLoading, setIsLoading] = useState(false);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [utilitiesTrash, setUtilitiesTrash] = useState<Utility[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [utilityId, setUtilityId] = useState("");
  const [name, setName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [slots, setSlots] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isTrash, setIsTrash] = useState(false);

  useEffect(() => {
    fetchUtilities();
    fetchUtilitiesTrash();
  }, [])

  const fetchUtilities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-all?buildingId=${user?.BuildingId}&status=1`, {
        timeout: 10000,
      });
      if (response.status === 200) {
        setUtilities(response.data.data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi lấy thông tin tiện ích',
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
      console.error('Error fetching utilities data:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi lấy thông tin tiện ích',
        position: 'bottom'
      })
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  const fetchUtilitiesTrash = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-all?buildingId=${user?.BuildingId}&status=0`, {
        timeout: 10000,
      });
      if (response.status === 200) {
        setUtilitiesTrash(response.data.data);
      } else {
        ToastFail('Lỗi lấy thông tin thùng rác')
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
      }
      console.error('Error fetching utilities trash data:', error);
      ToastFail('Lỗi lấy thông tin thùng rác')
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  // CREATE: Utility
  const createUtility = async () => {
    setIsLoading(true);
    const bodyData = {
      name: name,
      buildingId: user?.BuildingId,
      openTime: openTime,
      closeTime: closeTime,
      numberOfSlot: slots,
      pricePerSlot: price,
      description: description
    }
    try {
      const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/create`, bodyData, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      })
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Tạo tiện ích mới thành công',
          position: 'bottom'
        })
        fetchUtilities();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi tạo tiện ích',
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
      console.error('Error creating utility:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi tạo tiện ích',
        position: 'bottom'
      })
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  // UPDATE: Utility
  const updateUtility = async () => {
    setIsLoading(true);
    const bodyData = {
      name: name,
      buildingId: user?.BuildingId,
      openTime: openTime,
      closeTime: closeTime,
      numberOfSlot: slots,
      pricePerSlot: price,
      description: description
    }
    try {
      const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/update/${utilityId}`, bodyData, {
        timeout: 10000,
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      })
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Cập nhập tiện ích thành công',
          position: 'bottom'
        })
        fetchUtilities();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi cập nhập tiện ích',
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
      console.error('Error updating utility:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi cập nhập tiện ích',
        position: 'bottom'
      })
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  // DELETE
  const deleteUtility = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/delete/${utilityId}`, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      })
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Xoá tiện ích thành công',
          position: 'bottom'
        })
        fetchUtilities();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi xoá tiện ích',
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
      console.error('Error updating utility:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi xoá tiện ích',
        position: 'bottom'
      })
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  // RESTORE - NOT FINISHED
  const restoreUtility = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/restore/${utilityId}`, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      })
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Xoá tiện ích thành công',
          position: 'bottom'
        })
        fetchUtilities();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi xoá tiện ích',
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
      console.error('Error updating utility:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi xoá tiện ích',
        position: 'bottom'
      })
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }
  

  //Toggle
  const toggleUpdateMode = () => {
    setIsUpdate(!isUpdate);
  }

  const handleUpdateUtility = (item: any) => {
    setIsUpdateModal(true);
    setName(item?.name);
    setOpenTime(item?.openTime);
    setCloseTime(item?.closeTime);
    setSlots(item?.numberOfSlot);
    setPrice(item?.pricePerSlot);
    setDescription(item?.description);
    setUtilityId(item?.id);
  }

  const handleRestoreUtility = (item: any) => {
    setUtilityId(item?.id);
    restoreUtility();
  }

  const handleDeleteUtility = (item: any) => {
    setIsDeleteModal(true);
    setName(item?.name);
    setOpenTime(item?.openTime);
    setCloseTime(item?.closeTime);
    setSlots(item?.numberOfSlot);
    setPrice(item?.pricePerSlot);
    setDescription(item?.description);
    setUtilityId(item?.id);
  }

  const handleChangeToTrash = () => {
    setIsTrash(!isTrash);
  }

  const renderItem = ({ item }: { item: Utility }) => {
    const icon = ICON_MAP[item?.name];
    return (
      <TouchableOpacity style={{ marginBottom: 20, padding: 10, width: '23%', alignSelf: 'flex-start', borderRadius: 15, alignItems: 'center', flexDirection: 'column', ...SHADOWS.small, backgroundColor: ColorPalettes.summer.sub }}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: `./utilities/place`,
              params: {
                id: item?.id,
                location: item?.location,
                utilityName: item?.name,
                price: item?.pricePerSlot
              },
            })}
        >
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <View style={{ padding: 20, backgroundColor: theme.sub, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', borderRadius: 50 }}>
              <Image source={icon} style={{ width: 48, height: 48 }} />
            </View>
            <Text style={{ fontSize: SIZES.large, marginTop: 4 }}>{item.name}</Text>
            {isUpdate && isTrash === false &&
              <View style={{ flexDirection: 'row', gap: 8, paddingVertical: SIZES.small }}>
                <Button style={{ backgroundColor: ColorPalettes.ocean.primary }} text="Chỉnh sửa tiện ích" onPress={() => handleUpdateUtility(item)} />
                <Button style={{ backgroundColor: ColorPalettes.ocean.primary }} text='Xoá tiện ích' onPress={() => handleDeleteUtility(item)} />
              </View>
            }
            {isUpdate && isTrash &&
              <View style={{ flexDirection: 'row', gap: 8, paddingVertical: SIZES.small }}>
                <Button style={{ backgroundColor: ColorPalettes.ocean.primary }} text="Khôi phục tiện ích" onPress={() => handleRestoreUtility(item)} />
                <Button style={{ backgroundColor: ColorPalettes.ocean.primary }} text='Xoá vĩnh viễn' />
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
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Quản lý tiện ích</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {isTrash === false && <>
                <Button text="Thêm tiện ích" onPress={() => setIsCreateModal(true)} />
                <Button text={isUpdate ? "Huỷ bỏ" : "Chỉnh sửa"} onPress={toggleUpdateMode} /> </>
              }
              {isTrash && <Button text={isUpdate ? "Huỷ bỏ" : "Chỉnh sửa"} onPress={toggleUpdateMode} />}
              <Button text={isTrash ? "Thoát chế độ thùng rác" : "Thùng rác"} style={{ backgroundColor: COLORS.buttonRed }} onPress={handleChangeToTrash} />
            </View>
          </View>
          {/* {isTrash && utilitiesTrash.length === 0 ? <View><Text style={{fontSize: SIZES.medium, color: COLORS.gray, fontStyle: 'italic'}}>Thùng rác trống.</Text></View> : isTrash === false && utilities?.length === 0 ? <View><Text style={{fontSize: SIZES.medium, color: COLORS.gray, fontStyle: 'italic'}}>Thùng rác trống.</Text></View>} */}
          {isTrash && utilitiesTrash.length === 0 && <View><Text style={{ fontSize: SIZES.medium, color: COLORS.gray, fontStyle: 'italic', textAlign: 'center' }}>Thùng rác trống.</Text></View>}
          {isTrash === false && utilities.length === 0 && <View><Text style={{ fontSize: SIZES.medium, color: COLORS.gray, fontStyle: 'italic', textAlign: 'center' }}>Hiện chưa có tiện ích nào.</Text></View>}
          <FlatList
            data={isTrash ? utilitiesTrash : utilities}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={4}
            columnWrapperStyle={{ gap: 20 }}
          />

        </ScrollView>
      </SafeAreaView>

      {/* Create */}
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
      </Modal>

      {/* Update */}
      <Modal isOpen={isUpdateModal} onClose={() => setIsUpdateModal(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
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
            <ButtonNative.Group space={2}>
              <ButtonNative variant="ghost" colorScheme="blueGray" onPress={() => {
                setIsUpdateModal(false);
              }}>
                Hủy bỏ
              </ButtonNative>
              <ButtonNative onPress={() => {
                updateUtility();
                setIsUpdateModal(false);
              }}>
                Cập nhập
              </ButtonNative>
            </ButtonNative.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Delete */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Xác nhận xoá tiện ích</Modal.Header>
          <Modal.Body>
            <Text style={{ fontSize: SIZES.large, color: COLORS.primary }}>Tên tiện ích: <Text style={{ color: ColorPalettes.ocean.primary, fontWeight: 'bold' }}>{name}</Text></Text>
            <Text style={{ fontSize: SIZES.large, color: COLORS.primary }}>Thời gian: <Text style={{ color: ColorPalettes.ocean.primary, fontWeight: 'bold' }}>{openTime} to {closeTime}</Text></Text>
            <Text style={{ fontSize: SIZES.large, color: COLORS.primary }}>Số khung giờ: <Text style={{ color: ColorPalettes.ocean.primary, fontWeight: 'bold' }}>{slots}</Text> </Text>
            <Text style={{ fontSize: SIZES.large, color: COLORS.primary }}>Giá mỗi khung giờ: <Text style={{ color: ColorPalettes.ocean.primary, fontWeight: 'bold' }}>{price}</Text></Text>
            <Text style={{ fontSize: SIZES.large, color: COLORS.primary }}>Mô tả tiện ích: <Text style={{ color: ColorPalettes.ocean.primary, fontWeight: 'bold' }}>{description}</Text></Text>
          </Modal.Body>
          <Modal.Footer>
            <ButtonNative.Group space={2}>
              <ButtonNative variant="ghost" colorScheme="blueGray" onPress={() => {
                setIsDeleteModal(false);
              }}>
                Hủy bỏ
              </ButtonNative>
              <ButtonNative onPress={() => {
                deleteUtility();
                setIsDeleteModal(false);
              }}>
                Xoá
              </ButtonNative>
            </ButtonNative.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  )




}

export default Utilities