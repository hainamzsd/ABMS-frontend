import React from 'react'
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { COLORS, SIZES, icon } from '../../constants'

const SearchWithButton = (props: any) => {
    const { placeholder, value, setValue } = props;

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={placeholder}
                    value=""
                    onChange={() => { }}
                />
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={() => { }}>
                <Image
                    source={icon.search}
                    resizeMode="contain"
                    style={styles.searchBtnIcon}
                ></Image>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginVertical: SIZES.medium,
        height: 50,
    },
    searchWrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginRight: SIZES.small,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    searchInput: {
        width: "100%",
        height: "100%",
        paddingHorizontal: SIZES.medium,
        borderColor: COLORS.gray,
        borderStyle: 'solid',
        borderRadius: 10,
        color: COLORS.gray2,
        borderWidth: 1
    },
    searchBtn: {
        width: 50,
        height: "100%",
        backgroundColor: COLORS.tertiary,
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
    },
    searchBtnIcon: {
        width: "50%",
        height: "50%",
        tintColor: COLORS.white,
    }
})

export default SearchWithButton