import Layout from "../../_layout";
import { Image, Text, View } from 'react-native';
import styles from "../../styles/indexStyles";

const HomeScreen = () => {
    return (
        <View
        style={{flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal:26,
        marginTop:10
        }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.headerText}>Xin chào, Hoa La</Text>
                <Text style={styles.normalText}>Quản lý ngôi nhà của bạn</Text>
            </View>
            <Image  
            style={styles.avatar}
            source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiGAdWpsJQwrcEtjaAxG-aci3VxO7n2qYey0tI9Syx4Ai9ziAUea6-dAjlaGmRUNQW-Lo&usqp=CAU'}}/>
        </View>
    )
}

export default HomeScreen;
