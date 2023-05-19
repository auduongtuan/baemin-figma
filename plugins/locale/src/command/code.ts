import { LANGUAGES } from "./../lib/constant";
import switchLang from "./selection/switchLang";
import { updateTextsByIds } from "./text/updateText";
import autoSetKeyForSelection from "./selection/autoSetKey";
import { getLocaleData, saveLocaleData } from "./general/localeData";
import printCodeBlock from "./general/printCodeBlock";
import updateSelection from "./selection/updateSelection";
import selectTexts from "./selection/selectTexts";
import createAnnotation from "./selection/createAnnotation";
import io from "figma-helpers/io";
import { getTexts } from "./text/textNodes";
import changeText from "figma-helpers/changeText";
import configs from "figma-helpers/configs";
const dsFonts = [
  { family: "Roboto", style: "Regular" },
  { family: "Roboto", style: "Medium" },
  { family: "Roboto", style: "SemiBold" },
  { family: "Roboto", style: "Bold" },
  { family: "Roboto Mono", style: "Regular" },
  { family: "Roboto Mono", style: "Medium" },
  { family: "Roboto Mono", style: "SemiBold" },
  { family: "Roboto Mono", style: "Bold" },
];

figma.skipInvisibleInstanceChildren = true;
io.on("select_texts", (msg) => selectTexts(msg.key));
io.on("auto_set_key", (msg) => autoSetKeyForSelection(msg.localeItems));
io.on("update_texts", (msg) => {
  const { ids, ...rest } = msg;
  updateTextsByIds(ids, rest);
});
io.on("switch_lang", (msg) => switchLang(msg.lang, msg.localeItems));
io.on("get_locale_data", () => {
  io.send("get_locale_data", { localeData: getLocaleData() });
});
io.on("save_locale_data", (msg) => saveLocaleData(msg.localeData));
io.on(
  "print_code_block",
  async (msg) => await printCodeBlock(msg.library, msg.langJSONs, msg.scope)
);
io.on(
  "create_annotation",
  async (msg) => await createAnnotation(msg.localeTexts)
);
io.on("show_figma_notify", (msg) => figma.notify(msg.message));
io.on("get_texts_in_page", () => {
  io.send("get_texts_in_page", { texts: getTexts() });
});
io.on("get_configs", (msg) => {
  configs.init({ languages: LANGUAGES });
  io.send("get_configs", { configs: configs.getAll() });
});
figma.on("run", ({ command, parameters }: RunEvent) => {
  changeText.loadFonts(dsFonts, () => {
    figma.showUI(__html__, { title: "Locale editor", width: 360, height: 640 });
    updateSelection();
  });
});
figma.on("selectionchange", async () => {
  updateSelection();
});

// // figma.parameters.on('input', ({ parameters, key, query, result }: ParameterInputEvent) => {
// //   switch (key) {
// //     case 'truncate_type':
// //       const truncateTypes = ['end', 'middle']
// //       result.setSuggestions(truncateTypes.filter(s => s.includes(query)))
// //       break

// //     default:
// //       return
// //   }
// // })
