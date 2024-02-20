import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function AccountManagement(){
    return(<>
        <View style={{flex:1, paddingHorizontal:100, paddingVertical:30, backgroundColor:'#F9FAFB'}}>
            <SafeAreaView>
                <View style={{marginBottom:20}}>
                <Text style={{fontWeight:'bold', fontSize:20, marginBottom:5}}>Danh sách tài khoản</Text>
                <Text>Thông tin tài khoản của lễ tân</Text>
                </View>
            </SafeAreaView>
        </View>
        
        </>)
}