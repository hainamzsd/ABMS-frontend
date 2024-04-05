import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Text, FlatList, TextInput, StyleSheet } from 'react-native'
// import RoomItem from '../../../../components/receptionist/rooms/roomItem';
// import RoomItemCard from '../../../../components/receptionist/rooms/roomItemCard';
// import SearchWithButton from '../../../../components/ui/searchWithButton';
import Button from '../../../../components/ui/button';
import { SIZES } from '../../../../constants';
import { Link, router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { Building, Room } from '../../../../interface/roomType';
import { Badge, Radio, Button as ButtonBase } from 'native-base';
import { user } from '../../../../interface/accountType';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Cell, TableComponent, TableRow } from '../../../../components/ui/table';

const RoomList = () => {
  const [data, setData] = useState<Room[]>([]);
  const [building, setBuilding] = useState<Building>();
  const [isLoading, setIsLoading] = useState(false);
  const headers = ["Số căn hộ", "Chủ căn hộ", "Diện tích căn hộ (m2)", "Số thành viên", ""];
  const { session } = useAuth();
  const user: user = jwtDecode(session as string);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/resident-room/get?buildingId=${user?.BuildingId}`, {
          timeout: 10000,
        });
        if (response.data.statusCode === 200) {
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
    fetchBuilding();
  }, []);

  const fetchBuilding = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/building/get/${user?.BuildingId}`, {
        timeout: 10000,
      });
      if (response.data.statusCode === 200) {
        setBuilding(response.data.data);
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

  //search box
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequests, setFilteredRequests] = useState<Room[]>([]);
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = data.filter(item =>
        item?.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(data);
    }
  }, [searchQuery, data]);

  const renderItem = ({ item }: { item: Room }) => {

    return (
      <TableRow>
        <Cell> {item?.roomNumber ? <Badge>{item?.roomNumber}</Badge> : <Badge colorScheme="warning">Căn hộ mới</Badge>}</Cell>
        <Cell>
          {item?.accountStatus === 0 ? <Badge>Không có chủ căn hộ</Badge> :
            <Badge colorScheme="error">{item?.accountName}</Badge>}
        </Cell>
        <Cell><Badge colorScheme="info">{`${item?.roomArea}`}</Badge></Cell>
        <Cell><Badge>{item?.numberOfResident}</Badge></Cell>
        <Cell>
          {item?.accountStatus === 0
            ? <ButtonBase onPress={() => router.push({
              pathname: '/web/Receptionist/accounts/create',
              params: {
                roomId: item?.id,
                roomNumber: item?.roomNumber,
                roomArea: item?.roomArea
              }
            })}>Thêm chủ căn hộ</ButtonBase>
            : <ButtonBase variant="subtle" colorScheme="dark" onPress={() => router.push(`/web/Receptionist/rooms/${item?.id}`)}>Chi tiết</ButtonBase>
          }
        </Cell>
      </TableRow>
    )

  }
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', paddingTop: 30, paddingHorizontal: 30 }}>
      <SafeAreaView style={{ height: '100%' }}>
        <View style={{}}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách căn hộ ở Tòa {building?.name}</Text>
            <Text>Thông tin các căn phòng</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholderTextColor={'black'}
              placeholder="Tìm theo số căn hộ"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
        </View>
        {!filteredRequests.length ? (
          <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: '600' }}>Chưa có dữ liệu</Text>
        ) : (<TableComponent headers={headers}><FlatList
          data={filteredRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        /></TableComponent>)}

      </SafeAreaView>
      {/* Paging */}
    </View>
  )
}
const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: SIZES.medium,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  searchInput: {
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#9c9c9c'
  },
})
export default RoomList