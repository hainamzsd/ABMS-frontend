import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorPalettes } from "../../../constants/colors"; // Import the color palettes
import { SafeAreaView } from "react-native";
import { View } from "react-native";

// Define the shape of your theme and any other properties you might have
interface Theme {
  primary: string;
  secondary: string;
  sub: string;
  background: string;
}

// Define the context value type
interface ThemeContextType {
  theme: Theme;
  currentThemeName: string;
  switchTheme: (themeName: keyof typeof ColorPalettes) => void;
}
const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState(ColorPalettes.default); // Default theme
  const [currentThemeName, setCurrentThemeName] = useState("default");
  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem("theme");
    if (savedTheme && savedTheme in ColorPalettes) {
      setTheme(ColorPalettes[savedTheme as keyof typeof ColorPalettes]);
      setCurrentThemeName(savedTheme);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const switchTheme = async (themeName: keyof typeof ColorPalettes) => {
    setTheme(ColorPalettes[themeName]);
    setCurrentThemeName(themeName);
    await AsyncStorage.setItem("theme", themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, currentThemeName, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
