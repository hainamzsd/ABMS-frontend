import { Link } from 'expo-router'
import React from 'react'
import { View, Text, Button, Touchable, TouchableOpacity } from 'react-native'

const BuildingList = () => {
  return (
    <Link href={'./buildings/rooms?bid=2'}><Button title='Phòng ở tòa 1'/> </Link>
  )
}

export default BuildingList