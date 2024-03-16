import axios from 'axios';
import { Link, router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { View, Text, Button, Touchable, TouchableOpacity, SafeAreaView, ScrollView, FlatList, Pressable } from 'react-native'
import { Building } from '../../../../interface/roomType';
import Toast from 'react-native-toast-message';
import { SIZES } from '../../../../constants';
import SHADOW from '../../../../constants/shadow';

const BuildingList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>();

  useEffect(() => {
    fetchBuildings();
  }, [])

  const renderItem = ({ item }: { item: Building }) => {

    if (item?.name === "") {
      return (<></>)
    } else {
      return (
        <TouchableOpacity style={{ flex: 1, width: '100%', marginBottom: SIZES.medium, ...SHADOW, borderRadius: 15 }}>
          <Pressable style={{ padding: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-evenly', borderRadius: 15 }}
            onPress={() => {
              router.push({
                pathname: `./buildings/accounts?bid=${item?.id}`
              })
            }}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <View id="left-content"><Text style={{ fontSize: SIZES.large, fontWeight: 'bold' }}>{item?.name}</Text></View>
              {/* IMAGE */}
            </View>
            <View id="hr" style={{ borderWidth: 1 }}></View>
            <View id="right-content" style={{ flexDirection: 'column' }}>
              <Text style={{ fontStyle: 'italic' }}> Địa chỉ: {item?.address}</Text>
              <Text style={{ fontStyle: 'italic' }}> Số tầng: {item?.numberOfFloor}</Text>
              <Text style={{ fontStyle: 'italic' }}> Số phòng mỗi tầng: {item?.roomEachFloor}</Text>
            </View>
          </Pressable>
        </TouchableOpacity>

      )
    }
  }
  const fetchBuildings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/building/get`);
      if (response.status === 200) {
        setBuildings(response.data.data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi lấy thông các tòa nhà',
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
      Toast.show({
        type: 'error',
        text1: 'Lỗi lấy thông các tòa nhà',
        position: 'bottom'
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    //   {/* <Link href={'./buildings/rooms?bid=1'}><Button title='Phòng ở tòa 1' /> </Link> */}
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1, width: '100%' }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Quản lý tòa nhà</Text>
          </View>
          <FlatList
            data={buildings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={4}
            columnWrapperStyle={{ gap: 20 }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>

  )
}

export default BuildingList