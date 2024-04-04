import { StyleSheet } from 'react-native'
import { COLORS, ColorPalettes, SIZES } from '../../../../constants';
import { SHADOWS } from '../../../../constants';
const styles = StyleSheet.create({
    container: ({
        marginTop: 15,
        width: 200,
        padding: SIZES.large,
        backgroundColor: ColorPalettes.cold.background,
        borderRadius: SIZES.medium,
        borderWidth: 1,
        borderColor: COLORS.gray2,
        justifyContent: "space-between",
        ...SHADOWS.small,
        
    }),
    roomMaster: {
        fontSize: SIZES.medium,
        color: ColorPalettes.cold.primary,
        fontWeight: 'bold',
        marginTop: SIZES.small / 1.5,
    },
    infoContainer: {
        marginTop: SIZES.medium,
    },
    total: ({
        fontSize: SIZES.medium ,
        color: COLORS.primary,
        marginBottom: 4,
        fontWeight: '500',
        fontStyle: 'italic',
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
    date: {
        fontSize: SIZES.small,
        color: "#B3AEC6"
    },
});

export default styles;