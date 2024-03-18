import { StyleSheet } from "react-native";
import { SHADOWS } from "../../../../constants";
import { ColorPalettes } from "../../../../constants";

const styles = StyleSheet.create({
    box: { padding: 50, width: '48%', ...SHADOWS.medium, backgroundColor: ColorPalettes.ocean.background, flexDirection: 'row', gap: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 8}
})

export default styles;