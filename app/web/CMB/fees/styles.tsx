import { StyleSheet } from "react-native";
import SHADOW from "../../../../constants/shadow";
import { ColorPalettes } from "../../../../constants";

export const indexStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomColor: '#cccccc',
        alignItems: 'center',
        ...SHADOW,
        backgroundColor: ColorPalettes.summer.primary,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10, // Adjust for rounded corners
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: '#333333',
        overflow: 'hidden',
    },
    content: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: '#999999',
    },
})