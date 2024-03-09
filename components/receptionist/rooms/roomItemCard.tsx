import React from 'react'
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native'
import { COLORS, SIZES, SHADOWS } from '../../../constants';

const RoomItemCard = (props: any) => {
    const { item, selectedRoom, handleCardPress } = props;
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => handleCardPress(item)}
        >
            <TouchableOpacity style={styles.logoContainer}>
                <Image
                    source={{
                        uri: item.imageUrl
                            ? item.imageUrl
                            : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
                    }}
                    resizeMode='contain'
                    style={styles.logoImage}
                />
            </TouchableOpacity>
            <Text style={styles.roomMaster} numberOfLines={1}>
            Lê Thị Ánh
            </Text>

            <View style={styles.infoContainer}>
                <Text style={styles.roomNumber} numberOfLines={1}>
                    Room 102
                </Text>
                {/* <View style={styles.infoWrapper}>
                    <Text style={styles.publisher}>
                        {item?.job_publisher} -
                    </Text>
                    <Text style={styles.location}> {item.job_country}</Text>
                </View> */}
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
        borderWidth:1,
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