import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
    input: {
        width: '100%'
    },
    invalid: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
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
        borderWidth: 1,
        borderRadius: 10,
        borderColor:'#9c9c9c'
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
});
export default styles;