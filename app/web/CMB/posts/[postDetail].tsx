import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../../../components/ui/button';
import Input from '../../../../components/ui/input';
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
// Import the image picker

const page = ({  }) => {
  // State for post details
  const [title, setTitle] = useState("aa");
  const [content, setContent] = useState('aaaa');
  const [image, setImage] = useState("https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408.jpg");

  const navigation = useNavigation();
  return (
    <View
    style={{
      flex: 1,
      paddingHorizontal: 30,
      paddingVertical: 30,
      backgroundColor: "#F9FAFB",
    }}
  >
    <SafeAreaView>
      <ScrollView>
        <Button
          style={{ width: 100, marginBottom: 20 }}
          text="Quay Lại"
          onPress={() => console.log(navigation.canGoBack())}
        ></Button>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
            Title
          </Text>
          <Text>Thông tin bài viết</Text>
        </View>
       
      </ScrollView>
    </SafeAreaView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderColor: 'grey',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default page;
