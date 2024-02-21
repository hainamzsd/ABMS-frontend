import React from 'react'
import { StatusBar, View } from 'react-native'
import styles from './styles/indexStyles'
import {Stack } from 'expo-router'
const _layout = () => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content'></StatusBar>
            <Stack>
                <Stack.Screen name='screens/resident/(tabs)' options={{headerShown:false}}></Stack.Screen>
            </Stack>
        </View>
    )
}

export default _layout