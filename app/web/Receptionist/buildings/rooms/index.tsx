import React, { useEffect } from 'react'
import { View, SafeAreaView, Text, FlatList } from 'react-native'
import RoomItem from '../../../../../components/receptionist/rooms/roomItem';
import RoomItemCard from '../../../../../components/receptionist/rooms/roomItemCard';
import SearchWithButton from '../../../../../components/ui/searchWithButton';
import { SIZES } from '../../../../../constants';

const RoomList = () => {
  useEffect(() => {
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', paddingTop: 30, paddingHorizontal: 30 }}>
      <SafeAreaView style={{ height: '100%' }}>
        <View style={{}}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách căn phòng ở Tòa 1</Text>
            <Text>Thông tin các căn phòng</Text>
          </View>
          <SearchWithButton placeholder="Tìm kiếm số căn" />
        </View>

        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={({ item }: { item: any }) => (
            <RoomItem
              floor={item}
            >
              <RoomItemCard />
            </RoomItem>
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