import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  addLocaleItem,
  setLocaleData,
  updateLocaleItems,
  updateLocaleItem,
  removeLocaleItem,
  updateTextInLocaleSelection,
  updateTextsInLocaleSelection,
} from "./localeSlice";
import type { RootState } from "./store";
import {runCommand} from "../uiHelper";
import { LocaleData } from "../../lib/localeData";
export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(
    setLocaleData,
    addLocaleItem,
    updateLocaleItem,
    updateLocaleItems,
    removeLocaleItem
  ),
  effect: (action, listenerApi) => {
    const modifiedTime = new Date().toJSON();
    const state = listenerApi.getState() as RootState;
    const localeData: LocaleData = {
      sheetName: state.locale.sheetName,
      sheetId: state.locale.sheetId,
      modifiedTime: modifiedTime,
      localeItems: state.locale.localeItems,
    };
    console.log('LOCALE DATA IN MIDDLEWARE', localeData);
    runCommand("save_locale_data", {
      localeData: localeData
    });
  },
});