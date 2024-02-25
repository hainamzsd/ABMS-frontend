import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../../utils/i18next"; // Your i18n setup file

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    // Load saved language on start
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("@Language");
      if (savedLanguage !== null) {
        i18n.changeLanguage(savedLanguage);
        setCurrentLanguage(savedLanguage);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (language: string) => {
    await AsyncStorage.setItem("@Language", language);
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
