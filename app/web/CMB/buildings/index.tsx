import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import Input from '../../../../components/ui/input'
import { Cell, TableComponent, TableRow } from '../../../../components/ui/table'
import { Link } from 'expo-router'
import Button from '../../../../components/ui/button'

const Page = () => {
  const headers = ['Name', 'Address', 'Number of floors', 'Room/floor', 'Status', ""];
  return (
    <View style={{ flex: 1,backgroundColor: '#F9FAFB' }}>
    <SafeAreaView>
        <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30 }}>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Danh sách tòa nhà đang quản lý</Text>
                <Text>Thông tin các tòa nhà</Text>
            </View>
            <View style={{marginBottom:20}}>
              <Link href={'/web/CMB/buildings/create'}>
              <Button text='Tạo tòa nhà mới' style={{width:150}}></Button>
              </Link>
            </View>
            <View style={{ marginBottom: 20 }}>
                <Input placeholder="Tìm tên tài khoản" style={{ width: '100%', paddingVertical: 10 }} />
            </View>
            <TableComponent headers={headers}>
                <TableRow>
                    <Cell>Vinhomes</Cell>
                    <Cell>Vinhome ocean park ha noi</Cell>
                    <Cell>23</Cell>
                    <Cell>30</Cell>
                    <Cell>1</Cell>
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
  )
}

export default Page