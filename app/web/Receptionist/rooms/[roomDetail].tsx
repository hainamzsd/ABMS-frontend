import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, FlatList } from 'react-native'
import Button from '../../../../components/ui/button'
import Input from '../../../../components/ui/input'
import { Select, CheckIcon, Box, Badge, Radio } from "native-base";
import { COLORS, SHADOWS } from '../../../../constants';
import { Link, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { SIZES } from '../../../../constants'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { useAuth } from '../../context/AuthContext';
import { Building, Room, RoomMember } from '../../../../interface/roomType';
import { RadioButton } from 'react-native-paper';

const RoomDetail = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const item = useLocalSearchParams();

    // STATE
    const [isLoading, setIsLoading] = useState(false);
    const [roomData, setRoomData] = useState<Room>();
    const [building, setBuilding] = useState<Building>();
    const [roomNumber, setRoomNumber] = useState("");
    const [buildingId, setBuildingId] = useState("");
    const [roomArea, setRoomArea] = useState("");
    const [numberOfResident, setNumberOfResident] = useState("");
    const [addMember, setAddMember] = useState(false);
    const [isDetail, setIsDetail] = useState(false);
    const [roomMembers, setRoomMembers] = useState<RoomMember[]>();
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("male");
    const [phone, setPhone] = useState("");
    const [isHouseholder, setIsHouseholder] = useState("No");
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateMember, setUpdateMember] = useState<RoomMember>();

    // SESSION
    const { session } = useAuth();

    useEffect(() => {
        fetchRoom();
        fetchRoomMember();
    }, []); // Chỉ gọi fetchRoom và fetchRoomMember khi component mount

    useEffect(() => {
        fetchBuilding(); // Gọi fetchBuilding mỗi khi buildingId thay đổi
    }, [buildingId]);

    const fetchRoom = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get/${item?.roomDetail}`, {
                timeout: 10000,
            });
            if (response.status === 200) {
                setRoomNumber(response.data.data.roomNumber);
                setBuildingId(response.data.data.buildingId);
                setRoomArea(response.data.data.roomArea);
                setNumberOfResident(response.data.data.numberOfResident);
                setRoomData(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi lấy thông tin căn hộ',
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
            console.error('Error fetching room data:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin căn hộ',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    };

    // GET: building
    const fetchBuilding = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/building/get/${buildingId}`, {
                timeout: 10000,
            });
            console.log(response);
            if (response.status === 200) {
                setBuilding(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi lấy thông tin toà nhà',
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
            console.error('Error fetching building data:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin toà nhà',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    };
    // GET: RoomMember
    const fetchRoomMember = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room-member/get?roomId=${item?.roomDetail}`, {
                timeout: 10000,
            });
            if (response.status === 200) {
                setRoomMembers(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi lấy thông tin căn hộ',
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
            console.error('Error fetching room data:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin căn hộ',
                position: 'bottom'
            })
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
        }
    };

    // UPDATE ROOM INFORMATION
    const updateRoom = async () => {
        // setError(null);
        // setValidationErrors({});
        const bodyData = {
            accountId: roomData?.accountId,
            buildingId: buildingId,
            roomNumber: roomNumber,
            roomArea: roomArea,
            numberOfResident: numberOfResident
        }
        try {
            setIsLoading(true); // Set loading state to true
            //   await validationSchema.validate(bodyData, { abortEarly: false });
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/update/${roomData?.id}`, bodyData, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Cập nhật tài khoản thành công',
                    position: 'bottom'
                })

            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Cập nhật tài khoản không thành công',
                    position: 'bottom'
                })
            }
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: any = {};
                error.inner.forEach((err: any) => {
                    errors[err.path] = err.message;
                });
                //   setValidationErrors(errors);
            }
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            else {
                console.error('Error creating account:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi cập nhật tài khoản',
                    position: 'bottom'
                })
            }
        } finally {
            setIsLoading(false);
        }
    };

    //ADD ROOM MEMBER
    const handleAddRoomMember = async () => {
        // setError(null);
        // setValidationErrors({});
        const bodyData = {
            roomId: roomData?.id,
            fullName: fullName,
            dob: dob,
            gender: gender == "male" ? true : false,
            phone: phone,
            isHouseHolder: isHouseholder == "Yes" ? true : false
        }
        try {
            setIsLoading(true); // Set loading state to true
            //   await validationSchema.validate(bodyData, { abortEarly: false });
            const response = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room-member/create`, bodyData, {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Cập nhật thành viên thành công',
                    position: 'bottom'
                })
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Cập nhật thành viên không thành công',
                    position: 'bottom'
                })
            }
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: any = {};
                error.inner.forEach((err: any) => {
                    errors[err.path] = err.message;
                });
                //   setValidationErrors(errors);
            }
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            else {
                console.error('Error creating room member:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi cập nhật thành viên',
                    position: 'bottom'
                })
            }
        } finally {
            fetchRoomMember();
            setIsLoading(false);
        }
    }

    //DELETE: ROOM MEMBER
    const handleDeleteMember = async (id: any) => {
        if (!id) {
            Toast.show({
                type: 'error',
                text1: 'Không tìm thấy thành viên',
                position: 'bottom'
            })
            return;
        }
        setIsLoading(true);
        // setError(null);
        try {

            const response = await axios.delete(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room-member/delete/${id}`, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Xóa thành viên thành công',
                    position: 'bottom'
                })
                fetchRoomMember();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Xóa thành viên không thành công',
                    position: 'bottom'
                })
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            console.error('Error deleting room member:', error);
            // setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // UPDATE: ROOM MEMBER
    const handleUpdateMember = async () => {
        const bodyData = {
            roomId: updateMember?.roomId,
            fullName: fullName,
            dob: dob,
            gender: gender == "male" ? true : false,
            phone: phone,
            isHouseHolder: isHouseholder == "Yes" ? true : false
        }
        try {
            setIsLoading(true); // Set loading state to true
            //   await validationSchema.validate(bodyData, { abortEarly: false });
            const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room-member/update/${updateMember?.id}`, bodyData, {
                timeout: 10000,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${session}`
                }
            });
            if (response.data.statusCode == 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Cập nhật thành viên thành công',
                    position: 'bottom'
                })
                setGender("male");
                setIsHouseholder("Yes");
                setFullName("");
                setDob("");
                setPhone("");
                fetchRoomMember();
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Cập nhật thành viên không thành công',
                    position: 'bottom'
                })
                setGender("male");
                setIsHouseholder("Yes");
                setFullName("");
                setDob("");
                setPhone("");
            }
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const errors: any = {};
                error.inner.forEach((err: any) => {
                    errors[err.path] = err.message;
                });
                //   setValidationErrors(errors);
            }
            if (axios.isCancel(error)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống! vui lòng thử lại sau',
                    position: 'bottom'
                })
            }
            else {
                console.error('Error updating room member:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi cập nhật thành viên',
                    position: 'bottom'
                })
            }
        } finally {
            setIsLoading(false);
        }
    }

    const toggleDetail = () => {
        setIsDetail(!isDetail);

    }

    const toggleAddMember = () => {
        setAddMember(!addMember);
        setIsUpdate(false);
        setGender("male");
        setIsHouseholder("Yes");
        setFullName("");
        setDob("");
        setPhone("");
        fetchRoomMember();
    }

    const openUpdate = (item: any) => {
        setIsUpdate(true);
        setAddMember(false);
        setGender(item?.gender ? "male" : "female");
        setIsHouseholder(item?.isHouseholder ? "Yes" : "No");
        setFullName(item?.fullName);
        setDob(item?.dateOfBirth);
        setPhone(item?.phone);
        setUpdateMember(item);
    }

    const closeUpdate = () => {
        setIsUpdate(false);
    }

    const renderItem = ({ item }: any) => {
        if (item?.status !== 0) {
            return (
                <View style={{ flexDirection: 'row', gap: SIZES.medium }}>
                    <View style={{ borderWidth: 1, alignSelf: 'flex-start', padding: SIZES.xSmall, borderColor: COLORS.gray2, ...SHADOWS.small, borderRadius: SIZES.small, marginVertical: SIZES.xSmall - 2 }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold' }}>{item.fullName}</Text>
                                {item.isHouseholder ? <Badge colorScheme="danger" style={{ marginTop: 2 }}>Owner</Badge> :
                                    <Badge colorScheme="info" style={{ marginTop: 2 }}>Member</Badge>
                                }
                            </View>
                            <Button text={isDetail ? 'Hide' : 'Detail'} onPress={toggleDetail} />
                        </View>
                    </View>

                    {isDetail && <View style={{ borderWidth: 1, alignSelf: 'flex-start', padding: SIZES.small, borderColor: COLORS.gray2, ...SHADOWS.small, borderRadius: SIZES.small, marginVertical: SIZES.xSmall - 2 }}>
                        <Text>Họ và tên: <Text style={{ fontWeight: 'bold' }}>{item.fullName}</Text></Text>
                        <Text>Số điện thoại: <Text style={{ fontWeight: 'bold' }}>{item.phone}</Text></Text>
                        <Text>Ngày sinh: <Text style={{ fontWeight: 'bold' }}>{item.dateOfBirth}</Text></Text>
                        <Text>Giới tính: <Text style={{ fontWeight: 'bold' }}>{item.gender ? 'Nam' : 'Nữ'}</Text></Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Button text="Xoá thành viên" onPress={() => handleDeleteMember(item.id)} color={COLORS.buttonRed} />
                            <Button text="Cập nhập" onPress={() => openUpdate(item)} color={COLORS.buttonYellow} />
                        </View>
                    </View>}
                </View>
            )
        } else {
            return (<></>)
        }
    }

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 30,
                paddingVertical: 30,
                backgroundColor: "#F9FAFB",
            }}
        >
            {isLoading ?
                <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>
                :
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <Button
                            style={{ width: 100, marginBottom: 20 }}
                            text="Quay Lại"
                            onPress={() => navigation.goBack()}
                        ></Button>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
                                Thông tin căn hộ
                            </Text>
                            <Text>Thông tin chi tiết của căn hộ <Text style={{ fontWeight: 'bold', fontSize: SIZES.medium - 2 }}>{roomNumber} </Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ width: '48%' }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Số căn hộ
                                </Text>
                                <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 10, }}>Số căn hộ không được trống.</Text>
                                <Input
                                    value={roomNumber} onChangeText={(text) => {
                                        setRoomNumber(text);
                                    }}
                                    placeholder="Số căn hộ" style={[{ width: "100%" }]}

                                ></Input>
                                {/* {validationErrors.full_name && (
              <Text style={styles.errorText}>{validationErrors.full_name}</Text>
            )} */}
                            </View>
                            <View style={{ width: '48%' }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Toà nhà
                                </Text>
                                <Text style={{ color: '#9c9c9c', fontSize: 12, marginBottom: 6, }}>Số căn hộ không được trống.</Text>
                                {/* <Box>
                                    <Select
                                        selectedValue={buildingId}
                                        minWidth="100%"
                                        height='36px'
                                        accessibilityLabel="Chọn toà nhà"
                                        placeholder="Chọn toà nhà"
                                        _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }}
                                        mt={1}
                                        onValueChange={itemValue => setBuildingId(itemValue)}
                                    >
                                        {buildings?.map((item) => (
                                            <Select.Item key={item?.id} label={item?.name} value={item?.id} />
                                        ))}
                                    </Select>
                                </Box> */}
                                <Input
                                    value={building?.name}
                                    style={[{ width: "100%", backgroundColor: COLORS.buttonDisable }]}
                                    editable={false}
                                
                                ></Input>
                            </View>
                        </View>
                        <View>
                            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                Diện tích căn hộ
                            </Text>
                            <Input placeholder="Tên tài khoản" style={[{ width: "100%" }]}
                                value={roomArea}
                                onChangeText={(text) => {
                                    setRoomArea(text);
                                }}></Input>
                            {/* {validationErrors.user_name && (
              <Text style={styles.errorText}>{validationErrors.user_name}</Text>
            )} */}
                        </View>
                        <View style={{ marginTop: 4 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SIZES.small }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 20 }}>
                                    Số thành viên ({numberOfResident})
                                </Text>
                                <Button text={addMember ? "Hủy bỏ" : "Thêm thành viên"} onPress={toggleAddMember} />
                            </View>
                        </View>

                        {/* Member Card */}
                        <View id='member' style={{ width: '100%', flexDirection: 'row', gap: SIZES.small, marginVertical: SIZES.xSmall - 2, justifyContent: 'space-between' }}>
                            <FlatList
                                data={roomMembers}
                                renderItem={renderItem}
                                keyExtractor={(item) => item?.id}
                                contentContainerStyle={{ columnGap: SIZES.medium }}
                            />
                            {addMember && <View style={{ borderWidth: 1, width: '60%', padding: SIZES.small, borderColor: COLORS.gray2, ...SHADOWS.small, borderRadius: SIZES.small }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Họ và tên
                                </Text>
                                <Input placeholder="Tên" style={[{ width: "100%" }]}
                                    value={fullName}
                                    onChangeText={(text) => {
                                        setFullName(text);
                                    }}></Input>
                                <Text style={{ marginTop: SIZES.xSmall, fontWeight: "600", fontSize: 16 }}>
                                    Giới tính
                                </Text>
                                <View style={{ marginBottom: SIZES.xSmall, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: SIZES.medium }}>Male</Text>
                                    <RadioButton
                                        value="male"
                                        status={gender === 'male' ? 'checked' : 'unchecked'}
                                        onPress={() => setGender('male')}
                                        color='blue'
                                    />
                                    <Text style={{ fontSize: SIZES.medium }}>Female</Text>
                                    <RadioButton
                                        value="female"
                                        status={gender === 'female' ? 'checked' : 'unchecked'}
                                        onPress={() => setGender('female')}
                                        color='pink'
                                    />
                                </View>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Ngày sinh
                                </Text>
                                <Input placeholder="Ngày sinh" style={[{ width: "100%" }]}
                                    value={dob}
                                    onChangeText={(text) => {
                                        setDob(text);
                                    }}></Input>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Số điện thoại
                                </Text>
                                <Input placeholder="Số điện thoại" style={[{ width: "100%" }]}
                                    keyboardType='phone-pad'
                                    value={phone}
                                    onChangeText={(text) => {
                                        setPhone(text)
                                    }}></Input>

                                <Text style={{ marginTop: SIZES.small, fontWeight: "600", fontSize: 16 }}>
                                    Chủ căn hộ
                                </Text>
                                <View style={{ marginBottom: SIZES.xSmall, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: SIZES.medium }}>Yes</Text>
                                    <RadioButton
                                        value="Yes"
                                        status={isHouseholder === 'Yes' ? 'checked' : 'unchecked'}
                                        onPress={() => setIsHouseholder('Yes')}
                                        color='green'
                                    />
                                    <Text style={{ fontSize: SIZES.medium }}>No</Text>
                                    <RadioButton
                                        value="No"
                                        status={isHouseholder === 'No' ? 'checked' : 'unchecked'}
                                        onPress={() => setIsHouseholder('No')}
                                        color='red'
                                    />
                                </View>
                                <Button text="Thêm thành viên" onPress={handleAddRoomMember} />
                            </View>}

                            {/* UPDATE FORM */}
                            {isUpdate && <View style={{ borderWidth: 1, width: '60%', padding: SIZES.small, borderColor: COLORS.gray2, ...SHADOWS.small, borderRadius: SIZES.small }}>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Họ và tên
                                </Text>
                                <Input placeholder="Tên" style={[{ width: "100%" }]}
                                    value={fullName}
                                    onChangeText={(text) => {
                                        setFullName(text);
                                    }}></Input>
                                <Text style={{ marginTop: SIZES.xSmall, fontWeight: "600", fontSize: 16 }}>
                                    Giới tính
                                </Text>
                                <View style={{ marginBottom: SIZES.xSmall, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: SIZES.medium }}>Male</Text>
                                    <RadioButton
                                        value="male"
                                        status={gender === "male" ? 'checked' : 'unchecked'}
                                        onPress={() => setGender('male')}
                                        color='blue'
                                    />
                                    <Text style={{ fontSize: SIZES.medium }}>Female</Text>
                                    <RadioButton
                                        value="female"
                                        status={gender === "female" ? 'checked' : 'unchecked'}
                                        onPress={() => setGender('female')}
                                        color='pink'
                                    />
                                </View>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Ngày sinh
                                </Text>
                                <Input placeholder="Ngày sinh" style={[{ width: "100%" }]}
                                    value={dob}
                                    onChangeText={(text) => {
                                        setDob(text);
                                    }}></Input>
                                <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
                                    Số điện thoại
                                </Text>
                                <Input placeholder="Số điện thoại" style={[{ width: "100%" }]}
                                    keyboardType='phone-pad'
                                    value={phone}
                                    onChangeText={(text) => {
                                        setPhone(text)
                                    }}></Input>

                                <Text style={{ marginTop: SIZES.small, fontWeight: "600", fontSize: 16 }}>
                                    Chủ căn hộ
                                </Text>
                                <View style={{ marginBottom: SIZES.xSmall, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: SIZES.medium }}>Yes</Text>
                                    <RadioButton
                                        value="Yes"
                                        status={isHouseholder === "Yes" ? 'checked' : 'unchecked'}
                                        onPress={() => setIsHouseholder('Yes')}
                                        color='green'
                                    />
                                    <Text style={{ fontSize: SIZES.medium }}>No</Text>
                                    <RadioButton
                                        value="No"
                                        status={isHouseholder === "No" ? 'checked' : 'unchecked'}
                                        onPress={() => setIsHouseholder('No')}
                                        color='red'
                                    />
                                </View>
                                <Button text="Cập nhập thông tin" onPress={handleUpdateMember} color="green" />
                                <Button style={{ marginTop: 4 }} text="Huỷ" onPress={closeUpdate} color={COLORS.buttonRed} />
                            </View>}
                        </View>

                        {/* ACTION */}
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                            <Button
                                onPress={updateRoom}
                                text="Cập nhật" style={[{
                                    width: 100, marginRight: 10,
                                }]}></Button>
                            <Button
                                // onPress={handleDeleteAccount}
                                text="Xóa" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            }
        </View>
    )
}

export default RoomDetail