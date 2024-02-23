import React from 'react'
import { StatusBar, Text, View } from 'react-native'
import styles from './styles/indexStyles'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from './context/AuthContext'
const Layout = () => {
    const { authState, onLogout } = useAuth();

   
console.log(authState?.authenticated + "aa");
    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content'></StatusBar>
            <Stack>
                {authState?.authenticated!=undefined ?
                    (
                        <Stack.Screen name='(screens)/(tabs)' options={{ headerShown: false }}></Stack.Screen>

                    ) : (
                        <Stack.Screen name='login'></Stack.Screen>
                    )
                }

            </Stack>
        </View>
    )
}

export default Layout