import React, { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Pressable } from 'react-native'
import { COLORS, ColorPalettes, SIZES } from '../../../../constants'
import { useTheme } from '../../../(mobile)/context/ThemeContext'
import { ICON_MAP } from '../../../../constants/iconUtility'
import axios from 'axios'
import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message'
import { Utility } from '../../../../interface/utilityType'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { user } from '../../../../interface/accountType'
import { jwtDecode } from 'jwt-decode'
import { SHADOWS } from '../../../../constants'
import Button from '../../../../components/ui/button'
import { Modal, Button as ButtonNative, Input, VStack, Text as TextNative, FormControl, Select, CheckIcon, AlertDialog } from "native-base";
import { ToastFail } from '../../../../constants/toastMessage'
import { utilityComboBox } from "../../../../constants/comboBox"
import { openingHoursSchema, utilitySchema } from '../../../../constants/schema'
import { calculateSlots } from '../../../../utils/convertSlot'
const hourOptions = Array.from({length: 12}, (_, i) => ({ label: `${i+1}`, value: `${i+1}` }));

const Utilities = () => {
  // Others
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
  const [isOtherName, setIsOtherName] = useState(false);
  const [otherName, setOtherName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [slots, setSlots] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isTrash, setIsTrash] = useState(false);

  const [openHour, setOpenHour] = useState('');
    const [closeHour, setCloseHour] = useState('');
    useEffect(() => {
      if (openHour) {
          setOpenTime(`${openHour.padStart(2, '0')}:00 AM`);
      }
  }, [openHour]);

  useEffect(() => {
      if (closeHour) {
          setCloseTime(`${closeHour.padStart(2, '0')}:00 PM`);
      }
  }, [closeHour]);

  // const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // UseEffect: first fetch
  useEffect(() => {
    fetchUtilities();
    fetchUtilitiesTrash();
  }, [])

  //
  useEffect(() => {
    if (name === "Khác") {
      setIsOtherName(true);
    } else {
      setOtherName("");
      setIsOtherName(false);
    }

  }, [name])

  // GET: Get all utilites by buildingId
  const fetchUtilities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-all?buildingId=${user?.BuildingId}&status=1`, {
        timeout: 10000,
      });
      if (response.data.statusCode === 200) {
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

  // GET: Utility have status === 0
  const fetchUtilitiesTrash = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-all?buildingId=${user?.BuildingId}&status=0`, {
        timeout: 10000,
      });
      if (response.data.statusCode === 200) {
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
    const finalName = otherName !== "" ? otherName : name;
    const bodyData = {
      name: finalName,
      buildingId: user?.BuildingId,
      openTime: openTime,
      closeTime: closeTime,
      numberOfSlot: slots,
      pricePerSlot: price,
      location:location,
      description: description
    }
    try {
      await utilitySchema.validate({ name: finalName, numberOfSlot: slots, pricePerSlot: price }, { abortEarly: false })
      await openingHoursSchema.validate({ openTime: openTime, closeTime: closeTime }, { abortEarly: false })
      const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/create`, bodyData, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      })
      if (response.data.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Tạo tiện ích mới thành công',
          position: 'bottom'
        })
        setName("");
        setOpenTime("");
        setCloseTime("");
        setSlots("");
        setPrice("");
        setLocation("");
        setDescription("");
        validationErrors.hourMessage = "";
        fetchUtilities();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi tạo tiện ích',
          position: 'bottom'
        })
      }
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const errors: any = {};
        error.inner.forEach((err: any) => {
          if (err.message === "Thời gian bắt đầu phải trước thời gian kết thúc") {
            errors["hourMessage"] = err.message;
          } else {
            errors[err.path] = err.message;
          }
        });
        setValidationErrors(errors);
      }
      if (axios.isCancel(error)) {
        Toast.show({
          type: 'error',
          text1: 'Hệ thống lỗi! Vui lòng thử lại sau',
          position: 'bottom'
        })
      } else {
        console.error('Error creating utility:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi tạo tiện ích',
          position: 'bottom'
        })
      }
    } finally {
      setOtherName("");
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  // UPDATE: Utility
  const updateUtility = async () => {
    setIsLoading(true);
    const finalName = otherName !== "" ? otherName : name;
    const bodyData = {
      name: finalName,
      buildingId: user?.BuildingId,
      openTime: openTime,
      closeTime: closeTime,
      numberOfSlot: slots,
      pricePerSlot: price,
      description: description,
      location:location
    }
    console.log(bodyData);
    try {
      await utilitySchema.validate({ name: finalName, numberOfSlot: slots, pricePerSlot: price }, { abortEarly: false })
      await openingHoursSchema.validate({ openTime: openTime, closeTime: closeTime }, { abortEarly: false })
      const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/update/${utilityId}`, bodyData, {
        timeout: 10000,
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      })
      console.log(response)
      if (response.data.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Cập nhật tiện ích thành công',
          position: 'bottom'
        })
        validationErrors.hourMessage = "";
        fetchUtilities();
        setIsUpdateModal(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi Cập nhật tiện ích',
          position: 'bottom'
        })
      }
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const errors: any = {};
        error.inner.forEach((err: any) => {
          if (err.message === "Thời gian bắt đầu phải trước thời gian kết thúc") {
            errors["hourMessage"] = err.message;
          } else {
            errors[err.path] = err.message;
          }
        });
        setValidationErrors(errors);
      }
      if (axios.isCancel(error)) {
        Toast.show({
          type: 'error',
          text1: 'Hệ thống lỗi! Vui lòng thử lại sau',
          position: 'bottom'
        })
      } else {
        console.error('Error updating utility:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi Cập nhật tiện ích',
          position: 'bottom'
        })
      }
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
      if (response.data.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Xoá tiện ích thành công',
          position: 'bottom'
        })
        fetchUtilities();
        fetchUtilitiesTrash();
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

  // RESTORE
  const restoreUtility = async (id: any) => {
    setIsLoading(true);
    const bodyData = [id]
    try {
      const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/restore`, bodyData, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      })
      if (response.data.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Phục hồi tiện ích thành công',
          position: 'bottom'
        })
        fetchUtilitiesTrash();
        fetchUtilities();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Phục hồi tiện ích không thành công',
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
        text1: 'Lỗi phục hồi tiện ích',
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
    let isMatched = false;
    setIsUpdateModal(true);
    for (const i of utilityComboBox) {
      if (i === item?.name) {
        isMatched = true;
        break;
      }
    }
    if (isMatched) {
      setName(item?.name);
    } else setName("Khác");
    setValidationErrors({});
    setOpenTime(item?.openTime);
    setCloseTime(item?.closeTime);
    setSlots(item?.numberOfSlot);
    setPrice(item?.pricePerSlot);
    setDescription(item?.description);
    setUtilityId(item?.id);
    setOtherName(item?.name);
    setLocation(item?.location);
  }

  // const handleRestoreUtility = (item: any) => {
  //   setUtilityId(item?.id);
  //   restoreUtility();
  // }

  const handleDeleteUtility = (item: any) => {
    setIsDeleteModal(true);
    setName(item?.name);
    setOpenTime(item?.openTime);
    setCloseTime(item?.closeTime);
    setSlots(item?.numberOfSlot);
    setPrice(item?.pricePerSlot);
    setDescription(item?.description);
    setUtilityId(item?.id);
    setLocation(item?.location);
  }

  const handleChangeToTrash = () => {
    setIsTrash(!isTrash);
  }

  const handleAddUtility = () => {
    setName("");
    setOpenTime("");
    setCloseTime("");
    setSlots("");
    setPrice("");
    setDescription("");
    setLocation("");
    setIsCreateModal(true);
  }

  
const handlePermanentDeleteUtility = async (utilityId:string) => {
  setIsLoading(true);
  try {
    // Check if the utility has any schedules
    const checkResponse = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/${utilityId}/has-schedules`, {
      headers: {
        'Authorization': `Bearer ${session}`
      }
    });

    if (!checkResponse.data.data) {
      deleteUtilityPermanently(utilityId);
    } else {
      alert('Tiện ích này đã có đơn đặt lịch. Bạn không thể xóa.');
    }
  } catch (error) {
    console.error('Error checking schedules:', error);
    alert('Failed to check for utility schedules.');
  } finally {
    setIsLoading(false);
  }
};

