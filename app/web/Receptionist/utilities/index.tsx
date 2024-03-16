import React, { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Pressable } from 'react-native'
import { SIZES } from '../../../../constants'
import { useTheme } from '../../../(mobile)/context/ThemeContext'
import ICON_MAP from '../../../../constants/iconUtility'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { Utility } from '../../../../interface/utilityType'
import { router } from 'expo-router'
const Utilities = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [utilities, setUtilities] = useState<Utility[]>();

  useEffect(() => {
    fetchUtilities();
  }, [])

  const fetchUtilities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/utility/get-all`, {
        timeout: 10000,
      });
      if (response.status === 200) {
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

  const renderItem = ({ item }: { item: Utility }) => {
    const icon = ICON_MAP[item.name];
    return (

      <TouchableOpacity style={{ marginBottom: 20, padding: 10, borderWidth: 1, width: '23%', alignSelf: 'flex-start', borderRadius: 15, alignItems: 'center', flexDirection: 'column' }}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: `./utilities/utilityPlace`,
              params: {
                id: item.id,
                location: item.location,
                utilityName: item.name,
                price: item.pricePerSlot
              },
            })}
        >
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <View style={{ padding: 20, backgroundColor: theme.sub, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', borderRadius: 50 }}>
              <Image source={icon} style={{ width: 48, height: 48 }} />
            </View>
            <Text style={{ fontSize: SIZES.large, marginTop: 4 }}>{item.name}</Text>
          </View>
        </Pressable>
      </TouchableOpacity>

    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30, flex: 1, width: '100%' }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Quản lý tiện ích</Text>
          </View>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}> */}
          <FlatList
            data={utilities}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={4}
            columnWrapperStyle={{ gap: 20 }}
          />
          {/* </View> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Utilities