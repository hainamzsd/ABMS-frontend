import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, SectionList, Button, Image } from 'react-native'
import React, { useState } from 'react'
import SHADOW from '../../../../../constants/shadow'
import LoadingComponent from '../../../../../components/resident/loading'
import Header from '../../../../../components/resident/header'
import { ScrollView } from 'react-native'
import { Camera, Info, X } from 'lucide-react-native'
import Label from '../../../../../components/resident/lable'
import { useTheme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-native-element-dropdown'
import * as ImagePicker from 'expo-image-picker';

interface ImageInfo {
  uri: string;
  name: string | null | undefined;
  type: "image" | "video" | undefined;
}

const parkingCardRegisterScreen = () => {
  const pickImages = async () => {
    const options: any = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
    };

    try {
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        const selectedImages = result.assets?.length > 5
          ? result.assets.slice(0, 5)
          : result.assets;

        // Create an array of objects to store image data
        const imageData = selectedImages.map((file) => {

          return { uri: file.uri, name: file.fileName, type: file.type };
        });

        setSelectedImages(imageData);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([])
  const removeImage = (index: number) => {
    const newSelectedImages = [...selectedImages]; // Create a copy to avoid mutation
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);
  };

  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const vehicleTypeList = [
    { label: t("Car"), value: "Car" },
    { label: t("Motorbike"), value: "Motorbike" },
    { label: t("Bicycle"), value: "Bicycle" },
  ]
  const [vehicleTypes, setVehicleTypes] = useState(null);
  const isButtonDisabled = false;
  return (
    <>
      <LoadingComponent loading={loading}></LoadingComponent>
      <Header headerTitle={t("Elevator request")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <View style={{ marginHorizontal: 26, paddingVertical: 20 }}>
            <View
              style={[
                { backgroundColor: theme.sub, borderColor: theme.primary },
                styles.headerBox,
              ]}
            >
              <Info color={"black"} style={{ marginRight: 5 }}></Info>
              <Text>{t("The information will be used to register for parking in the apartment")}</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("Vehicle type")} required></Label>
              <Dropdown
                style={styles.comboBox}
                placeholderStyle={{ fontSize: 14 }}
                placeholder={t("Choose vehicle type")}
                itemContainerStyle={{ borderRadius: 10, borderTopWidth: 0.5, borderColor: '#9c9c9c' }}
                itemTextStyle={{ fontSize: 14 }}
                data={vehicleTypeList}
                value={vehicleTypeList}
                search={false}
                labelField="label"
                valueField="value"
                onChange={(item: any) => {
                  setVehicleTypes(item.value);
                }}
              ></Dropdown>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Color")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("License plate")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput]}
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label required text={t("Note")}></Label>
              <View style={[styles.inputContainer]}>
                <TextInput
                  multiline
                  placeholder={t("Type") + "..."}
                  placeholderTextColor={"#9C9C9C"}
                  style={[styles.textInput, { height: 100 }]}
                  numberOfLines={4}
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Label text={t("Image")} required></Label>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.imageText}>• {t("Full photo of vehicle registration certificate")}</Text>
                <Text style={styles.imageText}>• {t("Photo of the vehicle with clear colors. For bicycles, the photo needs to have the brand logo")}</Text>
                <Text style={styles.imageText}>• {t("Apartment contract")}</Text>
                <Text style={styles.imageText}>• {t("Identification documents to authenticate the owner")}</Text>
                <Text style={styles.imageText}>• {t("Maximum number of images")}: 20</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Pressable style={styles.chooseImageBox} onPress={pickImages}>
                <View style={{ alignItems: 'center' }}>
                  <Camera color={'black'} size={30}></Camera>
                  <Text>{t("Choose image")}</Text>
                </View>
              </Pressable>
              {selectedImages.length > 0 &&
                <SectionList
                  horizontal
                  sections={[{ data: selectedImages }]}
                  renderItem={({ item, index }) => <View style={styles.imageContainer}>
                    <Image source={{ uri: item.uri }} style={styles.image} />
                    <Pressable style={styles.closeButton} onPress={() => removeImage(index)}>
                      <X color="white" />
                    </Pressable>
                  </View>}
                  keyExtractor={(item) => item.uri}
                />}
            </View>
            <View style={{ marginTop: 20 }}>
              <Pressable
                disabled={isButtonDisabled}
                style={[
                  {
                    backgroundColor: theme.primary,
                    opacity: isButtonDisabled ? 0.7 : 1,
                  },
                  styles.button,
                ]}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Tiếp tục
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  chooseImageBox: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    marginRight: 5
  },
  headerBox: {
    marginTop: 20,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 5,
    ...SHADOW,
  },
  comboBox: {
    backgroundColor: 'white',
    ...SHADOW,
    borderRadius: 10,
    padding: 10,
    marginTop: 5
  },
  textInput: {
    flex: 1,
    padding: 15,
  },
  button: {
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 5
  },
  imageText: {
    color: '#9C9C9C',
    margin: 5,
    fontSize: 14
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 50,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default parkingCardRegisterScreen