const [isDeletePermanent, setIsDeletePermanent] = useState(false);

const onClose = () => setIsDeletePermanent(false);

const cancelRef = React.useRef(null);

const deleteUtilityPermanently = async (utilityId:string) => {
  setIsLoading(true);
  try {
    const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/remove`, {
      data: [utilityId],
      headers: {
        'Authorization': `Bearer ${session}`
      }
    });

    if (response.data.statusCode === 200) {
      Toast.show({
        type:'success',
        text1: 'Tiện ích đã được xóa.',
      });
      setIsDeletePermanent(false);
      fetchUtilitiesTrash();
    } else {
      Toast.show({
        type:'error',
        text1: 'Tiện ích xóa không thành công.',
      });
    }
  } catch (error) {
    console.error('Error deleting utility permanently:', error);
    Toast.show({
      type:'error',
      text1: 'Lỗi xóa tiện ích.',
    });
  } finally {
    setIsLoading(false);
  }
};

  const renderItem = ({ item }: { item: Utility }) => {
    const firstIcon = item?.name;
    let isMatched = false;
    for (const item of utilityComboBox) {
      if (firstIcon === item) {
        isMatched = true;
        break;
      }
    }
    const icon = isMatched ? ICON_MAP[firstIcon] : ICON_MAP["Khác"];

    return (
      <>
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
                <Button style={{ backgroundColor: ColorPalettes.ocean.primary }} text="Khôi phục tiện ích" onPress={() => restoreUtility(item?.id)} />
                <Button style={{ backgroundColor: ColorPalettes.ocean.primary }} text='Xoá vĩnh viễn' onPress={()=>setIsDeletePermanent(true)} />
              </View>
            }
          </View>
        </Pressable>
        
      </TouchableOpacity>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isDeletePermanent} onClose={onClose}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Xóa vĩnh viễn tiện ích</AlertDialog.Header>
                        <AlertDialog.Body>
                            Hành động này sẽ xóa tiện ích vĩnh viễn. Bạn có xác nhận xóa không?
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                                <Button text='Hủy' style={{marginRight:5}} onPress={onClose}>
                                </Button>
                                <Button text='Xóa' color='#9b2c2c'  onPress={()=>handlePermanentDeleteUtility(item.id)}>
                                </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
      </>
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
                <Button text="Thêm tiện ích" onPress={handleAddUtility} />
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
              <Select selectedValue={name} accessibilityLabel="Tên tiện ích" placeholder="Tên tiện ích" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setName(itemValue)}>
                {utilityComboBox.map((item) => (
                  <Select.Item key={item} label={item} value={item} />
                ))}
              </Select>
              {validationErrors.name && (
                <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.name}</Text>
              )}
            </FormControl>
            {isOtherName &&
              <FormControl mt="3">
                <FormControl.Label>Tên tiện ích khác</FormControl.Label>
                <Input placeholder='Nhập tên tiện ích khác' onChangeText={(text) => setOtherName(text)} />
                {validationErrors.name && (
                  <Text style={{
                    color: 'red',
                    fontSize: 14
                  }}>{validationErrors.name}</Text>
                )}
              </FormControl>}
              <VStack space={3}>
              <FormControl>
                            <FormControl.Label>Thời gian bắt đầu {openTime}</FormControl.Label>
                            <Select selectedValue={openHour} onValueChange={setOpenHour} placeholder="Hour">
                                {hourOptions.map(option => <Select.Item key={option.value} label={option.label} value={option.value} />)}
                            </Select>
                          
                            {validationErrors.openTime && <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.openTime}</Text>}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Thời gian kết thúc {closeTime}</FormControl.Label>
                            <Select selectedValue={closeHour} onValueChange={setCloseHour} placeholder="Hour">
                                {hourOptions.map(option => <Select.Item key={option.value} label={option.label} value={option.value} />)}
                            </Select>
                            {validationErrors.closeTime && <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.closeTime}</Text>}
                        </FormControl>
                        </VStack>
            <FormControl mt="3">
              <FormControl.Label>Số lượng khung giờ</FormControl.Label>
              <Input placeholder='Nhập số lượng khung giờ' value={slots} onChangeText={(text) => setSlots(text)} />
              {validationErrors.numberOfSlot && (
                <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.numberOfSlot}</Text>
              )}
            </FormControl>
            {(openTime && closeTime && slots) && <Text style={{ color: 'gray', fontSize: 14 }}>Các khung giờ: </Text>}
            {(openTime && closeTime && slots) && 
            <FlatList
            data={calculateSlots(openTime, closeTime,Number(slots))}
            keyExtractor={item => item}
            renderItem = {({item}) => (
              <Text>{item}</Text>
  )}
            />}
            
            <FormControl mt="3">
              <FormControl.Label>Giá thuê (mỗi khung giờ)</FormControl.Label>
              <Input placeholder="Nhập giá thuê" value={price} onChangeText={(text) => setPrice(text)} />
              {validationErrors.pricePerSlot && (
                <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.pricePerSlot}</Text>
              )}
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Mô tả tiện ích</FormControl.Label>
              <Input
              placeholder="Nhập mô tả tiện ích" 
              // value={description}
              onChangeText={(text) => setDescription(text)} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Địa điểm</FormControl.Label>
              <Input placeholder="Nhập địa điểm"
              value={location}
              onChangeText={(text) => setLocation(text)} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <ButtonNative flex="1" onPress={() => {
              createUtility();
            }}>
              Tạo tiện ích
            </ButtonNative>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Update */}
      <Modal isOpen={isUpdateModal} onClose={() => setIsUpdateModal(false)} avoidKeyboard justifyContent="center" bottom="4" size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Cập nhật địa điểm tiện ích</Modal.Header>
          <Modal.Body>
            <FormControl mt="3">
              <FormControl.Label>Tên tiện ích</FormControl.Label>
              <Select selectedValue={name} accessibilityLabel="Tên tiện ích" placeholder="Tên tiện ích" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setName(itemValue)}>
                {utilityComboBox.map((item) => (
                  <Select.Item key={item} label={item} value={item} />
                ))}
              </Select>
              {validationErrors.name && (
                <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.name}</Text>
              )}
            </FormControl>
            {isOtherName &&
              <FormControl mt="3">
                <FormControl.Label>Tên tiện ích khác</FormControl.Label>
                <Input placeholder={otherName} onChangeText={(text) => setOtherName(text)} />
                {validationErrors.name && (
                  <Text style={{
                    color: 'red',
                    fontSize: 14
                  }}>{validationErrors.name}</Text>
                )}
              </FormControl>}
              <VStack space={3}>
              <FormControl>
                            <FormControl.Label>Thời gian bắt đầu {openTime}</FormControl.Label>
                            <Select selectedValue={openHour} onValueChange={setOpenHour} placeholder="Hour">
                                {hourOptions.map(option => <Select.Item key={option.value} label={option.label} value={option.value} />)}
                            </Select>
                          
                            {validationErrors.openTime && <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.openTime}</Text>}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Thời gian kết thúc {closeTime}</FormControl.Label>
                            <Select selectedValue={closeHour} onValueChange={setCloseHour} placeholder="Hour">
                                {hourOptions.map(option => <Select.Item key={option.value} label={option.label} value={option.value} />)}
                            </Select>
                            {validationErrors.closeTime && <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.closeTime}</Text>}
                        </FormControl>
                        </VStack>
          

            <FormControl mt="3">
              <FormControl.Label>Số lượng khung giờ</FormControl.Label>
              <Input value={slots} onChangeText={(text) => setSlots(text)} />
              {validationErrors.numberOfSlot && (
                <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.numberOfSlot}</Text>
              )}
            </FormControl>
            {(openTime && closeTime && slots) && <Text style={{ color: 'gray', fontSize: 14 }}>Các khung giờ: </Text>}
            {(openTime && closeTime && slots) && 
            <FlatList
            data={calculateSlots(openTime, closeTime,Number(slots))}
            keyExtractor={item => item}
            renderItem = {({item}) => (
              <Text>{item}</Text>
  )}
            />}
            <FormControl mt="3">
              <FormControl.Label>Giá thuê (mỗi khung giờ)</FormControl.Label>
              <Input value={price} onChangeText={(text) => setPrice(text)} />
              {validationErrors.pricePerSlot && (
                <Text style={{
                  color: 'red',
                  fontSize: 14
                }}>{validationErrors.pricePerSlot}</Text>
              )}
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Mô tả tiện ích</FormControl.Label>
              <Input placeholder={description} onChangeText={(text) => setDescription(text)} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Địa điểm</FormControl.Label>
              <Input placeholder={location} onChangeText={(text) => setLocation(text)} />
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
              }}>
                Cập nhật
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