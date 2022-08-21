import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "de",
    lng: "de",
    debug: true,
    defaultNS: "common",
    fallbackNS: "common",
    ns: "common",
    load: "languageOnly",
    backend: {
      loadPath: "http://localhost:3000/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });
