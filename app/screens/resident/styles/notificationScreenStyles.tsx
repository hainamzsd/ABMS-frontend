import { StyleSheet } from "react-native"
import { COLORS } from "../../../../constants/colors"
import SHADOW from "../../../../constants/shadow"

export const notificationScreenStyles = StyleSheet.create({
    box:{
        ...SHADOW,
        borderRadius:20,
        backgroundColor:'white',
        padding:15,
        justifyContent:'space-between'
    }
})