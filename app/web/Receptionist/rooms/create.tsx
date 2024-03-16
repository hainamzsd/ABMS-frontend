import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, FlatList } from 'react-native'
import Button from '../../../../components/ui/button'
import Input from '../../../../components/ui/input'
import { COLORS, SHADOWS } from '../../../../constants';
import { Link, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { SIZES } from '../../../../constants'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { useAuth } from '../../context/AuthContext';
import { Building } from '../../../../interface/roomType';

const CreateRoom = () => {
  // STATE
  const [isLoading, setIsLoading] = useState(false);
  const [building, setBuilding] = useState<Building>();
  const [accountId, setAccountId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [roomArea, setRoomArea] = useState("");
  const [numberOfResident, setNumberOfResident] = useState("");

  const navigation = useNavigation();

  const createRoom = async () => {

  }

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

            {/* ACTION */}
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
              <Button
                onPress={createRoom}
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

export default CreateRoom