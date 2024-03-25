import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Text } from 'react-native';
import { firebase } from '../../../config'
import { Popover, Button, Input, FormControl, Icon } from "native-base";
import { PhoneIcon } from 'lucide-react-native';
import axios from 'axios';
import { API_BASE, actionController } from '../../../constants/action';
import { ToastFail, ToastSuccess } from '../../../constants/toastMessage';


const ImageList = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialFocusRef = useRef(null);
  const [hotlineNumber, setHotlineNumber] = useState("");
  const [hotlineName, setHotlineName] = useState("");

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

  // PUT: Save changes -> HOTLINE
  const handleSaveHotline = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${API_BASE}/${actionController.HOTLINE}/...`);
      if (response.status === 200) {
        ToastSuccess('Cập nhập hotline thành công');
      } else {
        ToastFail('Cập nhập thông tin thất bại')
      }
    } catch (error) {
      ToastFail(error)
    }
  }

  return (
    <ScrollView>
      {/* {isLoading && <Text>Loading images...</Text>}
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
      {imageUrls.length === 0 && !isLoading && <Text>No images found.</Text>} */}
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>

          {/* POPOVER: Hotline */}
          <Popover initialFocusRef={initialFocusRef} trigger={triggerProps => {
            return <Button leftIcon={<Icon name="phone-icon" as={PhoneIcon} color="white" />} colorScheme="orange" {...triggerProps}> 0964766165 </Button>;
          }}>
            <Popover.Content width="56">
              <Popover.Arrow />
              <Popover.CloseButton />
              {
                /* @ts-ignore */
              }
              <Popover.Header>HOTLINE</Popover.Header>
              <Popover.Body>
                <FormControl>
                  <FormControl.Label _text={{
                    fontSize: "xs",
                    fontWeight: "medium"
                  }}>
                    Số điện thoại (Hotline)
                  </FormControl.Label>
                  <Input rounded="sm" fontSize="xs" ref={initialFocusRef} value={hotlineNumber} onChangeText={(text) => setHotlineNumber(text)} />
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label _text={{
                    fontSize: "xs",
                    fontWeight: "medium"
                  }}>
                    Ghi chú
                  </FormControl.Label>
                  <Input rounded="sm" fontSize="xs" value={hotlineName} onChangeText={(text) => setHotlineName(text)} />
                </FormControl>
              </Popover.Body>
              <Popover.Footer>
                <Button.Group>
                  <Button onPress={handleSaveHotline}>Lưu thay đổi</Button>
                </Button.Group>
              </Popover.Footer>
            </Popover.Content>
          </Popover>
        </View>

      </View >
    </ScrollView>
  );
};

export default ImageList;