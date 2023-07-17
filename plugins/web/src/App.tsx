import { useState } from "react";
import i18next from "i18next";
// import './App.css'
import "ds/src/ui.css";
import { initReactI18next } from "react-i18next";
import en from "./i18n/en.json";
import vi from "./i18n/vi.json";
import { useTranslation, Trans } from "react-i18next";
i18next.use(initReactI18next).init({
  lng: "en", // if you're using a language detector, do not define the lng option
  debug: true,
  defaultNS: "translations",
  resources: {
    en: {
      translations: en,
    },
    vi: {
      translations: vi,
    },
  },
});

import { Button } from "ds";
function App() {
  const { t, i18n } = useTranslation();
  return (
    <div className="App">
      <h2>{t("common.dish_with_count", { count: 1 })}</h2>
      <Button>{t("common.back")}</Button>
      <div>{t("welcome", { name: "Test" })}</div>
    </div>
  );
}

export default App;
