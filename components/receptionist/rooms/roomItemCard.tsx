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
    const { item } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Account>();

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const response = await axios.get(`https://abmscapstone2024.azurewebsites.net/api/v1/account/get/${item.accountId}`, {
              timeout: 10000,
            });
            console.log(response);
            if (response.status === 200) {
                setData(response.data.data);
            } else {
              Toast.show({
                type: 'error',
                text1: 'Lỗi lấy thông tin căn hộ',
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
            console.error('Error fetching room data:', error);
            Toast.show({
              type: 'error',
              text1: 'Lỗi lấy thông tin căn hộ',
              position: 'bottom'
            })
          } finally {
            setIsLoading(false); // Set loading state to false regardless of success or failure
          }
        };
        fetchData();
      }, []);

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
                {data?.fullName}
            </Text>

            <View style={styles.infoContainer}>
                <Text style={styles.roomNumber} numberOfLines={1}>
                    {item?.roomNumber}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: ({
        marginTop: 15,
        width: 150,
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