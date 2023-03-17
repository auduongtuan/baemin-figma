import * as h from "./commandHelper";
import {
  LANGUAGES,
  PREFIX,
  MIXED_VALUE,
  DEFAULT_LANG,
  DATA_FRAME_NAME,
  CODE_FRAME_NAME,
} from "../constant/locale";
import {
  findItemByKey,
  findItemByCharacters,
  LocaleItem,
  LocaleText,
} from "../lib/localeData";
import { js_beautify } from "js-beautify";
const firstPage = figma.root.children[0];
let localeDataFrame = firstPage.findOne(
  (node) => h.getNodeData(node, `${PREFIX}data`) != ""
);

function getLang(node: TextNode) {
  const lang = h.getNodeData(node, `${PREFIX}lang`);
  if(lang == 'en' || lang == 'vi') {
    return lang;
  } else {
    return DEFAULT_LANG;
  }
}

function setLang(node: TextNode, lang: string) {
  h.setNodeData(node, `${PREFIX}lang`, lang);
}
function getKey(node: TextNode) {
  return h.getNodeData(node, `${PREFIX}key`);
}
function setKey(node: TextNode, key: string) {
  h.setNodeData(node, `${PREFIX}key`, key);
}

function changeLang(textNode: TextNode, lang, localeItems: LocaleItem[]) {
  const key = getKey(textNode);
  const item =
    findItemByKey(key, localeItems) ||
    findItemByCharacters(textNode.characters, localeItems);
  if (item && item[lang]) {
    textNode.characters = item[lang];
    setLang(textNode, lang);
  }
}
function autoSetKey(textNode: TextNode, localeItems: LocaleItem[]) {
  const item = findItemByCharacters(textNode.characters, localeItems);
  if(item) {
    setKey(textNode, item.key);
  }
}
const locale = {
  run: async () => {
    figma.showUI(__html__, { title: "Locale editor", width: 360, height: 520 });
    h.postData({ page: "locale" });
    await locale.onSelectionChange();
  },

  switchLang: (lang, localeItems) => {

    h.selection().forEach((selection) => {
      if (h.isText(selection)) {
        changeLang(selection, lang, localeItems);
      } else if (h.isContainer(selection)) {
        const texts = selection.findAll((node) => h.isText(node)) as TextNode[];
        texts.forEach((textNode) => {
          changeLang(textNode, lang, localeItems);
        });
      }
    });
    figma.notify(`Switched selection to ${LANGUAGES[lang]}`);
    locale.onSelectionChange();
  },
  onMessage: async (msg) => {
    switch (msg.type) {
      case "select_texts":
        if (msg.key) {
          const textNodes = figma.currentPage.findAll(
            (node) => h.getNodeData(node, `${PREFIX}key`) == msg.key
          );
          figma.currentPage.selection = [...textNodes];
        }
        break;
      case "auto_set_key":
        console.log('auto set key');
        let count = 0;
        h.selection().forEach((selection) => {
          if (h.isText(selection)) {
            autoSetKey(selection, msg.localeItems);
            count++;
          } else if (h.isContainer(selection)) {
            const texts = selection.findAll((node) => h.isText(node)) as TextNode[];
            texts.forEach((textNode) => {
              autoSetKey(textNode, msg.localeItems);
              count++;
            });
          }
        });
        locale.onSelectionChange();
        break;
      case "update_text":
        // find text node
        const textNode = figma.currentPage.findOne((node) => node.id == msg.id);
        if (textNode && h.isText(textNode)) {
          if (msg.key) h.setNodeData(textNode, `${PREFIX}key`, msg.key);
          if (msg.lang) {
            h.setNodeData(textNode, `${PREFIX}lang`, msg.lang);
          } else {
            h.setNodeData(textNode, `${PREFIX}lang`, DEFAULT_LANG);
          }
          // update text content
          if (msg.localeItem) {
            console.log("Locale item changed", msg.localeItem);
            const currentLang =
              h.getNodeData(textNode, `${PREFIX}lang`) || DEFAULT_LANG;
            h.setNodeData(textNode, `${PREFIX}key`, msg.localeItem.key);
            if (currentLang) textNode.characters = msg.localeItem[currentLang];
          }
          locale.onSelectionChange();
        }
        break;
      case "switch_lang":
        locale.switchLang(msg.lang, msg.localeItems);
        break;
      case "get_locale_data":
        // const localeData = await figma.clientStorage.getAsync('localeData');
        let localeData = {};
        if (localeDataFrame) {
          localeData = h.getNodeData(localeDataFrame, `${PREFIX}data`);
        }
        // console.log(localeItems);
        h.postData({ type: "load_locale_data", localeData });
        break;
      case "save_locale_data":
        // await figma.clientStorage.setAsync('localeData', msg.localeData);
        // console.log('Saved', msg.localeData);
        if (!localeDataFrame) {
          localeDataFrame = figma.createFrame();
          localeDataFrame.resize(100, 100);
          localeDataFrame.name = DATA_FRAME_NAME;
          firstPage.appendChild(localeDataFrame);
        }
        h.setNodeData(localeDataFrame, `${PREFIX}data`, msg.localeData);
        break;
      case "export_code":
        await h.loadRobotoFontsAsync();
        const localeItems = msg.localeItems as LocaleItem[];
        let localeCodeFrame =
          (firstPage.findOne(
            (node) => h.getNodeData(node, `${PREFIX}code`) != ""
          ) as FrameNode) || null;
        if (!localeCodeFrame) {
          localeCodeFrame = figma.createFrame();
          localeCodeFrame.resize(700, 800);
          localeCodeFrame.name = CODE_FRAME_NAME;
          h.setNodeData(localeCodeFrame, `${PREFIX}code`, "1");
          firstPage.appendChild(localeCodeFrame);
        }
        const viJSON = JSON.stringify(
          localeItems.reduce((acc, item) => {
            acc[item.key] = item.vi;
            return acc;
          }, {})
        );
        let codeTextNode =
          (localeCodeFrame.findOne(
            (node) => node.type == "TEXT"
          ) as TextNode) || null;
        if (!codeTextNode) {
          codeTextNode = figma.createText();
          codeTextNode.name = "CODE";
          codeTextNode.fontName = { family: "Roboto Mono", style: "Regular" };
          codeTextNode.textAutoResize = "HEIGHT";
          localeCodeFrame.appendChild(codeTextNode);
        }
        codeTextNode.resizeWithoutConstraints(700, 400);
        codeTextNode.textAutoResize = "HEIGHT";
        codeTextNode.characters = js_beautify(viJSON);
        figma.notify("Code generated");
        break;
      case "show_figma_notify":
        figma.notify(msg.message);
        break;
    }
  },
  onSelectionChange: async () => {
    const selection = h.selection();
    const firstNode = h.selection(0);
    if (selection.length == 1 && h.isText(firstNode)) {
      h.postData({
        type: "change_locale_selection",
        localeSelection: {
          id: firstNode.id,
          key: getKey(firstNode),
          lang: getLang(firstNode),
          characters: firstNode.characters,
        },
      });  
    }
    else if (selection.length >= 1) {
      const allTexts: TextNode[] = selection.reduce((acc, selectionItem) => {
        if (h.isContainer(selectionItem)) {
          const textNodes = selectionItem.findAll((node) => h.isText(node));
          acc.push(...textNodes);
        }
        if (h.isText(selectionItem)) {
          acc.push(selectionItem);
        }
        return acc;
      }, []);
      if (allTexts && allTexts.length > 0) {
        const firstLang = getLang(allTexts[0]);
        const firstKey = getKey(allTexts[0]);
        const isSameLang = allTexts.every(
          (textNode) => getLang(textNode) == firstLang
        );
        const isSameKey = allTexts.every(
          (textNode) => getKey(textNode) == firstKey
        );
        const texts: LocaleText[] = allTexts
          .filter(
            (textNode) =>
              textNode.visible &&
              (!textNode.parent ||
                (h.isContainer(textNode.parent) && textNode.parent.visible)) &&
              (!textNode.parent.parent ||
                (h.isContainer(textNode.parent.parent) && textNode.parent.parent.visible)) &&
              (!textNode.parent.parent.parent ||
                (h.isContainer(textNode.parent.parent.parent) && textNode.parent.parent.parent.visible))
          )
          .map((textNode) => ({
            id: textNode.id,
            key: getKey(textNode),
            lang: getLang(textNode),
            characters: textNode.characters,
          }));
        h.postData({
          type: "change_locale_selection",
          localeSelection: {
            multiple: true,
            lang: isSameLang ? firstLang : MIXED_VALUE,
            key: isSameKey ? firstKey : MIXED_VALUE,
            characters: null,
            texts: texts,
          },
        });
      }
    }

      // const firstLang = h.getNodeData(firstNode, `${PREFIX}lang`);
      // const firstKey = h.getNodeData(firstNode, `${PREFIX}key`);
      // let isSameLang = selection.every((node) => {
      //   return h.getNodeData(node, `${PREFIX}lang`) == firstLang;
      // });
      // if(isSameLang) {
      //   console.log('same lang');
      // } else {
      //   console.log('mixed lang');
      // }
    else {
      h.postData({ type: "change_locale_selection", localeSelection: null });
    }
  },
};
export default locale;
