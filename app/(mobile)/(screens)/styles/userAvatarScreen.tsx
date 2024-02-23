import { StyleSheet } from "react-native";
import SHADOW from "../../../../constants/shadow";

const userAvatarStyles = StyleSheet.create({
    personalInformation:{
        marginTop:26
    },
    informationBox:{
        ...SHADOW,
        marginTop:20,
        padding:20,
        borderRadius:10,
        backgroundColor:"white"
    },
    headerText:{
        fontWeight:'bold',
        fontSize:20
    },
    informationContainer:{
        flexDirection: 'row',
        marginVertical:10,
        justifyContent: 'space-between', 
    },
    userName:{
        fontWeight:'bold'
    }
    
})

export default userAvatarStyles;