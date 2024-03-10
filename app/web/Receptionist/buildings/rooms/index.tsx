import React, { useEffect } from 'react'
import { View, SafeAreaView, Text, FlatList } from 'react-native'
import RoomItem from '../../../../../components/receptionist/rooms/roomItem';
import RoomItemCard from '../../../../../components/receptionist/rooms/roomItemCard';
import SearchWithButton from '../../../../../components/ui/searchWithButton';
import { SIZES } from '../../../../../constants';
import { Link, useLocalSearchParams } from 'expo-router';

const RoomList = () => {
  const item = useLocalSearchParams();
  useEffect(() => {
  }, [])

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
          data={[1, 2]}
          renderItem={({ item }: { item: any }) => (
            <RoomItem
              floor={item}
            />
          )}
          keyExtractor={(item) => item.toString()} // Convert item to string
          contentContainerStyle={{ columnGap: SIZES.medium }}
        />

      </SafeAreaView>
      <View><Text>Pagination</Text></View>
      {/* Paging */}
    </View>
  )
}

export default RoomList