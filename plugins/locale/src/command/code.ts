import {
  PLUGIN_NAME,
  INITIAL_DEFAULT_LANGUAGE,
  INITIAL_LANGUAGES,
  DEFAULT_FONTS,
} from "./../lib/constant";
import { updateTextsAsync } from "./text/updateText";
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

figma.skipInvisibleInstanceChildren = true;
io.on("select_texts", (msg) => selectTexts(msg.key));
io.on("auto_set_key", (msg) => autoSetKeyForSelection(msg.localeItems));
io.on("update_texts", (msg) => {
  const { ids, items, ...rest } = msg;
  // updateTextsByIds(ids, rest);
  updateTextsAsync(rest, items, ids).then(() => {
    io.send("update_texts", { success: true });
  });
});
io.on("get_locale_data", async () => {
  io.send("get_locale_data", { localeData: await getLocaleData() });
});
io.on("save_locale_data", async (msg) => await saveLocaleData(msg.localeData));
io.on(
  "print_code_block",
  async (msg) =>
    await printCodeBlock(msg.library, msg.langJSONs, msg.format, msg.scope)
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
  configs
    .fetch({
      languages: INITIAL_LANGUAGES,
      defaultLanguage: INITIAL_DEFAULT_LANGUAGE,
    })
    .then((data) => {
      configs.setAll(data);
      io.send("get_configs", { configs: configs.getAll() });
    });
});
io.on("set_configs", async (msg) => {
  configs.setAll(msg.configs);
  const success = await configs.save();
  if (success) {
    io.send("set_configs");
  }
});
figma.on("run", (runEvent: RunEvent) => {
  configs
    .fetch({
      languages: INITIAL_LANGUAGES,
      defaultLanguage: INITIAL_DEFAULT_LANGUAGE,
    })
    .then((data) => {
      configs.setAll(data);
      changeText.loadFonts(DEFAULT_FONTS).then(() => {
        figma.showUI(__html__, {
          title: PLUGIN_NAME,
          width: 360,
          height: 640,
        });
        if (figma.editorType == "dev") {
          io.send("dev_mode", { devMode: true });
        } else {
          io.send("dev_mode", { devMode: false });
        }
        updateSelection();
      });
    });
});
figma.on("selectionchange", async () => {
  updateSelection();
});
