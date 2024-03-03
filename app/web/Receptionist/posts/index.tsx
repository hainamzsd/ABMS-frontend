import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import { COLORS, SIZES, SHADOW, icons } from '../../../../constants'
import { Link } from 'expo-router'

const PostManagement = () => {
    return (
        <View>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách tài khoản</Text>
                <Text>Thông tin tài khoản của quản lý chung cư</Text>
            </View>
            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm tên tài khoản"
                        value=""
                        onChange={() => { }}
                    />
                </View>
                <TouchableOpacity style={styles.searchBtn} onPress={() => { }}>
                    <Image
                        source={icons.search}
                        resizeMode="contain"
                        style={styles.searchBtnIcon}
                    ></Image>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    {/* BOX */}
                    <View style={styles.box}>
                        <Link style={{ width: '100%' }} href={'/web/Receptionist/posts/1'}>
                            <View style={{ width: '100%' }}>
                                <Image style={styles.image} source={{ uri: 'https://th.bing.com/th/id/R.a524fa7dc605d35634aeec2321807d29?rik=M4lQ9ecgeZCQ3g&pid=ImgRaw&r=0' }}></Image>
                            </View>
                            <View style={styles.description}>
                                <Text numberOfLines={2} style={{ marginBottom: 5, fontWeight: 'bold' }}>PostManagement</Text>
                                <Text>12 thang 4 nam 2024</Text>
                            </View>
                        </Link>
                    </View>

                    {/* BOX */}
                    <View style={styles.box}>
                        <Link style={{ width: '100%' }} href={'/web/Receptionist/posts/1'}>
                            <View style={{ width: '100%' }}>
                                <Image style={styles.image} source={{ uri: 'https://th.bing.com/th/id/R.a524fa7dc605d35634aeec2321807d29?rik=M4lQ9ecgeZCQ3g&pid=ImgRaw&r=0' }}></Image>
                            </View>
                            <View style={styles.description}>
                                <Text numberOfLines={2} style={{ marginBottom: 5, fontWeight: 'bold' }}>PostManagement</Text>
                                <Text>12 thang 4 nam 2024</Text>
                            </View>
                        </Link>
                    </View>{/* BOX */}
                    <View style={styles.box}>
                        <Link style={{ width: '100%' }} href={'/web/Receptionist/posts/1'}>
                            <View style={{ width: '100%' }}>
                                <Image style={styles.image} source={{ uri: 'https://th.bing.com/th/id/R.a524fa7dc605d35634aeec2321807d29?rik=M4lQ9ecgeZCQ3g&pid=ImgRaw&r=0' }}></Image>
                            </View>
                            <View style={styles.description}>
                                <Text numberOfLines={2} style={{ marginBottom: 5, fontWeight: 'bold' }}>PostManagement</Text>
                                <Text>12 thang 4 nam 2024</Text>
                            </View>
                        </Link>
                    </View>{/* BOX */}
                    <View style={styles.box}>
                        <Link style={{ width: '100%' }} href={'/web/Receptionist/posts/1'}>
                            <View style={{ width: '100%' }}>
                                <Image style={styles.image} source={{ uri: 'https://th.bing.com/th/id/R.a524fa7dc605d35634aeec2321807d29?rik=M4lQ9ecgeZCQ3g&pid=ImgRaw&r=0' }}></Image>
                            </View>
                            <View style={styles.description}>
                                <Text numberOfLines={2} style={{ marginBottom: 5, fontWeight: 'bold' }}>PostManagement</Text>
                                <Text>12 thang 4 nam 2024</Text>
                            </View>
                        </Link>
                    </View>{/* BOX */}
                    <View style={styles.box}>
                        <Link style={{ width: '100%' }} href={'/web/Receptionist/posts/1'}>
                            <View style={{ width: '100%' }}>
                                <Image style={styles.image} source={{ uri: 'https://th.bing.com/th/id/R.a524fa7dc605d35634aeec2321807d29?rik=M4lQ9ecgeZCQ3g&pid=ImgRaw&r=0' }}></Image>
                            </View>
                            <View style={styles.description}>
                                <Text numberOfLines={2} style={{ marginBottom: 5, fontWeight: 'bold' }}>PostManagement</Text>
                                <Text>12 thang 4 nam 2024</Text>
                            </View>
                        </Link>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '90%',
        borderRadius: SIZES.medium,
        borderWidth: 1,
        borderColor: COLORS.gray2,
        borderStyle: 'dashed'
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        ...SHADOW,
        width: '23%',
        height: 180,
        backgroundColor: COLORS.gray2,
        // justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SIZES.small,
        marginHorizontal: SIZES.xSmall,
    },
    image: {
        objectFit: 'contain',
        width: '100%',
        height: 120,
    },
    description: {
        height: 60,
        paddingHorizontal: 10,
    },
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
        borderRadius: 10,
        color: COLORS.gray2,
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

export default PostManagement

