import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Dimensions, Text, TextInput } from 'react-native';
import { Input } from '@rneui/themed';
import Svg, { Path } from 'react-native-svg';
import SHADOW from '../constants/shadow';
import { COLORS } from '../constants/colors';
import { Phone } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const WIDTH = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const sixtyPercentHeight = screenHeight * 0.9;
const LoginScreen = () => {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }}></Stack.Screen>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={styles.headerContainer}> 
                        <Text style={styles.header}>Đăng nhập</Text>
                        <Text style={styles.subHeader}>Nhập thông tin tài khoản của bạn</Text>
                    </View>
                   
                    <TextInput
                        style={styles.input}
                        placeholder="Số điện thoại"
                        placeholderTextColor="#A9A9A9"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#A9A9A9"
                        secureTextEntry={true}
                    />
                    <View style={{alignItems:'flex-end'}}>
                        <Text>Quên mật khẩu</Text>
                    </View>
                     <TouchableOpacity style={styles.button}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

                <Svg  viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.Box}>
                <Path d="M0 0 L0 50 Q25 60 50 50 Q75 40 100 50 L100 0 Z" fill={COLORS.primary} />
                </Svg>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent:'center',
        paddingHorizontal: 20
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
        zIndex: 1
    },
    input: {
        ...SHADOW,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding:15,
        marginBottom: 15,
    },
    Box: {
        width: '100%',
        height: "100%",
        position: 'absolute',
        top: 0,
    },
    headerContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:20
    },
    header: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    subHeader:{
        fontSize: 16,
    },
    button:{
        ...SHADOW,
        marginTop:40,
        padding:20,
        alignItems:'center',
        backgroundColor:COLORS.primary,
        borderRadius:20
      }
});

export default LoginScreen;
