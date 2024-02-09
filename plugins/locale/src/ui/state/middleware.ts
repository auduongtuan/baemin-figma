import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  addLocaleItem,
  addLocaleItems,
  setLocaleData,
  updateLocaleItem,
  removeLocaleItem,
  removeLocaleItems,
  moveLocaleItemsToLibrary,
  moveLocaleItemsToGroup,
} from "./localeSlice";
import type { RootState } from "./store";
import { runCommand } from "../uiHelper";
import { SavedLocaleData } from "../../lib";
export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(
    setLocaleData,
    addLocaleItem,
    addLocaleItems,
    updateLocaleItem,
    removeLocaleItem,
    removeLocaleItems,
    moveLocaleItemsToLibrary,
    moveLocaleItemsToGroup
  ),
  effect: (action, listenerApi) => {
    const modifiedTime = new Date().toJSON();
    const state = listenerApi.getState() as RootState;
    const localeData: SavedLocaleData = {
      sheetName: state.locale.sheetName,
      sheetId: state.locale.sheetId,
      modifiedTime: modifiedTime,
      localeItems: state.locale.localeItems,
    };
    // console.log('LOCALE DATA IN MIDDLEWARE', localeData);
    runCommand("save_locale_data", {
      localeData: localeData,
    });
  },
});
