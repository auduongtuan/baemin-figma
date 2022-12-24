import * as h from "./commandHelper";
import {LANGUAGES, PREFIX, MIXED_VALUE} from '../constant/locale';
import {findItemByKey, findItemByCharacters} from '../lib/localeData';

const locale = {
  run: async () => {
    figma.showUI(__html__, { title: "Locale editor", width: 360, height: 520 });
    h.postData({ type: "locale"});
    locale.onSelectionChange();
  },

  switchLang: (lang, localeItems) => {
    function changeLang(textNode: TextNode) {
      const key = h.getNodeData(textNode, `${PREFIX}key`);
      const item = findItemByKey(key, localeItems) || findItemByCharacters(textNode.characters, localeItems);
      if(item && item[lang]) {
        textNode.characters = item[lang];
        h.setNodeData(textNode, `${PREFIX}lang`, lang);
      }
    }
    h.selection().forEach(selection => {
      if(h.isText(selection)) {
        changeLang(selection);
      } else if (h.isContainer(selection)) {
        const texts = selection.findAll(node => h.isText(node)) as TextNode[];
        texts.forEach(textNode => {
         changeLang(textNode);
        });
      }
    });
    figma.notify(`Switched selection to ${LANGUAGES[lang]}`);
    locale.onSelectionChange();
  },
  onMessage: async (msg) => {
    switch (msg.type) {
      case 'update_text':
        const textNode = figma.currentPage.findOne(node => node.id == msg.data.id);
        if(textNode && h.isText(textNode)) {
          console.log(textNode.id, msg.data.key);
          h.setNodeData(textNode, `${PREFIX}key`, msg.data.key);
          if(msg.data.lang) h.setNodeData(textNode, `${PREFIX}lang`, msg.data.lang);
          locale.onSelectionChange();
        }
        break;
      case 'switch_lang': 
        locale.switchLang(msg.lang, msg.localeItems);
        break;
      case 'get_locale_data':
        const localeData = await figma.clientStorage.getAsync('localeData');
        // console.log(localeItems);
        h.postData({localeData });
        break;
      case 'save_locale_data':
        await figma.clientStorage.setAsync('localeData', msg.localeData);
        console.log('Saved', msg.localeData);
        break;
    } 
  },
  onSelectionChange: async () => {
    const getLang = (node) => h.getNodeData(node, `${PREFIX}lang`);
    const getKey = (node) => h.getNodeData(node, `${PREFIX}key`);
    const selection = h.selection();
    const firstNode = h.selection(0);
    if (selection.length == 1 && h.isText(firstNode)) {
      h.postData({
        selectedText: {
          id: firstNode.id,
          key: getKey(firstNode),
          lang: getLang(firstNode),
          characters: firstNode.characters,
        }
      });
    } 
    else if (selection.length >= 1) {
      const allTexts: TextNode[] = selection.reduce((acc, selectionItem) => {
        if(h.isContainer(selectionItem)) {
          const textNodes = selectionItem.findAll(node => h.isText(node));
          acc.push(...textNodes);
        }
        if(h.isText(selectionItem)) {
          acc.push(selectionItem);
        }
        return acc;
      }, []);
      if(allTexts.length > 0) {
        const firstLang = getLang(allTexts[0]);
        const firstKey = getKey(allTexts[0]);
        const isSameLang = allTexts.every(textNode => getLang(textNode) == firstLang);
        const isSameKey = allTexts.every(textNode => getKey(textNode) == firstKey);
        h.postData({
          selectedText: {
            multiple: true,
            lang: isSameLang ? firstLang : MIXED_VALUE,
            key: isSameKey ? firstKey : MIXED_VALUE,
            characters: null,
          }
        })
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
    } else {
      h.postData({selectedText: null});
    }
  },
};
export default locale;
