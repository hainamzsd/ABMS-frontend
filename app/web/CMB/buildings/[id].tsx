import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import Input from '../../../../components/ui/input';
import Button from '../../../../components/ui/button';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { SIZES } from '../../../../constants';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Tên tòa nhà không được trống'),
  address: Yup.string()
    .required('Địa chỉ tòa nhà không được trống'),
  floors: Yup.number().required('Số tầng không được trống'),
  rooms: Yup.number().required('Số căn hộ mỗi tầng không được trống')
});

const BuildingDetail = () => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [floors, setFloors] = useState("");
  const [rooms, setRooms] = useState("");

  // 
  const navigation = useNavigation();
  const item = useLocalSearchParams();
  const { session } = useAuth();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  // UseEffect
  useEffect(() => {
    const fetchBuilding = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/building/get/${item.id}`, {
          timeout: 10000,
        });
        if (response.status === 200) {
          setName(response.data.data.name);
          setAddress(response.data.data.address);
          setFloors(response.data.data.numberOfFloor);
          setRooms(response.data.data.roomEachFloor);
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

    }
    fetchBuilding();
  }, [])

  const updateBuilding = async () => {
    setValidationErrors({});
    const bodyData = {
      name: name,
      address: address,
      number_of_floor: floors,
      room_each_floor: rooms,
    }
    try {
      setIsLoading(true); // Set loading state to true
      // await validationSchema.validate(bodyData, { abortEarly: false });
      const response = await axios.put(`https://abmscapstone2024.azurewebsites.net/api/v1/building/update/${item?.id}`, bodyData, {
        timeout: 10000,
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${session}`
        }
      });
      console.log(response);
      if (response.data.statusCode == 200) {
        Toast.show({
          type: 'success',
          text1: 'Cập nhật tài khoản thành công',
          position: 'bottom'
        })
        router.replace('/web/CMB/buildings/');
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
        setValidationErrors(errors);
      }
      if (axios.isCancel(error)) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi hệ thống! vui lòng thử lại sau',
          position: 'bottom'
        })
      }
      else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi cập nhật tài khoản',
          position: 'bottom'
        })
      }
    } finally {
      setIsLoading(false);
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
      {isLoading &&
        <ActivityIndicator size={'large'} color={'#171717'}></ActivityIndicator>
      }
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Button
            style={{ width: 100, marginBottom: 20 }}
            text="Quay Lại"
            onPress={() => navigation.goBack()}
          ></Button>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
              Thông tin tòa nhà
            </Text>
            <Text>Thông tin chi tiết tòa nhà <Text style={{ fontSize: SIZES.medium, fontWeight: 'bold' }}></Text></Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Tên tòa nhà
            </Text>
            <Input
              value={name} onChangeText={(text) => {
                setName(text);
              }}
              placeholder="Tên tòa nhà" style={[{ width: "100%" }]}

            ></Input>
            {validationErrors.name && (
              <Text style={styles.errorText}>{validationErrors.name}</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Địa chỉ
            </Text>
            <Input placeholder="Địa chỉ" style={[{ width: "100%" }]}
              value={address}
              onChangeText={(text) => {
                setAddress(text);
              }}></Input>
            {validationErrors.address && (
              <Text style={styles.errorText}>{validationErrors.address}</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Số tầng
            </Text>
            <Input
              placeholder="Floors"
              style={{ width: '100%' }}
              value={floors}
              onChangeText={(text) => setFloors(text)}
            ></Input>
            {validationErrors.floors && (
              <Text style={styles.errorText}>{validationErrors.floors}</Text>
            )}
          </View>
          <View>
            <Text style={{ marginBottom: 10, fontWeight: "600", fontSize: 16 }}>
              Số phòng mỗi tầng
            </Text>
            <Input
              placeholder="Rooms"
              style={{ width: '100%' }}
              value={rooms}
              onChangeText={(text) => setRooms(text)}
            ></Input>
            {validationErrors.rooms && (
              <Text style={styles.errorText}>{validationErrors.rooms}</Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Button
              onPress={updateBuilding}
              text="Cập nhật" style={[{
                width: 100, marginRight: 10,
              }]}></Button>
            <Button
              onPress={() => navigation.goBack()}
              text="Hủy" style={{ width: 100, backgroundColor: '#9b2c2c' }}></Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default BuildingDetail;
const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
  },
})