// import { postData } from "figma-helpers";
// import switchLang from "./selection/switchLang";
// import { updateTextsByIds } from "./text/updateText";
// import autoSetKeyForSelection from "./selection/autoSetKey";
// import { getLocaleData, saveLocaleData } from "./general/localeData";
// import printCodeBlock from "./general/printCodeBlock";
// import updateSelection from "./selection/updateSelection";
// import selectTexts from "./selection/selectTexts";
// import createAnnotation from "./selection/createAnnotation";
// import io from "figma-helpers/io";

// figma.skipInvisibleInstanceChildren = true;
// io.on("select_texts", (msg) => selectTexts(msg.key));
// io.on("auto_set_key", (msg) => autoSetKeyForSelection(msg.localeItems));
// io.on("update_texts", (msg) => {
//   const { ids, ...rest } = msg;
//   updateTextsByIds(ids, rest);
// });
// io.on("switch_lang", (msg) => switchLang(msg.lang, msg.localeItems));
// io.on("get_locale_data", () => {
//   console.log("get locale data");
//   getLocaleData();
// });
// io.on("save_locale_data", (msg) => saveLocaleData(msg.localeData));
// io.on(
//   "print_code_block",
//   async (msg) => await printCodeBlock(msg.library, msg.langJSONs, msg.scope)
// );
// io.on(
//   "create_annotation",
//   async (msg) => await createAnnotation(msg.localeTexts)
// );
// io.on("show_figma_notify", (msg) => figma.notify(msg.message));

//   export const run = () => {
//     figma.showUI(__html__, { title: "Locale editor", width: 360, height: 640 });
//     updateSelection();
//   },
//   onMessage: async (msg) => {
//     switch (msg.type) {
//       case "select_texts":
//         selectTexts(msg.key);
//         break;
//       case "auto_set_key":
//         autoSetKeyForSelection(msg.localeItems);
//         break;
//       case "update_texts":
//         const { ids, ...rest } = msg;
//         updateTextsByIds(ids, rest);
//         // figma.notify('updateText');
//         break;
//       case "switch_lang":
//         switchLang(msg.lang, msg.localeItems);
//         break;
//       case "get_locale_data":
//         getLocaleData();
//         break;
//       case "save_locale_data":
//         saveLocaleData(msg.localeData);
//         break;
//       case "print_code_block":
//         await printCodeBlock(msg.library, msg.langJSONs, msg.scope);
//         break;
//       case "create_annotation":
//         await createAnnotation(msg.localeTexts);
//         break;
//       case "show_figma_notify":
//         figma.notify(msg.message);
//         break;
//     }
//   },
//   onSelectionChange: () => {
//     updateSelection();
//   },
// };
// export default locale;
