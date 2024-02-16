import { StyleSheet } from "react-native";
import SHADOW from "../../../../constants/shadow";
const HotlineScreenStyles = StyleSheet.create({
    hotlineBox:{
        ...SHADOW,
        marginTop:20,
        borderRadius:10,
        backgroundColor:"white",
        padding:20
    },
    hotlineDropdown:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:10
    },
    callBox:{
        backgroundColor: '#ED6666',
        borderRadius: 10, padding: 5,
        flexDirection: 'row',
        width:80,
        height:30,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default HotlineScreenStyles;