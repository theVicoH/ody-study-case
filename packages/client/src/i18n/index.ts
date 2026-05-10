import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import frAuth from "./locales/fr/auth.json";
import frCommon from "./locales/fr/common.json";

if (!i18n.isInitialized) {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: enCommon, auth: enAuth },
        fr: { common: frCommon, auth: frAuth }
      },
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      initAsync: false
    });
}

export { i18n };
