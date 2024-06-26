import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native'
import { COLORS, SIZES, SHADOWS } from '../../../constants';
import Toast from 'react-native-toast-message';
import axios from 'axios';

interface Account {
    id:string,
    buildingId?: string | null;
    phoneNumber: string;
    userName: string;
    email: string;
    fullName: string;
    role: number;
    avatar: string | null;
    createUser: string;
    createTime: string;
    modifyUser: string | null;
    modifyTime: string | null;
    status: number;
  }

const RoomItemCard = (props: any) => {
    const { item, button, account } = props;

    return (
        <TouchableOpacity
            style={styles.container}
        >
            <TouchableOpacity style={styles.logoContainer}>
                <Image
                    source={{
                        uri: "https://png.pngtree.com/png-vector/20190827/ourlarge/pngtree-home-house-apartment-building-office-flat-color-icon-vector-png-image_1701835.jpg",
                    }}
                    resizeMode='contain'
                    style={styles.logoImage}
                />
            </TouchableOpacity>
            <Text style={styles.roomMaster} numberOfLines={1}>
                {account?.status === 0 ? "" : account?.fullName}
            </Text>

            <View style={styles.infoContainer}>
                <Text style={styles.roomNumber} numberOfLines={1}>
                    {item?.roomNumber}
                </Text>
            </View>
            {button}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: ({
        marginTop: 15,
        width: 200,
        padding: SIZES.large,
        backgroundColor: "#FFF",
        borderRadius: SIZES.medium,
        borderWidth: 1,
        borderColor: COLORS.gray2,
        justifyContent: "space-between",
        ...SHADOWS.medium,
        shadowColor: '#000000'
    }),
    logoContainer: ({
        width: 50,
        height: 50,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
    }),
    logoImage: {
        width: "70%",
        height: "70%",
    },
    roomMaster: {
        fontSize: SIZES.medium,
        color: "#B3AEC6",
        marginTop: SIZES.small / 1.5,
    },
    infoContainer: {
        marginTop: SIZES.large,
    },
    roomNumber: ({
        fontSize: SIZES.large,
        color: COLORS.primary,
    }),
    infoWrapper: {
        flexDirection: "row",
        marginTop: 5,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    publisher: ({
        fontSize: SIZES.medium - 2,
        color: COLORS.primary,
    }),
    location: {
        fontSize: SIZES.medium - 2,
        color: "#B3AEC6",
    },
});


export default RoomItemCard