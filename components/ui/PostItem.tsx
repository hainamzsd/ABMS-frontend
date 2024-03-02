import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import SHADOW from '../../constants/shadow';
import { Link } from 'expo-router';
import Button from './button';

const { width } = Dimensions.get('window');

interface PostItemProps {
  title: string;
  content: string;
  date: string;
  imageUrl: string;
  href:any;
}

const PostItem: React.FC<PostItemProps> = ({ title, content, date, imageUrl,href }) => {
  return (
    
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text numberOfLines={2} style={styles.content}>{content}</Text>
        <Text style={styles.date}>{date}</Text>
        <Link href={href}>
            <Button text='Chi tiết' style={{width:100}}></Button>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    ...SHADOW,
    backgroundColor:'white',
    borderRadius:10,
    marginBottom:10
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10, // Adjust for rounded corners
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333333', // Adjust title color
    overflow: 'hidden',
  },
  content: {
    fontSize: 14,
    color: '#666666', // Adjust content color
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999999', // Adjust date color
  },
});

export default PostItem;
