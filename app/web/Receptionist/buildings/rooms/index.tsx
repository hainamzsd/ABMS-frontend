import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Text, FlatList } from 'react-native'
import RoomItem from '../../../../../components/receptionist/rooms/roomItem';
import RoomItemCard from '../../../../../components/receptionist/rooms/roomItemCard';
import SearchWithButton from '../../../../../components/ui/searchWithButton';
import { SIZES } from '../../../../../constants';
import { Link, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { Room } from '../../../../../interface/roomType';
import { Radio } from 'native-base';


const RoomList = () => {
  const item = useLocalSearchParams();
  const [data, setData] = useState<Room[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?buildingId=${item.bid}`, {
          timeout: 10000,
        });
        if (response.status === 200) {
          setData(response.data.data);
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
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', paddingTop: 30, paddingHorizontal: 30 }}>
      <SafeAreaView style={{ height: '100%' }}>
        <View style={{}}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách căn phòng ở Tòa {item.bid}</Text>
            <Text>Thông tin các căn phòng</Text>
          </View>
          <SearchWithButton placeholder="Tìm kiếm số căn" />
        </View>
        <FlatList
          data={data}
          renderItem={({ item }: { item: any }) => (
            <RoomItem
              floor={1}
              data={item}
              isLoading={isLoading}
            />
          )}
          keyExtractor={(item) => item?.id}
          contentContainerStyle={{ columnGap: SIZES.medium }}
          horizontal
        />

      </SafeAreaView>
      <View><Text>Pagination</Text></View>
      {/* Paging */}
    </View>
  )
}

export default RoomList