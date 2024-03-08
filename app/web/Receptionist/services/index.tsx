import { View, Text, ScrollView, SafeAreaView, FlatList, StyleSheet, Image } from 'react-native'
import React from 'react'
import SHADOW from '../../../../constants/shadow'

// Sample data for the cards
const data = [
  { id: '1', title: 'Card 1', description: 'Description for Card 1', footerText: 'Footer 1', imageUrl: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Card 2', description: 'Description for Card 2', footerText: 'Footer 2', imageUrl: 'https://via.placeholder.com/150' },
  { id: '3', title: 'Card 3', description: 'Description for Card 3', footerText: 'Footer 3', imageUrl: 'https://via.placeholder.com/150' },
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
}
const CardItem: React.FC<CardItemProps> = ({ title, description, footerText, imageUrl }) => (
  <View style={styles.card}>
    <Image source={{ uri: imageUrl }} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <View style={styles.separator} />
    <Text style={styles.footerText}>{footerText}</Text>
  </View>
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
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100, // Adjust the height as needed
  },
  cardTitle: {
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