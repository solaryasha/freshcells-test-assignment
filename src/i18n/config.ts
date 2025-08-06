import i18n from "i18next";                      
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

export const supportedLngs = {
  en: "English",
  ge: "German",
};


i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: Object.keys(supportedLngs),
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;