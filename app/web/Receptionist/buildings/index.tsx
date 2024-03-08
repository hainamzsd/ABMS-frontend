import { Link } from 'expo-router'
import React from 'react'
import { View, Text, Button } from 'react-native'

const BuildingList = () => {
  return (
    <View><Link href={'./buildings/rooms'}>Phòng ở tòa 1</Link></View>
  )
}

export default BuildingList