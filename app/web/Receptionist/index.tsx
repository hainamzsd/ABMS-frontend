import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, Text } from 'react-native';
import {firebase} from '../../../config'
const ImageList = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const reference = firebase.database().ref('/imageFolders/visitors/aAbCiIs9-GmY1-BjQz-dEKp-pAlxfJXDls0Uu5Pa/images');
      
      try {
        const snapshot = await reference.once('value');
        const images = snapshot.val();
        // Adjust here to directly use the values since they are already URLs
        const urls = Object.values(images); // Directly use Object.values to extract URLs
        setImageUrls(urls as any);
        console.log(urls + " oi doi oi");
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView>
      {isLoading && <Text>Loading images...</Text>}
      {error && <Text>Error: {error}</Text>}
      {imageUrls.length > 0 && (
        <View>
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              style={{ width: 400, height: 400 }}
              source={{ uri: url }}
              onError={() => console.warn(`Error loading image: ${url}`)} // Handle loading errors (optional)
            />
          ))}
        </View>
      )}
      {imageUrls.length === 0 && !isLoading && <Text>No images found.</Text>}
    </ScrollView>
  );
};

export default ImageList;