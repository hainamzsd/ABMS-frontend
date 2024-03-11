import { View, Text, ScrollView, SafeAreaView, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import SHADOW from '../../../../constants/shadow'
import { router } from 'expo-router';

interface Services{
  id: string,
  title: string,
  description: string,
  footerText: string,
  imageUrl: string;
  href:string

}
// Sample data for the cards
const data:Services[] = [
  { id: '1', title: 'Quản lý đăng kí thang máy', 
  description: 'Tiếp nhận yêu cầu đăng ký sử dụng thang máy cho các trường hợp đặc biệt, Ghi chép lịch sử sử dụng thang máy.',
  footerText: 'Truy cập', 
  imageUrl: require('../../../../assets/images/elevator.png'),
  href: '/web/Receptionist/services/elevator/'},
  { id: '2', title: 'Quản lý đăng kí thi công', 
  description: 'Tiếp nhận yêu cầu đăng ký thi công, sửa chữa, ', 
  footerText: 'Truy cập', 
  imageUrl:
   require('../../../../assets/images/support.png'),
   href: '/web/Receptionist/services/construction/'},
  { id: '3', title: 'Quản lý đăng kí vé xe',
   description: 'Tiếp nhận các đơn đăng kí để xe tại chung cư',
    footerText: 'Truy cập',
   imageUrl: require('../../../../assets/images/garage-car.png'),
   href: '/web/Receptionist/services/elevator/'},
   { id: '4', title: 'Quản lý đăng kí khách thăm', 
   description: 'Tiếp nhận các đơn đăng kí khách thăm từ cư dân',
    footerText: 'Truy cập',
   imageUrl: require('../../../../assets/images/id-card.png'),
   href: '/web/Receptionist/services/elevator/' },
  // Add more items...
];
interface CardData {
  id: string;
  title: string;
  description: string;
  footerText: string;
  imageUrl: string;
}

interface CardItemProps {
  title: string;
  description: string;
  footerText: string;
  imageUrl: string;
  href:any;
}
const CardItem: React.FC<CardItemProps> = ({ title, description, footerText, imageUrl, href }) => (
  <TouchableOpacity style={styles.card} 
  onPress={()=>{
    router.push(href)
  }}>
    <Image source={imageUrl as any} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <View style={styles.separator} />
    <Text style={styles.footerText}>{footerText}</Text>
  </TouchableOpacity>
);

const index = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
    <SafeAreaView style={{flex:1}}>
        <ScrollView style={{ paddingHorizontal: 30, paddingVertical: 30,flex:1 }}>
          <View style={{marginBottom:20}}>
            <Text style={{fontWeight:'bold', fontSize:20}}>Quản lý dịch vụ</Text>
          </View>
          <FlatList
      data={data}
      renderItem={({ item }) => (
        <CardItem
        href={item.href}
          title={item.title}
          description={item.description}
          footerText={item.footerText}
          imageUrl={item.imageUrl}
        />
      )}
      keyExtractor={(item) => item.id}
      numColumns={3}
      columnWrapperStyle={styles.row}
    />
          </ScrollView>
          </SafeAreaView>
          </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    marginBottom: 10,
    justifyContent:'flex-start'
  },
  card: {
    flex: 0.3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    padding:10,
  },
  cardImage: {
    width: 80,
    height: 80, // Adjust the height as needed
  },
  cardTitle: {
    marginBottom:5,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  cardDescription: {
    textAlign: 'center',
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    width: '90%',
    marginBottom: 5,
  },
  footerText: {
    marginBottom: 5,
  },
});

export default index