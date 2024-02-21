import { SafeAreaView, Text, TextInput, View } from "react-native";
import Header from "../../../components/resident/header";
import { COLORS } from "../../../constants/colors";

export default function FeedBack() {
    return (
        <>
            <Header headerTitle="Phiếu phản ánh"></Header>
            <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
                <View style={{ marginHorizontal: 26, }}>
                    <View style={{ marginTop: 30 }}>
                        <Text style={{ fontSize: 16 }}>Chọn loại dịch vụ</Text>
                        <TextInput style={{ height: 20 }}></TextInput>
                    </View>
                </View>
            </SafeAreaView>
        </>)
}