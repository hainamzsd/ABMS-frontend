  import React from 'react';
  import { View, Image, StyleSheet, Dimensions } from 'react-native';
  import SHADOW from '../../constants/shadow';
  import { Link } from 'expo-router';
  import Button from './button';
  import { ColorPalettes } from '../../constants';
import { truncateText } from '../../utils/truncate';
import { Badge,Box,Text, VStack } from 'native-base';
import { statusForReceptionist } from '../../constants/status';


  const { width } = Dimensions.get('window');

  interface PostItemProps {
    title: string;
    content: string;
    date: string;
    imageUrl: string;
    href: any;
    status:number;
  }

  const PostItem: React.FC<PostItemProps> = ({ title, content, date, imageUrl, href, status }) => {
    return (

      <View style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <View style={{}}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
            <Text numberOfLines={2} style={styles.content}>{truncateText(content,150)}</Text>
            <Text style={styles.date}>{date}</Text>
            
          </View>
          
          <Link href={href} style={{ marginTop: 10 }}>
            <VStack space={2}>
          {/* <Badge p={2} borderRadius={'md'} backgroundColor={statusForReceptionist[status].color}
            >
              <Text color={'white'}>
              {statusForReceptionist[status].status}
              </Text>
            </Badge> */}
            <Button text='Chi tiết' style={{ width: 100 }}></Button>
            </VStack>
          </Link>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 10,
      borderBottomColor: '#cccccc',
      ...SHADOW,
      backgroundColor: ColorPalettes.ocean.sub,
      borderRadius: 10,
      marginBottom: 10
    },
    image: {
      width: 100,
      height: 100,
      marginRight: 10,
      borderRadius: 10, // Adjust for rounded corners
    },
    textContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color: '#333333',
      overflow: 'hidden',
    },
    content: {
      fontSize: 14,
      color: '#666666',
      marginBottom: 5,
    },
    date: {
      fontSize: 12,
      color: '#999999',
    },
  });

  export default PostItem;
