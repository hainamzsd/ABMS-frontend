import { Link, Stack } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function Dashboard() {
    return (<>
        <View style={{ flex: 1, paddingHorizontal: 30, paddingVertical: 30, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Cổng quản lý của ban quản lý chung cư</Text>
                    <Text>Danh sách thống kê</Text>
                </View>
                <Link href={'screens/CMB/accountManagement/accountManagement'}>Account</Link>
            </SafeAreaView>
        </View>

    </>)
}