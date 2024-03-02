import { Link } from "expo-router";
import { SafeAreaView, Text, View, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import Button from "../../../../components/ui/button";
import { Cell, TableComponent, TableRow } from "../../../../components/ui/table";
import Input from "../../../../components/ui/input";
import styles from "./styles";
import { icons } from "../../../../constants"

export default function AccountManagement() {
    const headers = ['Tên đăng nhập', 'Họ và tên', 'Vai trò', 'edaed', ''];

    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView>
                <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách tài khoản</Text>
                        <Text>Thông tin tài khoản của quản lý chung cư</Text>
                    </View>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchWrapper}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Tìm tên tài khoản"
                                value=""
                                onChange={() => { }}
                            />
                        </View>
                        <TouchableOpacity style={styles.searchBtn} onPress={() => { }}>
                            <Image
                                source={icons.search}
                                resizeMode="contain"
                                style={styles.searchBtnIcon}
                            ></Image>
                        </TouchableOpacity>
                    </View>

                    <TableComponent headers={headers}>
                        <TableRow>
                            <Cell>sieucuoitn</Cell>
                            <Cell>Nguyễn Ngọc Tùng Lâm</Cell>
                            <Cell>Quản lý toà nhà</Cell>
                            <Cell>aaa</Cell>
                            <Cell>
                                <Link href={'/web/Admin/accountManagement/accountDetail'}>
                                    <Button text="Chi tiết" />
                                </Link>
                                <Link style={{ paddingLeft: '4px' }} href={''}>
                                    <Button style={{ backgroundColor: 'red' }} text="Xoá" />
                                </Link>
                            </Cell>
                        </TableRow>
                    </TableComponent>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
