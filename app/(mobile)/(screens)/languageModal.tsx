import { Stack } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { ColorPalettes } from "../../../constants/colors";
import { StyleSheet, View, Text, Image } from "react-native";
import { FlatList } from "react-native";
import { Pressable } from "react-native";
import { StatusBar } from "react-native";
import { Check } from "lucide-react-native";
import i18n from "../../../utils/i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
export default function languageModal() {
  const { theme, currentThemeName, switchTheme } = useTheme();
  const { t } = useTranslation();
  const languages = [
    {
      code: "en",
      name: "English",
      img: require("../../../assets/images/england.png"),
    },
    {
      code: "vi",
      name: "Vietnam",
      img: require("../../../assets/images/vietnam.png"),
    },
  ];
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  return (
    <View style={{}}>
      <StatusBar barStyle={"light-content"} />
      <View style={[styles.modalView, { backgroundColor: theme.background }]}>
        <FlatList
          data={languages}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderBottomWidth: 0.4,
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    height: 30,
                    width: 40,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                  source={item.img}
                />
                <Pressable onPress={() => changeLanguage(item.code)}>
                  <Text style={styles.themeText}>{t(item.name)}</Text>
                </Pressable>
              </View>
              {currentLanguage === item.code && <Check color={"black"} />}
            </View>
          )}
          keyExtractor={(item) => item.code}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  themeText: {
    fontSize: 16,
  },
  // Style for the selected theme item
  selectedThemeItem: {
    backgroundColor: "#E0E0E0", // Example background color for highlighting
    borderColor: "blue", // Example border color
    borderWidth: 2, // Example border width
  },
});
