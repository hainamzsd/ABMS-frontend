import React, { useEffect, useState } from 'react'
import { View, Pressable, Text, SafeAreaView, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import Button from '../../../../components/ui/button'
import { indexStyle as styles } from './styles'
import { router } from 'expo-router'
import { AlertCircle, Car, Info, MapPin, PanelTop } from 'lucide-react-native'
import { Fee } from '../../../../interface/feeType'
import { COLORS, ColorPalettes, SIZES } from '../../../../constants'
import { Modal, Button as ButtonNative, Input, VStack, Text as TextNative, FormControl, Divider, HStack, Center, Icon, AddIcon, Select, Box, IconButton, AlertDialog } from "native-base";
import axios from 'axios'
import { ToastFail, ToastSuccess } from '../../../../constants/toastMessage'
import { API_BASE, actionController } from '../../../../constants/action'
import { useAuth } from '../../context/AuthContext'
import { user } from '../../../../interface/accountType'
import { jwtDecode } from 'jwt-decode'
import { SHADOW, SHADOWS } from '../../../../constants'
import { Bike } from 'lucide-react-native'
import moment from 'moment'
import { formatVND, moneyFormat } from '../../../../utils/moneyFormat'
import * as yup from 'yup'
import { ActivityIndicator } from 'react-native-paper'
import { isDateInFuture, isSecondDateLarger } from '../../../../utils/compareDate'

interface ValidationErrorDetails {
    path: string;
    message: string;
  }
  
  interface ValidationErrors {
    [key: string]: string;
  }
  

const feeSchema = yup.object().shape({
    name: yup.string().required('Tên khoản phí là bắt buộc'),
    money: yup.number().required('Chi phí là bắt buộc').positive('Chi phí phải là số dương'),
    effectiveDate: yup.string().required('Ngày có hiệu lực là bắt buộc').matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, 'Ngày có hiệu lực không hợp lệ (mm/dd/yyyy)'),
    expireDate: yup.string().nullable().when('effectiveDate', {
        is: (effectiveDate: string) => effectiveDate !== '',
        then: (schema) => schema
          .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, 'Ngày có hết hạn không hợp lệ (mm/dd/yyyy)')
          .required('Ngày hết hạn không được để trống')
      }),
    description: yup.string().max(255, 'Mô tả không được quá 255 ký tự'),
  });
