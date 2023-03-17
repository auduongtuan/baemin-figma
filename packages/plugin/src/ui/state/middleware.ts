import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  addLocaleItemsItem,
  updateMatchedItem,
  setLocaleData,
  updateLocaleItems,
} from "./localeSlice";
import type { RootState } from "./store";
import {runCommand} from "../uiHelper";
export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(
    setLocaleData,
    addLocaleItemsItem,
    updateMatchedItem,
    updateLocaleItems
  ),
  effect: (action, listenerApi) => {
    const modifiedTime = new Date().toJSON();
    const state = listenerApi.getState() as RootState;
    const localeData = JSON.stringify({
      sheetName: state.locale.sheetName,
      sheetId: state.locale.sheetId,
      modifiedTime: modifiedTime,
      items: state.locale.localeItems,
    });
    runCommand("save_locale_data", {
      localeData,
    });
  },
});
