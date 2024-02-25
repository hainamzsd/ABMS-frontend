import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import vi from "../public/locales/vi/translation.json";
import en from "../public/locales/en/translation.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  fallbackLng: "vi",
  lng: "vi",
  resources: {
    vi: vi,
    en: en,
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
