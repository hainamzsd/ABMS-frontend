import React from 'react'
import { StatusBar, View } from 'react-native'
import {Stack } from 'expo-router'
import styles from './styles'

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