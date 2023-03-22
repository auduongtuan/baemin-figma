import {postData} from "./commandHelper";
import { switchLang } from "./locale/common";
import updateText from "./locale/updateText";
import autoSetKeyForSelection from "./locale/autoSetKey";
import { getLocaleData, saveLocaleData } from "./locale/localeData";
import exportCode from "./locale/exportCode";
import updateSelection from "./locale/updateSelection";
import selectTexts from "./locale/selectTexts";
import { LocaleItem } from "../lib/localeData";
const locale = {
  run: () => {
    figma.showUI(__html__, { title: "Locale editor", width: 360, height: 640 });
    postData({ page: "locale" });
    updateSelection();
  },
  onMessage: (msg) => {
    switch (msg.type) {
      case "select_texts":
        selectTexts(msg.key);
        break;
      case "auto_set_key":
        autoSetKeyForSelection(msg.localeItems);
        break;
      case "update_text":
        updateText(msg);
        // figma.notify('updateText');
        break;
      case "switch_lang":
        switchLang(msg.lang, msg.localeItems);
        break;
      case "get_locale_data":
        getLocaleData();
        break;
      case "save_locale_data":
        saveLocaleData(msg.localeDataString);
        break;
      // case "export_code":
      //   await exportCode(msg.localeItems as LocaleItem[]);
      //   break;
      case "show_figma_notify":
        figma.notify(msg.message);
        break;
    }
  },
  onSelectionChange: () => {
    updateSelection();
  },
};
export default locale;
