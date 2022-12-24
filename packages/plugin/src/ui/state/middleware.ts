import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  addLocaleItemsItem,
  updateMatchedItem,
  setLocaleData
} from "./localeSlice";
import type { RootState } from "./store";
import * as ui from "../uiHelper";
export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(setLocaleData, addLocaleItemsItem, updateMatchedItem),
  effect: (action, listenerApi) => {
    const state = (listenerApi.getState() as RootState);
    const localeData = JSON.stringify({
      sheetName: state.locale.sheetName,
      sheetId: state.locale.sheetId,
      modifiedTime: new Date().toJSON(),
      items: state.locale.localeItems,
    });
    // console.log(localeItems);
    console.log ('update storage');
    ui.postData({
      type: "save_locale_data",
      localeData,
    });
  },
});
