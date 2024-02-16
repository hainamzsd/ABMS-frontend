import React from 'react'
import { StatusBar, View } from 'react-native'
import styles from './styles/indexStyles'
import {Stack } from 'expo-router'

const _layout = () => {
    return (
        <View style={styles.container}>
                    <StatusBar barStyle='dark-content'></StatusBar>
            <Stack screenOptions={{headerShown:false}} >
            </Stack>
        </View>
    )
}

export default _layout