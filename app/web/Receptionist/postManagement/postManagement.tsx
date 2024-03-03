import { Link } from 'expo-router'
import React from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity, Pressable } from 'react-native'
import { SHADOW } from '../../../../constants'
import { useTranslation } from "react-i18next";
// import { useTheme } from "../../context/Th";
import {
    Layers3,
    MessageSquareDiff,
    Phone,
    PhoneOutgoing,
    ReceiptText,
    Settings,
} from "lucide-react-native";

const PostManagement = () => {
    // const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={{}}>
            <View style={{}}>
                <Text>Hello world</Text>
            </View>

            <View style={styles.listBox}>
                <View style={styles.box}>
                    <Link href={"/web/Receptionist/postManagement/postDetail"}>
                        <View>
                            <Image
                                style={styles.image}
                                source={{
                                    uri: "https://media.istockphoto.com/id/868592684/vector/blue-and-purple-landscape-with-silhouettes-of-mountains-hills-and-forest-and-stars-in-the-sky.jpg?s=612x612&w=0&k=20&c=JmQZI8O2OHVfSeblJTf_73owa0913htm_ItABKYUCuE=",
                                }}
                            ></Image>
                            <View>
                                <Text
                                    numberOfLines={2}
                                    style={{ fontWeight: "bold", marginBottom: 5 }}>LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem</Text>
                                <Text
                                    style={{ fontWeight: "300", fontSize: 12, color: "#9C9C9C" }}
                                >
                                    13 tháng 2, 2024
                                </Text>
                            </View>
                        </View>
                    </Link>
                </View>
            </View>

            <View style={stylesHomeScreen.featureContainer}>
                <View style={stylesHomeScreen.featureBox}>
                    <Link href={"/(mobile)/(screens)/(utility)/utilityListScreen"}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <View
                                style={[
                                    stylesHomeScreen.circle,
                                    // { backgroundColor: theme.sub },
                                ]}
                            >
                                <Layers3 color={"black"} strokeWidth={1.5}></Layers3>
                            </View>
                            <Text>{t("Utility")}</Text>
                        </View>
                    </Link>
                </View>
                <Pressable style={stylesHomeScreen.featureBox}>
                    <Link href={"/(mobile)/(screens)/(service)/serviceListScreen"}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <View
                                style={[
                                    stylesHomeScreen.circle,
                                    //   { backgroundColor: theme.sub },
                                ]}
                            >
                                <Settings color={"black"} strokeWidth={1.5}></Settings>
                            </View>
                            <Text>{t("Service")}</Text>
                        </View>
                    </Link>
                </Pressable>
                <Pressable style={stylesHomeScreen.featureBox}>
                    <Link href={"/(mobile)/(screens)/(bill)/bill"}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <View
                                style={[
                                    stylesHomeScreen.circle,
                                    // { backgroundColor: theme.sub },
                                ]}
                            >
                                <ReceiptText color={"black"} strokeWidth={1.5}></ReceiptText>
                            </View>
                            <Text>{t("Bill")}</Text>
                        </View>
                    </Link>
                </Pressable>
                <TouchableOpacity style={stylesHomeScreen.featureBox}>
                    <Link href={"/(mobile)/(screens)/feedbackScreen"}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <View
                                style={[
                                    stylesHomeScreen.circle,
                                    // { backgroundColor: theme.sub },
                                ]}
                            >
                                <MessageSquareDiff
                                    color={"black"}
                                    strokeWidth={1.5}
                                ></MessageSquareDiff>
                            </View>
                            <Text>{t("Feedback")}</Text>
                        </View>
                    </Link>
                </TouchableOpacity>
                <TouchableOpacity style={stylesHomeScreen.featureBox}>
                    <Link href={"/(mobile)/(screens)/hotlineScreen"}>
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <View
                                style={[
                                    stylesHomeScreen.circle,
                                    // { backgroundColor: theme.sub },
                                ]}
                            >
                                <PhoneOutgoing
                                    color={"black"}
                                    strokeWidth={1.5}
                                ></PhoneOutgoing>
                            </View>
                            <Text>{t("Contact")}</Text>
                        </View>
                    </Link>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.inner}>
                        <Text>Box 1</Text>
                    </View>
                </View>
                <View style={styles.box}>
                    <View style={styles.inner}>
                        <Text>Box 2</Text>
                    </View>
                </View>
                <View style={styles.box}>
                    <View style={styles.inner}>
                        <Text>Box 2</Text>
                    </View>
                </View>
                <View style={styles.box}>
                    <View style={styles.inner}>
                        <Text>Box 2</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listBox: {
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
    },
    box: {
        ...SHADOW,
        backgroundColor: 'white',
        marginHorizontal: 12,
        borderRadius: 10,
        width: '23%',
        height: 250,
        flexDirection: 'row',
        marginVertical: 8,
        alignItems: 'center',
    },
    image: {
        width: 236,
        height: 250,
        objectFit: 'cover'
    },
    container: {
        width: "100%",
        height: "85%",
        alignItems: "center",
        flexDirection: 'row',
        // flexWrap: 'wrap'
    },
    boxTem: {
        width: "50%",
        height: "50%",
        padding: 5
    },
    inner: {
        flex: 1,
        backgroundColor: "#D3D3D3",
        alignItems: 'center',
        justifyContent: 'center'
    }
    // newImage: {
    //     width: 236,
    //     height: 150,
    //     objectFit: "cover",
    //     borderTopLeftRadius: 10,
    //     borderTopRightRadius: 10,
    // },
    // newTitle: {
    //     ...SHADOW,
    //     width: 236,
    //     height: 90,
    //     backgroundColor: "white",
    //     padding: 10,
    //     borderBottomLeftRadius: 10,
    //     borderBottomRightRadius: 10,
    //     justifyContent: "space-between",
    // },
})

const stylesHomeScreen = StyleSheet.create({
    avatar: {
        objectFit: "cover",
        width: 74,
        height: 74,
        borderRadius: 37,
    },
    room: {
        ...SHADOW,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        marginTop: 26,
    },
    featureContainer: {
        marginTop: 36,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    featureBox: {
        ...SHADOW,
        backgroundColor: "white",
        borderRadius: 10,
        width: "24%",
        height: 100,
        marginBottom: 10,
        flexDirection: "c",
        alignItems: "center",
        padding: 10,
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    callBox: {
        backgroundColor: "#ED6666",
        borderRadius: 10,
        padding: 6,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    newContainer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    newImage: {
        width: 236,
        height: 150,
        objectFit: "cover",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    newTitle: {
        ...SHADOW,
        width: 236,
        height: 90,
        backgroundColor: "white",
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "space-between",
    },
});

export default PostManagement