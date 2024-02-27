import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import Header from "../../../components/resident/header";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import SHADOW from "../../../constants/shadow";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { useState } from "react";
import Label from "../../../components/resident/lable";
export default function FeedBack() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [service, setService] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>("");
  const isButtonDisabled = !service || !description;

  const [image, setImage] = useState<string | undefined>(undefined);
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <>
      <Header headerTitle={t("Feedback")}></Header>
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View style={{ marginHorizontal: 26 }}>
          <View style={{ marginTop: 30 }}>
            <Label text={t("Service")} required></Label>
            <RNPickerSelect
              style={{
                inputIOS: styles.picker,
                inputAndroid: styles.picker,
              }}
              onValueChange={(value) => setService(value)}
              items={[
                { label: "Football", value: "football" },
                { label: "Baseball", value: "baseball" },
                { label: "Hockey", value: "hockey" },
              ]}
            />
            <View style={{ marginTop: 30 }}>
              <Label text={t("Description")} required></Label>
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.input}
                placeholder={t("Type") + "..."}
                placeholderTextColor={"#9C9C9C"}
                value={description}
                onChangeText={(text) => setDescription(text)}
              ></TextInput>
            </View>
            <Pressable style={styles.imageContainer} onPress={pickImage}>
              {!image && <Text>{t("Choose image")}</Text>}
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 150, height: 150 }}
                />
              )}
            </Pressable>
            <Pressable
              disabled={isButtonDisabled}
              style={[
                styles.button,
                {
                  backgroundColor: theme.primary,
                  opacity: isButtonDisabled ? 0.7 : 1,
                },
              ]}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {t("Send")}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 30,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  picker: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    ...SHADOW,
  },
  input: {
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    height: 150,
    ...SHADOW,
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
  button: {
    ...SHADOW,
    marginTop: 40,
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
});
