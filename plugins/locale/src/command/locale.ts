import {postData, selection} from "figma-helpers";
import switchLang from "./locale/switchLang";
import {updateTextByIds} from "./locale/updateText";
import autoSetKeyForSelection from "./locale/autoSetKey";
import { getLocaleData, saveLocaleData } from "./locale/localeData";
import printCodeBlock from "./locale/printCodeBlock";
import updateSelection from "./locale/updateSelection";
import selectTexts from "./locale/selectTexts";
import { LocaleItem } from "../lib/localeData";
import createAnnotation from "./locale/createAnnotation";
figma.skipInvisibleInstanceChildren = true;
const locale = {
  run: () => {
    figma.showUI(__html__, { title: "Locale editor", width: 360, height: 640 });
    postData({ page: "locale" });
    updateSelection();

  },
  onMessage: async (msg) => {
    switch (msg.type) {
      case "select_texts":
        selectTexts(msg.key);
        break;
      case "auto_set_key":
        autoSetKeyForSelection(msg.localeItems);
        break;
      case "update_text":
        const {ids, ...rest} = msg;
        updateTextByIds(ids, rest);
        // figma.notify('updateText');
        break;
      case "switch_lang":
        switchLang(msg.lang, msg.localeItems);
        break;
      case "get_locale_data":
        getLocaleData();
        break;
      case "save_locale_data":
        saveLocaleData(msg.localeData);
        break;
      case "print_code_block":
        await printCodeBlock(msg.library, msg.langJSONs);
        break;
      case "create_annotation":
        await createAnnotation(msg.localeTexts);
        break;
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
