import Layout from '../../a';
import { FlatList, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { notificationScreenStyles } from './styles/notificationScreenStyles';

const NotificationScreen = () => {
    return (
        <ScrollView style={{marginHorizontal:26}}>
            <Text style={{marginVertical:20, fontSize:16}}>Danh sách tin</Text>
            <TouchableOpacity style={notificationScreenStyles.box}>
                <View style={{marginBottom:20}}>
                    <Text style={{fontWeight:'bold', marginBottom:5}}>Thông báo chung</Text>
                    <Text>lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem </Text>
                </View>
                <Text style={{fontSize:12, fontWeight:'300', color:'#9C9C9C'}}>22 tháng 1, 2024</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default NotificationScreen;