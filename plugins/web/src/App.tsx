import { useState } from 'react'
// import './App.css'
import "ds/ui.scss";
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { I18n } from "i18n-js";

// import i18next from 'i18next';
// import { initReactI18next } from "react-i18next";
// import { useTranslation, Trans } from "react-i18next";
// i18next.use(initReactI18next).init({
//   lng: 'en', // if you're using a language detector, do not define the lng option
//   debug: true,
//   defaultNS: 'translations',
//   resources: {
//     en: {
//       translations: en
//     },
//     vi: {
//       translations: vi
//     }
//   },
// });
const i18n = new I18n({
  en,
  vi
});


i18n.defaultLocale = "en";

import {Button} from 'ds';
function App() {
  // const { t, i18n } = useTranslation();
  return (
    <div className="App">
      {/* <Button variant="primary">{t('common.dish_with_count', {count: 1})}</Button>
      <Button>{t("common.back")}</Button>
      <Button>{t("welcome", {name: 'Test'})}</Button> */}
      {i18n.t('translation.dish_with_count_test', {count: 2})}
    </div>
  )
}

export default App
