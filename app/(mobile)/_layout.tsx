import React from 'react'
import { StatusBar, View } from 'react-native'
import styles from './styles/indexStyles'
import { Stack } from 'expo-router'
import { useAuth } from './context/AuthContext'
const Layout = () => {
    const { authState, onLogout } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content'></StatusBar>
            <Stack>
                {authState?.authenticated ?
                    (
                        <Stack.Screen name='(mobile)/resident/(tabs)' options={{ headerShown: false }}></Stack.Screen>
                    ) : (
                        <Stack.Screen name=''></Stack.Screen>
                    )
                }

            </Stack>
        </View>
    )
}

export default Layout