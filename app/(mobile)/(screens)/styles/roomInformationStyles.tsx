import { StyleSheet } from "react-native";
import SHADOW from "../../../../constants/shadow";
import { COLORS } from "../../../../constants/colors";

const roomInformationStyles = StyleSheet.create({
    headerTextContainer:{
        marginTop:30,
        flexDirection:'row',
        alignItems:'center'
    },
    headerText:{
        fontSize:16, 
        marginLeft:5
    },
    roomBox:{
        ...SHADOW,
        marginTop:20,
        borderRadius:10,
        backgroundColor:"white"
    },
    memberInformationContainer:{
        marginTop:20,
    },
    memberInformationHeader:{
        fontWeight:'bold',
        fontSize:20,
        marginBottom:5
    },
    memberBox:{
        ...SHADOW,
        marginTop:20,
        padding:20,
        borderRadius:10,
        backgroundColor:'white'
    },
    memberCircle:{
        width:60,
        height:60,
        borderRadius:30,
        backgroundColor:COLORS.secondary,
        marginRight:15,
        justifyContent:'center',
        alignItems:'center'
    },
    memberName:{
        fontWeight:'bold',
        fontSize:16
    }
});

export default roomInformationStyles;