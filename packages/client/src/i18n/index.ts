import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import frAuth from "./locales/fr/auth.json";
import frCommon from "./locales/fr/common.json";

const DEFAULT_LANGUAGE = "fr";

if (!i18n.isInitialized) {
  void i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: enCommon, auth: enAuth },
        fr: { common: frCommon, auth: frAuth }
      },
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      initAsync: false
    });
}

if (typeof window !== "undefined") {
  const stored = window.localStorage.getItem("app-lang");

  if (stored && stored !== i18n.language) {
    void i18n.changeLanguage(stored);
  }
}

export { i18n };
