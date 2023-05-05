import { postData } from "figma-helpers";
import switchLang from "./selection/switchLang";
import { updateTextByIds } from "./text/updateText";
import autoSetKeyForSelection from "./selection/autoSetKey";
import { getLocaleData, saveLocaleData } from "./general/localeData";
import printCodeBlock from "./general/printCodeBlock";
import updateSelection from "./selection/updateSelection";
import selectTexts from "./selection/selectTexts";
import createAnnotation from "./selection/createAnnotation";
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
        const { ids, ...rest } = msg;
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
