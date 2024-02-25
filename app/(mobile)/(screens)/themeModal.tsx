import { Stack } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { ColorPalettes } from "../../../constants/colors";
import { StyleSheet, View, Text } from "react-native";
import { FlatList } from "react-native";
import { Pressable } from "react-native";
import { StatusBar } from "react-native";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
export default function ThemeModal() {
  const { theme, currentThemeName, switchTheme } = useTheme();
  const themes = Object.keys(ColorPalettes);
  const { t } = useTranslation();
  const handleSelectTheme = (themeName: keyof typeof ColorPalettes) => {
    switchTheme(themeName);
  };

  return (
    <View style={{}}>
      <StatusBar barStyle={"light-content"} />
      <View style={[styles.modalView, { backgroundColor: theme.background }]}>
        <FlatList
          data={themes}
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
                <View
                  style={{
                    height: 20,
                    width: 40,
                    backgroundColor: ColorPalettes[item].primary,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                ></View>
                <Pressable
                  onPress={() =>
                    handleSelectTheme(item as keyof typeof ColorPalettes)
                  }
                >
                  <Text style={styles.themeText}>{t(item)}</Text>
                </Pressable>
              </View>
              {currentThemeName === item && <Check color={"black"} />}
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </View>
  );
}

// Update your StyleSheet to include the selectedThemeItem style
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
