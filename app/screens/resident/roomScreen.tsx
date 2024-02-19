import { SafeAreaView, Text, View } from "react-native";
import Header from "../../components/resident/header";
import { COLORS } from "../../../constants/colors";
import roomInformationStyles from "./styles/roomInformationStyles";
import { CircleUser, CircleUserRound, Info } from "lucide-react-native";

export default function Room() {
    return <>
        <Header headerTitle="Thông tin căn hộ"></Header>
        <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={{ marginHorizontal: 26, }}>
                <View style={roomInformationStyles.headerTextContainer}>
                    <Info color={'black'}></Info>
                    <Text style={roomInformationStyles.headerText}>Căn hộ</Text>
                </View>
                <View style={roomInformationStyles.roomBox}>
                    <View style={{ borderBottomWidth: 0.5 }}>
                        <View style={{ padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>R2.18A00</Text>
                            <Text>Times city, Hà Nội</Text>
                        </View>
                    </View>
                    <View style={{ padding: 20 }}>
                        <Text>Thành viên: 4</Text>
                    </View>
                </View>
                <View style={roomInformationStyles.memberInformationContainer}>
                    <Text style={roomInformationStyles.memberInformationHeader}>Thông tin thành viên</Text>
                    <Text style={{fontWeight:'300'}}>Thành viên đã đăng ký</Text>
                </View>
                <View style={roomInformationStyles.memberBox}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={roomInformationStyles.memberCircle}>
                            <CircleUser strokeWidth={1.5} size={40} color={'white'}></CircleUser>
                        </View>
                        <Text style={roomInformationStyles.memberName}>La Canh</Text>
                    </View>
                </View>
                
            </View>
        </SafeAreaView>
    </>
}