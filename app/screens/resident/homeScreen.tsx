import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from "../../styles/indexStyles";
import stylesHomeScreen from './styles/homeScreenStyles';
import { Layers3, MessageSquareDiff, PhoneOutgoing, ReceiptText, Settings } from 'lucide-react-native';
const HomeScreen = () => {
    return (
        <ScrollView style={{marginHorizontal:26}}>
        <View
        style={{flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:30, 
        }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.headerText}>Xin chào, Hoa La</Text>
                <Text style={styles.normalText}>Quản lý ngôi nhà của bạn</Text>
            </View>
            <Image  
            style={stylesHomeScreen.avatar}
            source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiGAdWpsJQwrcEtjaAxG-aci3VxO7n2qYey0tI9Syx4Ai9ziAUea6-dAjlaGmRUNQW-Lo&usqp=CAU'}}/>
            
        </View>
        <TouchableOpacity style={stylesHomeScreen.room}>
            <Image 
            style={{
                width:56,
                height:56
            }}
            source={require('../../../assets/images/house1.png')}></Image>
            <View style={{
                marginLeft:20
            }}>
                <Text style={{fontWeight:'bold',marginBottom:5}}>R2.18A00</Text>
                <Text style={{fontWeight:'300'}}>Times city, Hà Nội</Text>
            </View>
        </TouchableOpacity>
        
        <View style={stylesHomeScreen.featureContainer}>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
                <View style={stylesHomeScreen.circle}>
                    <Layers3 color={'black'} strokeWidth={1.5}></Layers3>
                </View>
                <Text>Tiện ích</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
            <View style={stylesHomeScreen.circle}>
                    <Settings color={'black'} strokeWidth={1.5} ></Settings>
                </View>
                <Text>Dịch vụ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
                <View style={stylesHomeScreen.circle}>
                    <ReceiptText color={'black'} strokeWidth={1.5}></ReceiptText>
                </View>
                <Text>Hóa đơn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
            <View style={stylesHomeScreen.circle}>
                    <MessageSquareDiff color={'black'} strokeWidth={1.5} ></MessageSquareDiff>
                </View>
                <Text>Phản ánh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesHomeScreen.featureBox}>
            <View style={stylesHomeScreen.circle}>
                    <PhoneOutgoing color={'black'} strokeWidth={1.5} ></PhoneOutgoing>
                </View>
                <Text>Liên hệ</Text>
            </TouchableOpacity>
        </View>

        <View style={stylesHomeScreen.room}>

        </View>

        
        </ScrollView>
    )
}

export default HomeScreen;
