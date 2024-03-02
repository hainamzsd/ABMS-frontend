import { Link } from "expo-router";
import { SafeAreaView, Text, View, ScrollView } from "react-native";
import Button from "../../../../components/ui/button";
import { Cell, TableComponent, TableRow } from "../../../../components/ui/table";
import Input from "../../../../components/ui/input";

export default function AccountManagement() {
    const headers = ['Header 1', 'Header 2', 'Header 3', 'edaed', ''];

    return (
        <View style={{ flex: 1,backgroundColor: '#F9FAFB' }}>
            <SafeAreaView>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách tài khoản</Text>
                        <Text>Thông tin tài khoản của lễ tân</Text>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Input placeholder="Tìm tên tài khoản" style={{ width: '100%', paddingVertical: 10 }} />
                    </View>
                    <TableComponent headers={headers}>
                        <TableRow>
                            <Cell>aaa</Cell>
                            <Cell>â</Cell>
                            <Cell>aaa</Cell>
                            <Cell>aaa</Cell>
                            <Cell>
                                <Link href={'/web/CMB/accounts/1'}>
                                    <Button text="Chi tiết" />
                                </Link>
                            </Cell>
                        </TableRow>
                        
                    </TableComponent>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