const FeeDashboard = () => {
    const { session } = useAuth();
    const user: user = jwtDecode(session as string);
    const [isAssigning, setIsAssigning] = useState(false);
    // STATE
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [fees, setFees] = useState<Fee[]>([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState<Number>();
    const [displayMoneyUpdate, setDisplayMoneyUpdate] = useState('');
    const handleTextChangeUpdate = (text:any) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setPrice(Number(numericValue));
        setDisplayMoneyUpdate(formatVND(numericValue));
    };
    const [effectiveDate, setEffectiveDate] = useState("");
    const [expireDate, setExpireDate] = useState("");
    const [description, setDescription] = useState("");
    const [feeId, setFeeId] = useState("");
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    const [isCreateModal, setIsCreateModal] = useState(false);
    const [isViewModal, setIsViewModal] = useState(false)
    //create
    const [nameCreate, setNameCreate] = useState("");
    const [priceCreate, setPriceCreate] = useState<number>();
    const [unitCreate, setUnitCreate] = useState("");
    const [effectiveDateCreate, setEffectiveDateCreate] = useState("");
    const [expireDateCreate, setExpireDateCreate] = useState("");
    const [descriptionCreate, setDescriptionCreate] = useState("");
    const [displayMoneyCreate, setDisplayMoneyCreate] = useState('');
    const handleTextChange = (text:any) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setPriceCreate(Number(numericValue));
        setDisplayMoneyCreate(formatVND(numericValue));
    };
    const [unassignedRoom, setUnassignedRoom] = useState<string[]>([]);
    const [isVehicleExist, setIsVehicleExist] = useState<Boolean>();
    const checkRoomFee = async () => {
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/CheckRoomsMissingFees/${user.BuildingId}`, {
                timeout: 10000,
            });
            const checkVehicle = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/CheckVehicleFee/${user.BuildingId}`, {
                timeout: 10000,
            });
            if (response.data.statusCode  === 200 && checkVehicle.data.statusCode  === 200) {
                setUnassignedRoom(response.data.data);
                setIsVehicleExist(checkVehicle.data.data);
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
        }
    }
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

    const assignFee = async () => {
        try {
            setIsAssigning(true);
            const response = await axios.post(
                `https://abmscapstone2024.azurewebsites.net/api/v1/AssignFeesToBuildingRooms?buildingId=${user.BuildingId}`,
                null,
                {
                  timeout: 10000,
                  withCredentials: true,
                  headers: {
                    'Authorization': `Bearer ${session}`
                  }
                }
              );
            console.log(response);
            if (response.data.statusCode  === 200) {
                ToastSuccess('Gán phí thành công');
                checkRoomFee();
            } else {
                ToastFail('Lỗi gán phí');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
            }
            console.error('Error fetching posts data:', error);
            ToastFail('Lỗi gán phí')
        } finally {
            setIsAssigning(false);
        }
    }
    
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    //POST:create
    const handleCreate = async () => {
        setIsLoading(true);
        setValidationErrors({});
        if(!isSecondDateLarger(effectiveDateCreate,expireDateCreate)){
            ToastFail('Ngày hết hiệu lực phải lớn hơn ngày có hiệu lực');
            setIsLoading(false);
            return;
        }
        if(!isDateInFuture(expireDateCreate)){
            ToastFail('Ngày hết hiệu lực phải lớn hơn ngày hiện tại');
            setIsLoading(false);
            return;
        }
        try {
            // Move validation inside the try block
            await feeSchema.validate({
                name: nameCreate,
                money: priceCreate,
                effectiveDate: effectiveDateCreate,
                expireDate: expireDateCreate,
                description: descriptionCreate,
            }, { abortEarly: false });
    
            const bodyData = {
                feeName: nameCreate,
                buildingId: user?.BuildingId,
                price: priceCreate,
                unit: "VND",
                effectiveDate: effectiveDateCreate,
                expireDate: expireDateCreate,
                description: descriptionCreate
            };
    
            const response = await axios.post(`${API_BASE}/${actionController.FEE}/create`, bodyData, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
    
            if (response.data.statusCode === 200) {
                ToastSuccess('Tạo thông tin khoản phí thành công');
                // Reset the fields and errors
                setValidationErrors({});
                setNameCreate("");
                setPriceCreate(undefined);
                setDisplayMoneyCreate('');
                setEffectiveDateCreate("");
                setExpireDateCreate("");
                setDescriptionCreate("");
                // Fetch updated data
                fetchFee();
                checkRoomFee();
            } else {
                ToastFail('Lỗi lấy tạo thông tin khoản phí');
            }
        } catch (error:any) {
            if (error && error.name === 'ValidationError' && error.inner) {
                const errors:any = {};
                error.inner.forEach((err:any) => {
                    if (err.path && err.message) {
                        errors[err.path] = err.message;
                    }
                });
                setValidationErrors(errors);
            } else if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            } else {
                console.error('Error creating fee data:', error);
                ToastFail('Lỗi khi tạo thông tin khoản phí');
            }
        } finally {
            setIsLoading(false);
            // Consider whether you want to close the modal here
        }
    };


    // PUT: update fee
    const updateFee = async () => {
        setIsLoading(true);
        setValidationErrors({}); // Clear previous errors
        if(!isSecondDateLarger(effectiveDate,expireDate)){
            ToastFail('Ngày hết hiệu lực phải lớn hơn ngày có hiệu lực');
            setIsLoading(false);
            return;
        }
        if(!isDateInFuture(expireDate)){
            ToastFail('Ngày hết hiệu lực phải lớn hơn ngày hiện tại');
            setIsLoading(false);
            return;
        }
        try {
            // Validate first
            await feeSchema.validate({
                name: name,
                money: price,
                effectiveDate: effectiveDate,
                expireDate: expireDate,
                description: description,
            }, { abortEarly: false });
    
            const bodyData = {
                feeName: name,
                buildingId: user?.BuildingId,
                price: price,
                unit: "VND",
                effectiveDate: effectiveDate,
                expireDate: expireDate,
                description: description
            };
    
            const response = await axios.put(`${API_BASE}/${actionController.FEE}/update/${feeId}`, bodyData, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
    
            if (response.data.statusCode === 200) {
                ToastSuccess('Cập nhật thông tin khoản phí thành công');

            } else {
                ToastFail('Lỗi lấy cập nhật thông tin khoản phí');
            }
        } catch (error:any) {
            if (error && error.name === 'ValidationError' && error.inner) {
                const errors:any = {};
                error.inner.forEach((err:any) => {
                    if (err.path && err.message) {
                        errors[err.path] = err.message;
                    }
                });
                setValidationErrors(errors);
            } else if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau');
            } else {
                console.error('Error updating fees data:', error);
                ToastFail('Lỗi cập nhật thông tin khoản phí');
            }
        } finally {
            setIsLoading(false);
        }
    };
    //deleteAssign
    const [showDeleteAssign, setShowDeleteAssign] = useState(false);
    const handleDeleteAssign = async ()=>{
        setIsLoading(true);
        try {
            const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/DeleteRoomServicesInBuilding/${user.BuildingId}`, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode  === 200) {
                ToastSuccess('Xoá thành công')
                fetchFee();
                checkRoomFee();
            } 
            else if(response.data.statusCode ===404){
                ToastFail('Không có phí nào được gán với các phòng, vui lòng bấm nút gán phí trước');
            }
            else {
                ToastFail("Xóa không thành công");
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
            }
            console.error('Error fetching posts data:', error);
            ToastFail('Lỗi xoá thông tin khoản phí')
        } finally {
            setIsLoading(false); 
            setShowDeleteAssign(false);
        }
    }
    //Delete
    const [showDelete, setShowDelete] = useState(false);
    const cancelRef = React.useRef(null);
    const handleDelete = async (item: Fee) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${API_BASE}/${actionController.FEE}/delete/${item.id}`, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode  === 200) {
                ToastSuccess('Xoá thông tin khoản phí thành công')
                fetchFee();
                checkRoomFee();
            } else {
                ToastFail('Lỗi lấy xoá thông tin khoản phí');
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                ToastFail('Hệ thống lỗi! Vui lòng thử lại sau')
            }
            console.error('Error fetching posts data:', error);
            ToastFail('Lỗi lấy xoá thông tin khoản phí')
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
            setShowDelete(false);
        }
    }

    const toggleUpdateMode = () => {
        setIsUpdate(!isUpdate);
    }

    const handleUpdateFee = (item: Fee) => {
        setIsUpdateModal(true);
        setName(item?.serviceName);
        setPrice(item?.price);
        setDisplayMoneyUpdate(moneyFormat(item?.price as any));
        setEffectiveDate(item?.effectiveDate);
        setExpireDate(item?.expireDate ?? "");
        setDescription(item?.description ?? "");
        setFeeId(item?.id);
    }

    const handleOpenViewModal = (item: Fee) => {
        setIsViewModal(true);
        setName(item?.serviceName);
        setPrice(item?.price);
        setEffectiveDate(item?.effectiveDate);
        setExpireDate(item?.expireDate ?? "");
        setDescription(item?.description ?? "");
    }


    useEffect(() => {
        fetchFee();
        checkRoomFee();
    }, [])
    const NoFeesContent = () => (
        <Center style={{ marginTop: 50 }}>
            <Icon as={<AddIcon />} size="xl" />
            <Text style={{ marginTop: 20, fontSize: 16 }}>Không có biểu phí nào trong hệ thống, vui lòng thêm.</Text>
        </Center>
    );
    const getIcon = (name:string) => {
        switch (name) {
          case 'Xe đạp':
            return <Bike color='white' strokeWidth={1} style={{ width: 60, height: 60 }} />;
          case 'Xe máy':
            return <Bike color='white' strokeWidth={1} style={{ width: 60, height: 60 }} />;
          case 'Ô tô':
            return <Car color='white' strokeWidth={1} style={{ width: 60, height: 60 }} />;
            case 'Xê đạp điện':
                return <Car color='white' strokeWidth={1} style={{ width: 60, height: 60 }} />;
          default:
            return <PanelTop color="white" strokeWidth={1} style={{ width: 60, height: 60 }} />; // Use a generic icon for unknown types
        }
      };
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
                            {getIcon(item?.serviceName)}
                        </View>
                        <Text style={{ fontSize: SIZES.large, marginTop: 8 }}>{item?.serviceName.toUpperCase()}</Text>
                        {/* <Divider /> */}
                        {isUpdate &&
                            <View style={{ flexDirection: 'row', gap: 8, paddingVertical: SIZES.small }}>
                                <Button text="Chỉnh sửa khoản phí" onPress={() => handleUpdateFee(item)} />
                                <Button  style={{ backgroundColor: "#9b2c2c" }} text='Xoá khoản phí' 
                                onPress={() => setShowDelete(true)} />
                            </View>
                        }
                    </View>
                </Pressable>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={showDelete} onClose={()=>setShowDelete(false)}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Xóa phí dịch vụ</AlertDialog.Header>
                        <AlertDialog.Body>
                            Hành động này sẽ xóa dịch vụ và không thể hoàn tác. Bạn muốn tiếp tục không?
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                                <Button text='Hủy' style={{marginRight:5}} onPress={()=>setShowDelete(false)}>
                                </Button>
                                <Button text='Xóa' color='#9b2c2c'  onPress={()=>handleDelete(item)}>
                                </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </TouchableOpacity>
        )
    }
    const [feeType, setFeeType] = useState('vehicle'); // Initial state for fee type
    const [vehicleType, setVehicleType] = useState(''); // State for vehicle type
  
    const handleFeeTypeChange = (value:any) => setFeeType(value);
    const handleVehicleTypeChange = (value:any) => {
        setVehicleType(value);
        setNameCreate(value)}
    const renderVehicleInput = () => (
        <FormControl mt="3">
          <FormControl.Label>Loại phương tiện</FormControl.Label>
          <Select
            selectedValue={vehicleType}
            minWidth={200}
            accessibilityLabel="Chọn loại phương tiện"
            onValueChange={handleVehicleTypeChange}
          >
            <Select.Item label="Ô tô" value="Ô tô" />
            <Select.Item label="Xe máy" value="Xe máy" />
            <Select.Item label="Xe đạp" value="Xe đạp" />
            <Select.Item label="Xe đạp điện" value="Xe đạp điện" />
          </Select>
        </FormControl>
      );
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1, width: '100%' }}>
                    <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Quản lý chi phí</Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Button text={isUpdate ? "Huỷ bỏ" : "Chỉnh sửa"} onPress={toggleUpdateMode} />
                            <Button text={'Thêm biểu phí'} onPress={()=>setIsCreateModal(true)} />
                            <Button 
                            color='#276749'
                            text={'Gán biểu phí cho từng phòng'} onPress={()=>assignFee()} />
                             <Button 
                            color='#9b2c2c'
                            text={'Xóa biểu phí cho tất cả các phòng'} onPress={()=>setShowDeleteAssign(true)} />
                        </View>
                    </View>
                    {isAssigning && <ActivityIndicator size={'large'} color='#191919'/>}
                    {isLoading && <ActivityIndicator size={'large'} color='#191919'/>}
                    {unassignedRoom.length>0 &&
                         <Box bg="white"  rounded={8} p={4}>
                         <HStack alignItems="center" space={4}>
                           <Center bg="red.500" rounded="full" p={4} shadow={4}>
                             <AlertCircle></AlertCircle>
                           </Center>
                           <VStack>
                             <TextNative fontSize={17} fontWeight="bold">
                               Thông báo quan trọng
                             </TextNative>
                             <TextNative fontSize={15} color="gray.700">
                               Còn phòng sau đây chưa được gán phí nào (Trừ phí xe): 
                               <TextNative fontWeight={'semibold'} color={'black'}>{unassignedRoom.join(', ')}</TextNative>
                               
                             </TextNative>
                             <TextNative fontSize={14} color="gray.500"
                             numberOfLines={4}>
                               Nếu chưa tạo phí, vui lòng tạo và gán phí. Nếu đã có phí,
                               bấm nút "Gán phí".
                             </TextNative>
                             <TextNative color="gray.500">Kiểm tra thông tin chi tiết của phòng(phải đầy đủ).</TextNative>
                           </VStack>
                         </HStack>
                       </Box>}
                       {isVehicleExist === false &&  <Box bg="white"  rounded={8} p={4}>
                         <HStack alignItems="center" space={4}>
                           <Center bg="warning.500" rounded="full" p={4} shadow={4}>
                             <Info></Info>
                           </Center>
                           <VStack>
                             <TextNative fontSize={17} fontWeight="bold">
                               Thông tin
                             </TextNative>
                             <TextNative fontSize={15} color="gray.700">
                               Tòa nhà chưa có phí gửi xe, để cư dân có thể tạo thẻ gửi xe bạn cần tạo phí gửi xe.
                             </TextNative>
                             </VStack>
                         </HStack>
                       </Box>}
                     
                    {fees.length > 0 ? (
                        <FlatList
                            data={fees}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            numColumns={4}
                            columnWrapperStyle={{ gap: 20 }}
                            scrollEnabled
                        />
                    ) : (
                        <NoFeesContent />
                    )}

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
                                <TextNative color="blueGray.400">{formatVND(price as any)}</TextNative>
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
{/* Create */}
            <Modal isOpen={isCreateModal} onClose={() => 
                {
                    setIsCreateModal(false)
                    setValidationErrors({})
                    }} justifyContent="center" top="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Tạo thông tin khoản phí</Modal.Header>
                    <Modal.Body>
                    {isLoading && <ActivityIndicator size={'large'} color='#191919'/>}
                    <FormControl mt="3">
            <FormControl.Label>Loại phí</FormControl.Label>
            <Select
              selectedValue={feeType}
              minWidth={200}
              accessibilityLabel="Chọn loại phí"
              onValueChange={handleFeeTypeChange}
            >
              <Select.Item label="Phí phương tiện" value="vehicle" />
              <Select.Item label="Phí khác" value="other" />
            </Select>
          </FormControl>
          {feeType === 'vehicle' && renderVehicleInput()}
          <FormControl mt="3">
            <FormControl.Label>Tên khoản phí</FormControl.Label>
            {feeType === 'vehicle' ? (
              <Select
                selectedValue={vehicleType}
                minWidth={200}
                accessibilityLabel="Chọn tên khoản phí phương tiện"
                onValueChange={handleVehicleTypeChange}
              >
                {vehicleType === 'Ô tô' && <Select.Item label="Phí đỗ xe ô tô" value="Ô tô" />}
                {vehicleType === 'Xe máy' && <Select.Item label="Phí gửi xe máy" value="Xe máy" />}
                {vehicleType === 'Xe đạp' && <Select.Item label="Phí giữ xe đạp" value="Xe đạp" />}
              </Select>
            ) : (
                <>
                <Input
                // value={nameCreate}
                onChangeText={setNameCreate}
                placeholder="Nhập tên khoản phí"
              />
                 {validationErrors.name  && (
                            <Text style={{color:'red'}}>{validationErrors.name}</Text>
                        )}</>
              
              
            )}
          </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Chi phí (vnđ)</FormControl.Label>
                            <Input
                              isRequired
                              value={displayMoneyCreate}
                              onChangeText={handleTextChange}
                              keyboardType="numeric"
                            />
                            {validationErrors.money  && (
                            <Text style={{color:'red'}}>{validationErrors.money}</Text>
                        )}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Ngày có hiệu lực (mm/dd/yyyy)</FormControl.Label>
                            <Input value={effectiveDateCreate} onChangeText={(text) => setEffectiveDateCreate(text)} />
                            {validationErrors.effectiveDate  && (
                            <Text style={{color:'red'}}>{validationErrors.effectiveDate}</Text>
                        )}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Ngày hết hiệu lực (mm/dd/yyyy)</FormControl.Label>
                            <Input value={expireDateCreate} onChangeText={(text) => setExpireDateCreate(text)} placeholder={expireDate === "" ? "Nhập ngày hết hiệu lực" : ""} />
                            {validationErrors.expireDate  && (
                            <Text style={{color:'red'}}>{validationErrors.expireDate}</Text>
                        )}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Mô tả</FormControl.Label>
                            <Input 
                            numberOfLines={4}
                            value={descriptionCreate} onChangeText={(text) => setDescriptionCreate(text)} placeholder={description === "" ? "Nhập mô tả" : ""} />
                             {validationErrors.description  && (
                            <Text style={{color:'red'}}>{validationErrors.description}</Text>
                        )}
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative.Group space={2}>
                            <ButtonNative variant="ghost" colorScheme="blueGray" onPress={() => {
                                setIsCreateModal(false);
                                setValidationErrors({})
                            }}>
                                Hủy bỏ
                            </ButtonNative>
                            <ButtonNative onPress={() => {
                                handleCreate();
                            }}>
                                Tạo
                            </ButtonNative>
                        </ButtonNative.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {/* Update */}
            <Modal isOpen={isUpdateModal} onClose={() => 
                {setIsUpdateModal(false)
                    setValidationErrors({})
                }} justifyContent="center" top="4" size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Cập nhật thông tin khoản phí</Modal.Header>
                    <Modal.Body>
                    {isLoading && <ActivityIndicator size={'large'} color='#191919'/>}
                        <FormControl mt="3">
                            <FormControl.Label>Tên khoản phí</FormControl.Label>
                            <Input placeholder={name} onChangeText={(text) => setName(text)} />
                            {validationErrors.name  && (
                            <Text style={{color:'red'}}>{validationErrors.name}</Text>
                        )}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Chi phí</FormControl.Label>
                            <Input
                             isRequired
                             value={displayMoneyUpdate}
                             onChangeText={handleTextChangeUpdate}
                             keyboardType="numeric" />
                         {validationErrors.money  && (
                            <Text style={{color:'red'}}>{validationErrors.money}</Text>
                        )}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Ngày có hiệu lực (mm/dd/yyyy)</FormControl.Label>
                            <Input value={effectiveDate} onChangeText={(text) => setEffectiveDate(text)} />
                            {validationErrors.effectiveDate  && (
                            <Text style={{color:'red'}}>{validationErrors.effectiveDate}</Text>
                        )}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Ngày hết hiệu lực (mm/dd/yyyy)</FormControl.Label>
                            <Input value={expireDate} onChangeText={(text) => setExpireDate(text)} placeholder={expireDate === "" ? "Nhập ngày hết hiệu lực" : ""} />
                            {validationErrors.expireDate  && (
                            <Text style={{color:'red'}}>{validationErrors.expireDate}</Text>
                        )}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Mô tả</FormControl.Label>
                            <Input value={description} onChangeText={(text) => setDescription(text)} placeholder={description === "" ? "Nhập mô tả" : ""} />
                            {validationErrors.description  && (
                            <Text style={{color:'red'}}>{validationErrors.description}</Text>
                        )}
                        </FormControl>

                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative.Group space={2}>
                            <ButtonNative variant="ghost" colorScheme="blueGray" onPress={() => {
                                setIsUpdateModal(false);
                                setValidationErrors({})
                            }}>
                                Hủy bỏ
                            </ButtonNative>
                            <ButtonNative onPress={() => {
                                updateFee();
                            }}>
                                Cập nhật
                            </ButtonNative>
                        </ButtonNative.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
           <AlertDialog leastDestructiveRef={cancelRef} isOpen={showDeleteAssign}
            onClose={()=>setShowDeleteAssign(false)}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Xóa phí của phòng</AlertDialog.Header>
                        <AlertDialog.Body>
                            Hành động này sẽ xóa phí của các phòng. Sau khi xóa, bạn phải gán lại phí cho từng phòng. Bạn muốn tiếp tục không?
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                                <Button text='Hủy' style={{marginRight:5}} onPress={()=>setShowDeleteAssign(false)}>
                                </Button>
                                <Button text='Xóa' color='#9b2c2c'  onPress={handleDeleteAssign}>
                                </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
        </View >
    )
}

export default FeeDashboard